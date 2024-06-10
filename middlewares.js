/**
 * A middleware layer to validate req coming from the front-end.
 */

import { body, validationResult } from "express-validator";

/**
 * Validates req.body fields and catches any client-side errors
 */
export const validateReqBody = [
    body("baseCurrency")
        .exists()
        .withMessage("baseCurrency field is required!")
        .isIn(["USD", "CAD", "EUR"])
        .withMessage("baseCurrency must be one of USD, CAD, EUR")
        .escape(),
    body("rates")
        .isArray({ min: 1 })
        .withMessage("rates must be a non-empty array"),
    body("lastUpdateOn")
        .exists()
        .withMessage("lastUpdateOn is required")
        .isISO8601()
        .withMessage("lastUpdateOn must be a valid ISO 8601 date"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
