/**
 * Utility functions for date handling
 */

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDateYYYYMMDD(date: Date): string {
    return date.toISOString().split("T")[0];
}

/**
 * Parse a string in YYYY-MM-DD format into a Date
 */
export function parseYYYYMMDD(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Get a Date object for the start of a day (midnight)
 */
export function startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}

/**
 * Get a Date object for the end of a day (23:59:59.999)
 */
export function endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
