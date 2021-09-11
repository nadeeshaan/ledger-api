import express from 'express';
import https from 'https';
import fs from 'fs';
import { requestValidator } from '../validators/requestValidator.js';
import { getResponse } from '../controller/itemController.js';

const app = express();
const port = 3443;

app.get('/ledger/', requestValidator(), getResponse());

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

var httpsServer = https.createServer(options, app);
const server = httpsServer.listen(port, () => {
    console.log(`Example app listening at https://localhost:${port}`)
});

export { server };
