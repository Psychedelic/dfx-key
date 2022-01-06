use ic_types::Principal;
use pem::{encode, Pem};
use ring::signature::KeyPair;
use ring::{rand, signature};
use simple_asn1::{
    oid, to_der,
    ASN1Block::{BitString, ObjectIdentifier, Sequence},
};
use std::{env, fs};

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 3 {
        panic!("Please specify mode and file\n    Eg: dfx_key read/write key.pem");
    }

    let mode = &args[1];
    let path = &args[2];

    if mode == "write" {
        write_mode(path);
    } else if mode == "read" {
        read_mode(path);
    } else {
        panic!("Invalid mode");
    }
}

fn write_mode(path: &str) {
    let rng = rand::SystemRandom::new();
    let pkcs8 = signature::Ed25519KeyPair::generate_pkcs8(&rng)
        .expect("Ed25519KeyPair: generate pkcs8 failed");

    let encoded_pem = encode(&Pem {
        tag: "PRIVATE KEY".into(),
        contents: pkcs8.as_ref().to_vec(),
    });
    fs::write(path, encoded_pem).expect("Write to pem failed");

    let metadata = fs::metadata(path).expect("Read metadata failed");
    let mut permissions = metadata.permissions();
    permissions.set_readonly(true);

    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        permissions.set_mode(0o400);
    }

    fs::set_permissions(path, permissions).expect("Set permission failed");
    println!("Generate identity successfully");
}

fn read_mode(path: &str) {
    let bytes = fs::read(path).expect("Read file failed");
    let pair = signature::Ed25519KeyPair::from_pkcs8(
        pem::parse(&bytes)
            .expect("Pem: parse failed")
            .contents
            .as_ref(),
    )
    .expect("Ed25519KeyPair: load pkcs8 failed");

    println!(
        "Principal: {}",
        Principal::self_authenticating(der_encode_public_key(pair.public_key().as_ref().to_vec()))
    );
    println!("{:?}", pair.public_key());
}

fn der_encode_public_key(public_key: Vec<u8>) -> Vec<u8> {
    // see Section 4 "SubjectPublicKeyInfo" in https://tools.ietf.org/html/rfc8410

    let id_ed25519 = oid!(1, 3, 101, 112);
    let algorithm = Sequence(0, vec![ObjectIdentifier(0, id_ed25519)]);
    let subject_public_key = BitString(0, public_key.len() * 8, public_key);
    let subject_public_key_info = Sequence(0, vec![algorithm, subject_public_key]);
    to_der(&subject_public_key_info).expect("DER encoding failed")
}
