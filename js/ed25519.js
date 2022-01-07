import fs from 'fs';
import {Ed25519KeyIdentity} from '@dfinity/identity';
import {toHexString} from './utils.js';

// ED25519 version 2
// Private key and public key are included
export const getIdentityFromPem = (pem) => {
  pem = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace('\n', '')
    .trim();

  // including padding and pair
  const raw = Buffer.from(pem, 'base64');
  console.log('raw: ', raw.toString('hex'));

  const encode = new Uint8Array(raw);

  // including private key (32 bytes before public key)
  // and public key (last 32 bytes)
  const key = encode.slice(encode.length - 64, encode.length);

  const identity = Ed25519KeyIdentity.fromSecretKey(key);

  // CONFIRM

  console.log('Principal: ', identity.getPrincipal().toText());

  const pair = identity.getKeyPair();

  console.log('Private key: ', toHexString(pair.secretKey));

  console.log('Public key: ', toHexString(pair.publicKey.toRaw()));
};

const pem = fs.readFileSync(process.env.PEM_PATH).toString();

getIdentityFromPem(pem)
