import fs from 'fs';
import {Secp256k1KeyIdentity} from '@dfinity/identity';
import {toHexString} from './utils.js';

function getIdentityFromPem(pem) {
  const PEM_BEGIN = '-----BEGIN PRIVATE KEY-----';
  const PEM_END = '-----END PRIVATE KEY-----';

  const PRIV_KEY_INIT =
    '308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420';

  const KEY_SEPARATOR = 'a144034200';
  pem = pem.replace(PEM_BEGIN, '');
  pem = pem.replace(PEM_END, '');
  pem = pem.replace('\n', '');

  const pemBuffer = Buffer.from(pem, 'base64');
  const pemHex = pemBuffer.toString('hex');

  const keys = pemHex.replace(PRIV_KEY_INIT, '');
  const [privateKey, publicKey] = keys.split(KEY_SEPARATOR);

  const identity = Secp256k1KeyIdentity.fromParsedJson([publicKey, privateKey]);

  // CONFIRM

  console.log('Principal: ', identity.getPrincipal().toText());

  const pair = identity.getKeyPair();

  console.log('Private key: ', toHexString(pair.secretKey));

  console.log('Public key: ', toHexString(pair.publicKey.toRaw()));
};

const pem = fs.readFileSync(process.env.PEM_PATH).toString();

getIdentityFromPem(pem)
