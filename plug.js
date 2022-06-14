import fs from "fs";
import { Secp256k1KeyIdentity } from "@dfinity/identity";

import { Cover, sign } from "@psychedelic/cover";

function getIdentityFromPem(pem) {
  const PEM_BEGIN = "-----BEGIN PRIVATE KEY-----";
  const PEM_END = "-----END PRIVATE KEY-----";

  const PRIV_KEY_INIT =
    "308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420";

  const KEY_SEPARATOR = "a144034200";
  pem = pem.replace(PEM_BEGIN, "");
  pem = pem.replace(PEM_END, "");
  pem = pem.replace("\n", "");

  const pemBuffer = Buffer.from(pem, "base64");
  const pemHex = pemBuffer.toString("hex");

  const keys = pemHex.replace(PRIV_KEY_INIT, "");
  const [privateKey, publicKey] = keys.split(KEY_SEPARATOR);

  const identity = Secp256k1KeyIdentity.fromParsedJson([publicKey, privateKey]);

  // CONFIRM

  console.log("Principal: ", identity.getPrincipal().toText());

  const pair = identity.getKeyPair();

  console.log("Private key: ", Buffer.from(pair.secretKey).toString("hex"));

  console.log(
    "Public key: ",
    Buffer.from(pair.publicKey.toRaw()).toString("hex")
  );

  const cover = new Cover(identity);

  // sign a signature
  const timestamp = new Date().getTime();
  console.log("timestamp", timestamp);

  sign(identity, timestamp).then((signature) => {
    console.log("signature", signature);
  });
}

const pem = fs.readFileSync(process.env.PEM_PATH).toString();

getIdentityFromPem(pem);
