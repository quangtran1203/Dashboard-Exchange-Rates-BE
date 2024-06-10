/**
 * Handles logic of the API server. Configures the response and request of each API call.
 */

import ExchangeRates from "./models.js";

/**
 * POST req from front-end that sends exchange rate data.
 * Check the req data against the DB to see if the DB is outdated --> add new records to DB
 */
export const receiveExchangeData = async (req, res) => {
    const { baseCurrency, rates, lastUpdateOn } = req.body;

    // if a baseCurrency doc doesn't exist in the collection --> create a new doc with all the data from req.body
    const baseCurrecyDoc = await ExchangeRates.findOne({ baseCurrency });
    if (!baseCurrecyDoc) {
        const newBaseCurrencyData = new ExchangeRates({
            baseCurrency,
            rates,
            lastUpdateOn,
        });
        await newBaseCurrencyData.save();

        res.status(201).json({
            status: 201,
            message: `Exchange rate data for ${baseCurrency} created!`,
        });
    } else {
        // if data for the baseCurrency exists, only add new data from the req to the DB
        const ratesArray = baseCurrecyDoc.rates;
        const lastSavedDate = ratesArray[ratesArray.length - 1].date;
        let toBeAddedToRates = [];
        let indexOfLastSavedDate = rates.findIndex(
            (record) => record.date === lastSavedDate
        );

        if (indexOfLastSavedDate === rates.length - 1) {
            // no new record to be added
            res.status(200).json({
                status: 200,
                message: "Database is up-to-date!",
            });
        } else {
            // add new exchange rate records to DB
            for (let i = indexOfLastSavedDate; i < rates.length; i++) {
                toBeAddedToRates.push(rates[i]);
            }
            baseCurrecyDoc.rates = [...ratesArray, ...toBeAddedToRates];
            baseCurrecyDoc.lastUpdateOn = new Date().toISOString();
            await baseCurrecyDoc.save();

            res.status(201).json({
                status: 201,
                message: `${toBeAddedToRates.length} new records added to ${baseCurrency}'s exchange rate data`,
            });
        }
    }
};


/**
 *  GET request from front-end that fetches latest exchange rate data for all currencies. 
 */
export const getLatestExchangeData = async (req, res) => {
    const data = [];
    // gather all rates for available baseCurrencies
    const USD_data = await ExchangeRates.findOne({ baseCurrency: "USD" });
    const CAD_data = await ExchangeRates.findOne({ baseCurrency: "CAD" });
    const EUR_data = await ExchangeRates.findOne({ baseCurrency: "EUR" });

    if (USD_data) {
        const usd_rates = USD_data.rates;
        const { date, CAD, EUR } = usd_rates[usd_rates.length - 1];
        data.push({
            USD: {
                date,
                CAD,
                EUR,
            }
        });
    }

    if (CAD_data) {
        const cad_rates = CAD_data.rates;
        const { date, USD, EUR } = cad_rates[cad_rates.length - 1];
        data.push({
            CAD: {
                date,
                USD,
                EUR,
            }
        });
    }

    if (EUR_data) {
        const eur_rates = EUR_data.rates;
        const { date, USD, CAD } = eur_rates[eur_rates.length - 1];
        data.push({
            EUR: {
                date,
                USD,
                CAD,
            }
        });
    }

    res.status(200).json({
        status: 200,
        message: "Latest exchange rate data",
        data
    })
}   
