# Dfinity key reader/writer

Same exact behavior with dfx cli

TODO:
- Secp256k1

#### Example
```
# Generate pem
$ cargo run write my_identity.pem
Generate identity successfully

# Read from identity
$ cargo run write my_identity.pem
Principal: 6urrn-qn6rb-qvc4t-zifnw-rh7js-f4qur-biyxh-w3pwz-pn3bs-timf6-jqe
PublicKey("c718e0e59a883104a24e54e58dce041ef302ce4ddc0a450982c6fba7d6857047")

# Confirm
$ dfx identity import my_identity my_identity.pem
Creating identity: "my_identity".
Created identity: "my_identity".

$ dfx --identity my_identity identity get-principal
6urrn-qn6rb-qvc4t-zifnw-rh7js-f4qur-biyxh-w3pwz-pn3bs-timf6-jqe
```
