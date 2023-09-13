export const prefixQueryParams = async (baseUrl: string, paramObj: object): Promise<string> => {
    for (const param in paramObj) {
        baseUrl += `&${param}=${paramObj[param]}`;
    }
    
    return baseUrl;
};

export const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
}

export const getDateOfMonthsFromNow = (months: any) => {
    return new Date().setMonth(new Date().getMonth() + (months));
    // return date;
}

// export const getDateOfMonthsFromNow = (months: any) => {
//     const currentDate = new Date();
//     currentDate.setMonth(currentDate.getMonth() + months);
//     return currentDate;
// }
