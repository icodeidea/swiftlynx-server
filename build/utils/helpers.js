"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTimestampExpired = exports.isTimeDue = exports.getDateRange = exports.getDateOfMonthsFromNow = exports.isToday = exports.prefixQueryParams = void 0;
const prefixQueryParams = async (baseUrl, paramObj) => {
    for (const param in paramObj) {
        baseUrl += `&${param}=${paramObj[param]}`;
    }
    return baseUrl;
};
exports.prefixQueryParams = prefixQueryParams;
const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear();
};
exports.isToday = isToday;
const getDateOfMonthsFromNow = (months) => {
    return new Date().setMonth(new Date().getMonth() + (months));
    // return date;
};
exports.getDateOfMonthsFromNow = getDateOfMonthsFromNow;
/**
 * Calculates start and end dates based on a given number of months from now
 * @param numberOfMonths Number of months to calculate the date range
 * @returns An object with startDate and endDate
 */
function getDateRange(numberOfMonths) {
    // Get the current date
    const now = new Date();
    // Create a copy of the current date to manipulate
    const startDate = new Date(now);
    // Set the start date to the first day of the current month
    // startDate.setDate(1);
    // Create an end date by adding the specified number of months
    const endDate = new Date(now);
    endDate.setMonth(now.getMonth() + numberOfMonths);
    // Set the end date to the last day of the final month
    // endDate.setDate(0); // This sets the date to the last day of the previous month
    console.log("startDate", startDate);
    console.log("endDate", endDate);
    return {
        startDate,
        endDate
    };
}
exports.getDateRange = getDateRange;
function isTimeDue(startDate, endDate) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Check if current time is past the endDate
    return now > end;
}
exports.isTimeDue = isTimeDue;
function isTimestampExpired(expirationTimeStr) {
    try {
        // First try to parse as a number (milliseconds)
        let expirationTime = Number(expirationTimeStr);
        // If not a valid number, try parsing as a date string
        if (isNaN(expirationTime)) {
            expirationTime = Date.parse(expirationTimeStr);
        }
        // Check if the parsed time is valid
        if (isNaN(expirationTime)) {
            throw new Error('Invalid timestamp format');
        }
        return Date.now() > expirationTime;
    }
    catch (error) {
        console.error('Error parsing timestamp:', error);
        return false; // or handle the error as needed
    }
}
exports.isTimestampExpired = isTimestampExpired;
// export const getDateOfMonthsFromNow = (months: any) => {
//     const currentDate = new Date();
//     currentDate.setMonth(currentDate.getMonth() + months);
//     return currentDate;
// }
//# sourceMappingURL=helpers.js.map