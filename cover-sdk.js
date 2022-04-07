import fs from 'fs';
import {Cover, getPublicKey, sign} from "@psychedelic/cover";
import {Ed25519KeyIdentity} from "@dfinity/identity";
import {Principal} from "@dfinity/principal";
import {SignIdentity} from "@dfinity/agent";

const pem = fs.readFileSync(process.env.PEM_PATH).toString()
  .replace('-----BEGIN PRIVATE KEY-----', '')
  .replace('-----END PRIVATE KEY-----', '')
  .replace('\n', '')
  .trim();

const raw = Buffer.from(pem, 'base64')
  .toString('hex')
  .replace('3053020101300506032b657004220420', '')
  .replace('a123032100', '');

const key = new Uint8Array(Buffer.from(raw, 'hex'));

const identity = Ed25519KeyIdentity.fromSecretKey(key);

const cover = new Cover(identity);

// verify a canister
const isVerified = await cover.verify(Principal.fromText("iftvq-niaaa-aaaai-qasga-cai"));
console.log("isVerified", isVerified);

// get wasm hash from IC network
const icHash = await cover.getICHash(Principal.fromText("iftvq-niaaa-aaaai-qasga-cai"));
console.log("icHash", icHash);

// get wasm hash from Cover verification
const coverHash = await cover.getCoverHash(Principal.fromText("iftvq-niaaa-aaaai-qasga-cai"));
console.log("coverHash", coverHash);

// get Cover verification by canister ID
const verification = await cover.getVerificationByCanisterId(Principal.fromText("iftvq-niaaa-aaaai-qasga-cai"));
console.log("verification", verification);

// get public key
const publicKey = getPublicKey(identity);
console.log("publicKey", publicKey);

// sign a signature
const timestamp = new Date().getTime();
console.log("timestamp", timestamp);

const signature = await sign(identity, timestamp);
console.log("signature", signature);