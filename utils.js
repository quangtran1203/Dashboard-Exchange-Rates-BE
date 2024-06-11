import ExchangeRates from './models.js';

/**
 * Formats data to correct request body data for an API call to server.
 */
export const formatRequest = (baseCurrency, data, dateNow) => {
    const { dates, cad, usd, eur } = data;
    const rates = [];
    if (baseCurrency === "USD") {
        for (let i = 0; i < dates.length; i++) {
            rates.push({
                date: dates[i],
                CAD: cad[i],
                EUR: eur[i],
            })
        }
    }
    else if (baseCurrency === "CAD") {
        for (let i = 0; i < dates.length; i++) {
            rates.push({
                date: dates[i],
                USD: usd[i],
                EUR: eur[i],
            })
        }
    }
    else {
        for (let i = 0; i < dates.length; i++) {
            rates.push({
                date: dates[i],
                USD: usd[i],
                CAD: cad[i],
            })
        }
    }

    const formattedData = {
        baseCurrency,
        rates,
        lastUpdateOn: dateNow,
    };

    return formattedData;
};


/**
 * Makes an API GET request to Frankfurter API to get new exchange rate data.
 * 
 * Ideally, this only acts as back-up to ensure that the DB always has the latest exchange rate data in case
 * no user interacts with the front-end to trigger DB seeding.
 */
export const fetchDataAndCompare = async () => {
    try {
        const currentDate = new Date();
        const pastDate = new Date(currentDate);
        pastDate.setFullYear(pastDate.getFullYear() - 2);
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        const pastDateFormatted = formatDate(pastDate);
        const res = await fetch(`https://api.frankfurter.app/${pastDateFormatted}..?from=USD&to=USD,CAD,EUR`);
        // comparing the end_date (latest exchange rate data date) from API with the lastUpdatedDate from DB
        const result = await res.json();
        const endDate = result.end_date;

        const USDDocData = await ExchangeRates.findOne({ baseCurrency: "USD" });
        const rates = USDDocData.rates;
        const lastUpdatedDate = rates[rates.length - 1].date;

        if (endDate === lastUpdatedDate) {
            return "DB is up-to-date!";
        }
        else {
            return "DB is outdated!"
        }
    }
    catch (err) {
        console.log(err);
    }
}