/**
 * Defines collection and model types that will be fed to the DB.
 */

import mongoose from "mongoose";

const RatesSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    CAD: Number,
    USD: Number,
    EUR: Number,
});

const ExchangeRateSchema = new mongoose.Schema({
    baseCurrency: {
        type: String,
        required: true,
    },
    rates: {
        type: [RatesSchema],
        required: true,
    },
    lastUpdateOn: {
        type: String,
        required: true,
    },
});

export default mongoose.model("exchangeRates", ExchangeRateSchema);