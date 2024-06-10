/**
 * A middleware layer to validate req coming from the front-end.
 */

import { body, validationResult } from "express-validator";

export const validateBaseCurrencyBody = () => {
    return [
        body("baseCurrency")
            .exists()
            .withMessage("baseCurrency field is required!")
            .isIn(["USD", "CAD", "EUR"])
            .withMessage("baseCurrency must be one of USD, CAD, EUR"),
    ];
};

export const validateRatesBody = () => {
    return [
        body("rates").isArray({ min: 1 }).withMessage("Rates must me a non-empty array!")
    ]
};

export const validateDateBody = () => {
    return [
        body("lastUpdateOn").exists().withMessage("lastUpdateOn date is required!")
            .isISO8601().withMessage("lastUpdateOn must be a valid date!")
    ]
}

/**
 * Catches all errors during the middleware layer
 */
export const catchValidateErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = "";
        errors.array().map((err) => (error += err.msg + " "));
        return res.status(400).json({
            status: 400,
            message: error.toString().trim(),
        });
    }
    next();
}