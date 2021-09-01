import { parseISO, addDays, differenceInDays, format, addMonths, getDate, subDays, isAfter, isSameDay } from 'date-fns';
import { PaymentFrequency } from '../consts/constants.js';

const getResponse = function () {
    console.log('GET RESPONSE');
    return function (req, res) {
        var items = getLineItems(req.query);
        return res.status(200)
            .send(items);
    };
}

function getLineItems(queryParams) {
    let startDate = queryParams.start_date;
    let endDate = queryParams.end_date;
    let paymentFrequency = queryParams.frequency;
    let weeklyRent = queryParams.weekly_rent;
    let timeZone = queryParams.timeZone;

    if (paymentFrequency === PaymentFrequency.WEEKLY.value) {
        return getWeekly(startDate, endDate, weeklyRent);
    }

    if (paymentFrequency === PaymentFrequency.FORTNIGHTLY.value) {
        return getFortnightly(startDate, endDate, weeklyRent, PaymentFrequency.WEEKLY.days);
    }

    if (paymentFrequency === PaymentFrequency.MONTHLY.value) {
        return getMonthly(weeklyRent, startDate, endDate);
    }

    return [];
}

function getWeekly(startDate, endDate, weeklyRent, paymentGap) {
    let items = [];
    let isoStart = parseISO(startDate);
    let isoEnd = parseISO(endDate);
    let dateDiff = differenceInDays(isoEnd, isoStart) + 1;
    let excessNoOfDates = dateDiff % paymentGap;
    let noOfPayments = Math.floor(dateDiff / paymentGap);

    let paymentStart = isoStart;
    let paymentDate;
    for (let index = 0; index < noOfPayments; index++) {
        paymentDate = addDays(paymentStart, (paymentGap - 1));
        items[index] = {
            start_date: format(paymentStart, 'MMMM do, yyyy'),
            end_date: format(paymentDate, 'MMMM do, yyyy'),
            amount: (weeklyRent / 7) * paymentGap
        };
        paymentStart = addDays(paymentDate, 1);
    }
    if (excessNoOfDates > 0) {
        paymentDate = addDays(paymentStart, excessNoOfDates - 1);
        items[noOfPayments] = {
            start_date: format(paymentStart, 'MMMM do, yyyy'),
            end_date: format(paymentDate, 'MMMM do, yyyy'),
            amount: (weeklyRent / 7) * excessNoOfDates
        };
    }

    return items;
}

function getFortnightly(startDate, endDate, weeklyRent) {
    return getWeekly(startDate, endDate, weeklyRent, PaymentFrequency.FORTNIGHTLY.days);
}

function getMonthly(weeklyRent, startDate, endDate) {
    let items = [];
    let isoStart = parseISO(startDate);
    let isoEnd = parseISO(endDate);

    let originalPaymentDay = getDate(isoStart);
    let paymentStart = isoStart;
    let itemCounter = 0;
    while (true) {
        // let nextPayment = nextPaymentInMonth(originalPaymentDay, paymentStart);
        let nextPayment = addMonths(isoStart, itemCounter + 1);
        if (isAfter(nextPayment, isoEnd)) {
            // Calculated payment date is after the end of the range.
            let diffInDays = differenceInDays(nextPayment, isoEnd);
            nextPayment = subDays(nextPayment, diffInDays);
            items[items.length] = {
                start_date: format(paymentStart, 'MMMM do, yyyy'),
                end_date: format(subDays(nextPayment, 1), 'MMMM do, yyyy'),
                amount: (weeklyRent / 7) * diffInDays
            };
            break;
        }
        items[items.length] = {
            start_date: format(paymentStart, 'MMMM do, yyyy'),
            end_date: format(subDays(nextPayment, 1), 'MMMM do, yyyy'),
            amount: ((weeklyRent / 7) * 365) / 12
        };
        if (isSameDay(nextPayment, isoEnd)) {
            break;
        }
        paymentStart = nextPayment;
        itemCounter++;
    }

    return items;
}

export { getResponse };
