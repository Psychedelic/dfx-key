import fs from 'fs';
import {Ed25519KeyIdentity, Ed25519PublicKey} from '@dfinity/identity';
import {Principal} from '@dfinity/principal';
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

  console.log('Private key:', Buffer.from(pair.secretKey).toString("hex"));

  console.log('Public key:', Buffer.from(pair.publicKey.toRaw()).toString("hex"));

  console.log('==================================================================');

  const newPair = tweetnacl.sign.keyPair.fromSeed(key.slice(0, 32));

  console.log('New private key:', Buffer.from(newPair.secretKey).toString("hex"));

  console.log('New public key:', Buffer.from(newPair.publicKey).toString("hex"));

  console.log('==================================================================');

  const challenge = '3x7en-uqaaa-aaaai-abgca-cai';
  console.log('Message to verify:', challenge);

  const message = new Uint8Array(Buffer.from(challenge, 'utf-8'));
  const signature = tweetnacl.sign.detached(message, newPair.secretKey);
  console.log('Signature:', Buffer.from(signature).toString("hex"));

  const result = tweetnacl.sign.detached.verify(message, signature, newPair.publicKey);
  console.log('Verify signature:', result);
};

const pem = fs.readFileSync(process.env.PEM_PATH).toString();

getIdentityFromPem(pem)
