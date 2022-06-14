# Internet Computer's key reader/writer

- Provides examples of how to get private key, public key out of a PEM file, how to use them to sign a message to get a signature and how to verify a signature.

## Usage

- Using ED25519 key [PEM file](ed25519.js)

```bash
PEM_PATH=YOUR_PEM_PATH node ed25519.js
```

- Using [Plug's PEM file](plug.js)

```bash
PEM_PATH=YOUR_PEM_PATH node plug.js
```

- Using [CoverSDK](cover-sdk.js)

```bash
PEM_PATH=YOUR_PEM_PATH node cover-sdk.js
```
