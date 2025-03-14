/**
 * Utility functions for date handling
 */

/**
 * Formats a Date object into a string in the "YYYY-MM-DD" format.
 *
 * @example
 * ```typescript
 * const date = new Date('2025-03-25T10:30:00.000Z');
 * const formatted = formatDateYYYYMMDD(date);
 * console.log(formatted); // "2025-03-25"
 * ```
 *
 * @param date - The Date object to format.
 * @returns The date formatted as a "YYYY-MM-DD" string.
 */
export function formatDateYYYYMMDD(date: Date): string {
    return date.toISOString().split("T")[0];
}

/**
 * Parses a date string in "YYYY-MM-DD" format and returns the corresponding Date object.
 *
 * @example
 * parseYYYYMMDD("2025-03-15") // Returns a Date object for March 15, 2025
 *
 * @param dateString - A string formatted as "YYYY-MM-DD".
 * @returns A Date object constructed from the year, month, and day components.
 */
export function parseYYYYMMDD(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Returns a new Date representing the start of the day (midnight) for the given date.
 *
 * This function creates a copy of the provided Date object and sets its hours, minutes, seconds,
 * and milliseconds to zero, ensuring that the original Date remains unchanged.
 *
 * @param date - The Date for which to compute the start of the day.
 * @returns A new Date object set to midnight of the provided date.
 */
export function startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}

/**
 * Returns a new Date object representing the end of the day (23:59:59.999) for the specified date.
 *
 * The function creates a copy of the input Date, ensuring that the original object remains unmodified, and sets its time to the final millisecond of the day.
 *
 * @param date - The Date object for which the end-of-day is calculated.
 * @returns A new Date object with its time set to 23:59:59.999 on the same day as the input.
 */
export function endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
}

/**
 * Adds a specified number of days to a given date.
 *
 * This function creates and returns a new Date instance by adding the specified number of
 * days to the provided date. The original date remains unchanged. Negative values can be used 
 * to subtract days.
 *
 * @param date - The original Date object.
 * @param days - The number of days to add (or subtract if negative).
 * @returns A new Date object representing the adjusted date.
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
