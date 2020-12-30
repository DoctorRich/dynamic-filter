import { DateTime, Duration } from "luxon";
import { FilterUnaryOperation } from "../factory/filterFactory";

// Tokens
export const UPPER_TOKEN = 'UPPER';
export const LOWER_TOKEN = 'LOWER';
export const TRIM_TOKEN = 'TRIM';
export const DURATION_TOKEN = 'DURATION';
export const DATE_TIME_TOKEN = 'DATETIME';

export const isString = (s: any) => s != null && (typeof s === 'string' || s instanceof String);
// String Operations
export const UPPER_CASE_OPERATION: FilterUnaryOperation = o => isString(o) ? (o as string).toUpperCase() : o;
export const LOWER_CASE_OPERATION: FilterUnaryOperation = o => isString(o) ? (o as string).toLowerCase() : o;
export const TRIM_OPERATION: FilterUnaryOperation = o => isString(o) ? (o as string).trim() : o;
// Number operations

// Date Operations
export const AS_DURATION_OPERATION: FilterUnaryOperation = o => {
    if (o == null || Duration.isDuration(o)) {
        return o;
    }
    if (isString(o)) {
        return Duration.fromISO(o);
    }
    const n = Number(o);
    return isNaN(n) ? Duration.fromObject(o) : Duration.fromMillis(n);
}
export const AS_DATE_TIME_OPERATION: FilterUnaryOperation = o => {
    if (o == null || DateTime.isDateTime(o)) {
        return o;
    }
    if (o instanceof Date) {
        return DateTime.fromJSDate(o);
    }
    if (isString(o)) {
        return DateTime.fromISO(o);
    }
    const n = Number(o);
    return isNaN(n) ? DateTime.fromObject(o) : DateTime.fromMillis(n);
}
