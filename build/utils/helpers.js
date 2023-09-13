"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateOfMonthsFromNow = exports.isToday = exports.prefixQueryParams = void 0;
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
// export const getDateOfMonthsFromNow = (months: any) => {
//     const currentDate = new Date();
//     currentDate.setMonth(currentDate.getMonth() + months);
//     return currentDate;
// }
//# sourceMappingURL=helpers.js.map