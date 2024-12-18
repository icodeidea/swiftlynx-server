import axios from "axios";
import cron from 'node-cron';
import { redis } from "../redis"


export interface CurrencyMetadata {
    fullName: string;
    symbol: string;
    flagUrl: string;
}

export interface ExchangeRate {
    currency: string;
    rate: number;
    inverseRate: number;
    flagUrl: string;
    fullName: string;
    symbol: string;
    trend: 'up' | 'down' | 'stable';
    percentageChange: string;
}

const currencyData: Record<string, CurrencyMetadata> = {
    'USD': { 
        fullName: 'United States',
        symbol: '$',
        flagUrl: 'https://flagcdn.com/w320/us.png'
    },
    'EUR': { 
        fullName: 'European Union',
        symbol: '€',
        flagUrl: 'https://flagcdn.com/w320/eu.png'
    },
    'GBP': { 
        fullName: 'United Kingdom',
        symbol: '£',
        flagUrl: 'https://flagcdn.com/w320/gb.png',
    },
    'JPY': { 
        fullName: 'Japan',
        symbol: '¥',
        flagUrl: 'https://flagcdn.com/w320/jp.png',
    },
    'CNY': { 
        fullName: 'China',
        symbol: '¥',
        flagUrl: 'https://flagcdn.com/w320/cn.png',
    },
    'CAD': { 
        fullName: 'Canada',
        symbol: 'C$',
        flagUrl: 'https://flagcdn.com/w320/ca.png',
    },
    'AUD': { 
        fullName: 'Australia',
        symbol: 'A$',
        flagUrl: 'https://flagcdn.com/w320/au.png',
    },
    'CHF': { 
        fullName: 'Switzerland',
        symbol: 'CHF',
        flagUrl: 'https://flagcdn.com/w320/ch.png',
    },
    'INR': { 
        fullName: 'India',
        symbol: '₹',
        flagUrl: 'https://flagcdn.com/w320/in.png',
    },
    'ZAR': { 
        fullName: 'South Africa',
        symbol: 'R',
        flagUrl: 'https://flagcdn.com/w320/za.png',
    }
};

