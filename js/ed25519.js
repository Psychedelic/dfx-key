import fs from 'fs';
import {Ed25519KeyIdentity, Ed25519PublicKey} from '@dfinity/identity';
import {Principal} from '@dfinity/principal';
import {toHexString} from './utils.js';
import tweetnacl from 'tweetnacl';

// ED25519 version 2
// Private key and public key are included
export const getIdentityFromPem = (pem) => {
  pem = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace('\n', '')
    .trim();

  const raw = Buffer.from(pem, 'base64')
    .toString('hex')
    .replace('3053020101300506032b657004220420', '')
    .replace('a123032100', '');

  // including private key (32 bytes before public key)
  // and public key (last 32 bytes)
  const key = new Uint8Array(Buffer.from(raw, 'hex'));

  const identity = Ed25519KeyIdentity.fromSecretKey(key);

  // =============================== CONFIRM ===============================

  console.log('Principal:', identity.getPrincipal().toText());

  const pair = identity.getKeyPair();

  console.log('Private key:', toHexString(pair.secretKey));

  console.log('Public key:', toHexString(pair.publicKey.toRaw()));

  console.log('==================================================================');

  const newPair = tweetnacl.sign.keyPair.fromSeed(key.slice(0, 32));

  console.log('New private key:', toHexString(newPair.secretKey));

  console.log('New public key:', toHexString(newPair.publicKey));

  console.log('==================================================================');

  const challenge = 'PUT YOUR MESSAGE HERE';
  console.log('Message to verify:', challenge);

  const message = new Uint8Array(Buffer.from(challenge, 'utf-8'));
  const signature = tweetnacl.sign.detached(message, newPair.secretKey);
  console.log('Signature:', toHexString(signature));

  const result = tweetnacl.sign.detached.verify(message, signature, newPair.publicKey);
  console.log('Verify signature:', result);
};

const pem = fs.readFileSync(process.env.PEM_PATH).toString();

getIdentityFromPem(pem)
