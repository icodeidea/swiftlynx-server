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

/**
 * Calculates start and end dates based on a given number of months from now
 * @param numberOfMonths Number of months to calculate the date range
 * @returns An object with startDate and endDate
 */
export function getDateRange(numberOfMonths: number): { startDate: Date; endDate: Date } {
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
  
    console.log("startDate", startDate)
    console.log("endDate", endDate)
  
    
    return {
      startDate,
      endDate 
    };
  }

export function isTimeDue(startDate: string | Date, endDate: string | Date): boolean {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Check if current time is past the endDate
    return now > end;
  }


export function isTimestampExpired(expirationTimeStr) {
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
  } catch (error) {
    console.error('Error parsing timestamp:', error);
    return false; // or handle the error as needed
  }
}


// export const getDateOfMonthsFromNow = (months: any) => {
//     const currentDate = new Date();
//     currentDate.setMonth(currentDate.getMonth() + months);
//     return currentDate;
// }
