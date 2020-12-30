import { DateTime } from "luxon";
import { FilterBinaryOperation } from "../factory/filterFactory";

// Tokens
export const ADD_TOKEN = '+';
export const MINUS_TOKEN = '-';
export const MULTIPLY_TOKEN = '*';
export const DIVIDE_TOKEN = '/';

// Operations
export const MULTIPLY_OPERATION: FilterBinaryOperation = (a, b) => a * b;
export const DIVIDE_OPERATION: FilterBinaryOperation = (a, b) => a / b;
export const ADD_OPERATION: FilterBinaryOperation = (a, b) => {
    if (DateTime.isDateTime(a)) {
        return b != null ? (a as DateTime).plus(b) : a;
    }
    if (DateTime.isDateTime(b)) {
        return a != null ? (b as DateTime).plus(a) : b;
    }
    return a + b;
};
export const MINUS_OPERATION: FilterBinaryOperation = (a, b) => {
    if (DateTime.isDateTime(a)) {
        return b != null ? (a as DateTime).minus(b) : a;
    }
    return a - b;
}