async function getNGNExchangeRates() {
    const targetCurrencies = Object.keys(currencyData);

    try {
        // Using ExchangeRate-API (requires free API key)
        const apiKey = process.env.EXCHANGE_RATE_API_KEY || '725a8f0ab78cb58569dd2ed0';
        const baseUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/NGN`;

        // Fetch rates
        const response: any = await axios.get(baseUrl);
        const rates = response?.data?.conversion_rates as any;

        // Prepare exchange rates with additional metadata and historical tracking
        const exchangeRates: ExchangeRate[] = await Promise.all(
            targetCurrencies.map(async (currency) => {
                const currentRate = rates[currency];
                
                // Retrieve previous rate from Redis
                const previousRateKey = `ngn_rate:${currency}`;
                const previousRateStr = await redis.get(previousRateKey);
                const previousRate = previousRateStr ? parseFloat(previousRateStr) : null;

                // Determine trend
                let trend: 'up' | 'down' | 'stable' = 'stable';
                if (previousRate !== null) {
                    trend = currentRate > previousRate ? 'up' : 
                            currentRate < previousRate ? 'down' : 'stable';
                }

                // Store current rate in Redis for next comparison
                await redis.set(previousRateKey, currentRate.toString());

                return {
                    currency: currency,
                    rate: currentRate,
                    inverseRate: 1 / currentRate,
                    flagUrl: currencyData[currency].flagUrl,
                    fullName: currencyData[currency].fullName,
                    symbol: currencyData[currency].symbol,
                    trend: trend,
                    percentageChange: previousRate ? 
                        ((currentRate - previousRate) / previousRate * 100).toFixed(2) : 
                        (currentRate * 100).toFixed(2)
                };
            })
        );

        return {
            baseCurrency: 'NGN',
            timestamp: new Date().toISOString(),
            rates: exchangeRates
        };
    } catch (error) {
        console.error('Error in getting exchange rates:', error);
        throw error;
    }
}

async function displayRates() {
    try {
        const rates = await getNGNExchangeRates();
        console.log('Exchange Rates for Nigerian Naira (NGN):');
        console.log('Base Currency:', rates.baseCurrency);
        console.log('Timestamp:', rates.timestamp);
        
        console.log('\nCurrency Rates:');
        rates.rates.forEach(rate => {
            console.log(`${rate.currency}:`);
            console.log(`  Flag URL: ${rate.flagUrl}`);
            console.log(`  1 NGN = ${rate.rate?.toFixed(5) || 'N/A'} ${rate.currency}`);
            console.log(`  1 ${rate.currency} = ${rate.inverseRate?.toFixed(2) || 'N/A'} NGN`);
            console.log(`  Trend: ${rate.trend}`);
            console.log(`  Percentage Change: ${rate.percentageChange}%`);
        });
    } catch (error) {
        console.error('Failed to get rates:', error);
    }
}

// Later, retrieve recent rates
async function displayRecentRates() {
    const recentRates = await getStoredExchangeRates(1);
}

// Function to store exchange rates in Redis
async function storeExchangeRates() {
    try {
        // Fetch latest exchange rates
        const ratesData = await getNGNExchangeRates();

        // Generate a unique key for this record
        const key = `ngn_exchange_rates:${new Date().toISOString()}`;

        // Store the entire rates object in Redis
        await redis.set(key, JSON.stringify(ratesData));

        // Optional: Maintain a list of recent rate records
        await redis.lpush('ngn_exchange_rates_history', key);
        
        // Limit history to last 30 records (adjust as needed)
        await redis.ltrim('ngn_exchange_rates_history', 0, 29);

        console.log(`Exchange rates stored at ${new Date().toISOString()}`);
    } catch (error) {
        console.error('Failed to store exchange rates:', error);
    }
}

// Function to retrieve stored exchange rates
async function getStoredExchangeRates(limit = 5) {
    try {
        // Get the most recent rate record keys
        const recentKeys = await redis.lrange('ngn_exchange_rates_history', 0, limit - 1);

        // Retrieve and parse the rate records
        const rateRecords = await Promise.all(
            recentKeys.map(async (key) => {
                const rateData = await redis.get(key);
                return rateData ? JSON.parse(rateData) : null;
            })
        );

        return rateRecords.filter(record => record !== null);
    } catch (error) {
        console.error('Failed to retrieve exchange rates:', error);
        return [];
    }
}

// Schedule cron jobs
function scheduleExchangeRateJobs() {
    // Cron job to run 5 times a day at specific intervals
    // 6:00 AM, 10:00 AM, 2:00 PM, 6:00 PM, and 10:00 PM
    const schedules = [
        '0 6 * * *',   // 6:00 AM
        '0 10 * * *',  // 10:00 AM
        '0 14 * * *',  // 2:00 PM
        '0 18 * * *',  // 6:00 PM
        '0 22 * * *'   // 10:00 PM
    ];

    schedules.forEach((schedule, index) => {
        cron.schedule(schedule, () => {
            console.log(`Running exchange rate job ${index + 1} at ${new Date().toISOString()}`);
            storeExchangeRates();
        });
    });

    console.log('Exchange rate cron jobs scheduled successfully');
}

// Main function to start the scheduling
async function initExchangeRateTracking() {
    try {
        console.log("tracking exchange rates")
        // Run immediately on startup
        await storeExchangeRates();

        // Schedule recurring jobs
        scheduleExchangeRateJobs();
    } catch (error) {
        console.error('Failed to initialize exchange rate tracking:', error);
    }
}

// Export functions for potential external use
export {
    currencyData,
    getNGNExchangeRates,
    displayRates,
    initExchangeRateTracking,
    storeExchangeRates,
    getStoredExchangeRates,
    displayRecentRates
};

// If running as a standalone script
if (require.main === module) {
    initExchangeRateTracking();
}

// Optional: Uncomment to run directly
// displayRates();