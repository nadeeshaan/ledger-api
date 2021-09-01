import express from 'express';

const requestValidator = function (fields) {
    return (req, res, next) => {
        for (let field of fields) {
            if (!req.query[field]) {
                return res
                    .status(400)
                    .send(`${field} is missing`);
            }
        }

        next();
    };
}

export { requestValidator };
