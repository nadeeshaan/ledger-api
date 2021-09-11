import express from 'express';
import { requestValidator } from '../validators/requestValidator.js';
import { getResponse } from '../controller/itemController.js';

const app = express();
const port = 3000;

app.get('/ledger/', requestValidator(), getResponse());

const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

export { server };

