import fs from "fs";
import { getPublicKey, sign, Cover } from "@psychedelic/cover";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { Principal } from "@dfinity/principal";

const pem = fs
  .readFileSync(process.env.PEM_PATH)
  .toString()
  .replace("-----BEGIN PRIVATE KEY-----", "")
  .replace("-----END PRIVATE KEY-----", "")
  .replace("\n", "")
  .trim();

const raw = Buffer.from(pem, "base64")
  .toString("hex")
  .replace("3053020101300506032b657004220420", "")
  .replace("a123032100", "");

const key = new Uint8Array(Buffer.from(raw, "hex"));

const identity = Ed25519KeyIdentity.fromSecretKey(key);

// get public key
const publicKey = getPublicKey(identity);
console.log("publicKey", publicKey);

// sign a signature
const timestamp = new Date().getTime();
console.log("timestamp", timestamp);

const signature = await sign(identity, timestamp);
console.log("signature", signature);

// =========================================================================================================
// EXAMPLE
// =========================================================================================================
const cover = new Cover(identity, { isDevelopment: true });

await cover.deleteBuildConfig(Principal.from("3x7en-uqaaa-aaaai-abgca-cai"));

await cover.saveBuildConfig({
  canisterId: "3x7en-uqaaa-aaaai-abgca-cai",
  dfxVersion: "0.11.2",
  delegateCanisterId: "",
  canisterName: "cover_test",
  commitHash: "1423bbf5596263d75fb5414fea45237f9b6ed4f2",
  repoUrl: "psychedelic/cover",
  rustVersion: "1.63.0",
  optimizeCount: 0,
  repoAccessToken: "",
});

const buildConfigs = await cover.getBuildConfigs(
  Principal.from("3x7en-uqaaa-aaaai-abgca-cai")
);
console.log("buildConfigs", buildConfigs);

const buildConfig = await cover.getBuildConfigByCanisterId(
  Principal.from("3x7en-uqaaa-aaaai-abgca-cai")
);
console.log("buildConfig", buildConfig);

const anonymousCoverMetadata= await Cover.anonymousCoverMetadata(
  Principal.from("3x7en-uqaaa-aaaai-abgca-cai")
);
console.log("anonymousCoverMetadata", anonymousCoverMetadata);

// const coverMetadata= await cover.coverMetadata(
//   Principal.from("3x7en-uqaaa-aaaai-abgca-cai")
// );
// console.log("coverMetadata", coverMetadata);

// ========================================================================================================
// BUILD
// ========================================================================================================
// await cover.buildWithConfig("3x7en-uqaaa-aaaai-abgca-cai");

// await Cover.buildWithCoverMetadata("3x7en-uqaaa-aaaai-abgca-cai", undefined, {
//   isDevelopment: true,
// });

// await cover.build({
//   canisterId: "3x7en-uqaaa-aaaai-abgca-cai",
//   dfxVersion: "0.11.2",
//   delegateCanisterId: "",
//   canisterName: "cover_test",
//   commitHash: "1423bbf5596263d75fb5414fea45237f9b6ed4f2",
//   repoUrl: "psychedelic/cover",
//   rustVersion: "1.63.0",
//   optimizeCount: 0,
//   repoAccessToken: "",
// });
