/**
 * Sets up API endpoints
 * - POST: fe sends updated data --> add to db
 * - GET: fe wants the latest exchange rate --> send back the latest rate
 */

import express from "express";
import {
    catchValidateErrors,
    validateBaseCurrencyBody,
    validateDateBody,
    validateRatesBody,
} from "./middlewares";
import { receiveExchangeData } from "./controllers";

const router = express.Router();

router.post(
    "/exchange-rate-data",
    validateBaseCurrencyBody,
    validateRatesBody,
    validateDateBody,
    catchValidateErrors,
    receiveExchangeData
);


export default router;