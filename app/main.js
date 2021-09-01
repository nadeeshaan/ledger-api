import express from 'express';
import { requestValidator } from '../validators/requestValidator.js';
import { getResponse } from '../controller/itemController.js';
import { parseISO, addDays, differenceInDays } from 'date-fns';

const app = express();
const port = 3000;

app.get('/ledger/', requestValidator(['start_date', 'end_date', 'frequency', 'weekly_rent']), getResponse());

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

function getLineItems(queryParams) {
    // use destructuring assignment
    let startDate = parseISO(queryParams.start_date);
    let endDate = parseISO(queryParams.end_date);
    let paymentFrequency = queryParams.frequency;
    let weeklyRent = queryParams.weekly_rent;
    let timeZone = queryParams.timeZone;
}

