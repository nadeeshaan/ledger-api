import { parseISO, isBefore } from 'date-fns';
import { PaymentFrequency } from '../consts/constants.js';
import { ValidationError } from '../consts/errors.js';

const START_DATE = 'start_date';
const END_DATE = 'end_date';
const FREQUENCY = 'frequency';
const WEEKLY_RENT = 'weekly_rent';

const queryParams = [START_DATE, END_DATE, FREQUENCY, WEEKLY_RENT];

const requestValidator = function () {
    return (req, res, next) => {
        try {
            validateParams(req);
        } catch (e) {
            if (e instanceof ValidationError) {
                return res
                    .status(400)
                    .send(e.message);
            }
            return res
                .status(500)
                .send(e.message);
        }

        next();
    };
}

function dateRangeValidator(start, end) {
    if (!isBefore(start, end)) {
        throw new ValidationError('start date should be before the end date');
    }
}

function validateParams(req) {
    for (let paramName of queryParams) {
        let paramValue = req.query[paramName];
        if (!paramValue) {
            throw new ValidationError(`Required parameter: [${paramName}]  is missing`);
        }
    }

    // validate the dates
    try {
        dateRangeValidator(parseISO(req.query[START_DATE]), parseISO(req.query[END_DATE]));
    } catch (e) {
        throw new ValidationError(`Invalid dates are provided. \n ${e}`);
    }

    // validate the frequency
    let frequency = req.query[FREQUENCY];
    if (frequency !== PaymentFrequency.WEEKLY.value
        && frequency !== PaymentFrequency.FORTNIGHTLY.value
        && frequency !== PaymentFrequency.MONTHLY.value) {
        throw new ValidationError(`Invalid frequency [${frequency}] provided`);
    }

    let rent = req.query[WEEKLY_RENT];
    if (Math.sign(rent) !== 1) {
        throw new ValidationError(`Provided rent should be a positive value`);
    }

    return true;
}

export { requestValidator };
