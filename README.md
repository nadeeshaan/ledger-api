# Ledger API implementation with Node

## Description
This repository implements an https node server for a ledger API.

## How to build the repo
1. Go to the project root and run `npm install` which will install all the required dependencies
2. Run the `npm run start` command to run the server. The server will start on `https://localhost:3443`
3. Run the `npm run test` command to run the tests

## How to generate the certificates
This server expects to have a self signed certificate on the project root. In order to generate the certificates, follow the steps

```
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
```
Run the above commands one by one from the project root.