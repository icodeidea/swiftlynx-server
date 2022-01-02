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
