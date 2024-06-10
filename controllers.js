/**
 * Handles logic of the API server. Configures the response and request of each API call.
 */

import ExchangeRates from "./models";

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
            baseCurrecyDoc.lastUpdateOn = new Date();
            await baseCurrecyDoc.save();

            res.status(201).json({
                status: 201,
                message: `${toBeAddedToRates.length} new records added to ${baseCurrency}'s exchange rate data`,
            });
        }
    }
};
