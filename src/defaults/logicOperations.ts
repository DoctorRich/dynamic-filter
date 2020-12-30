import { FilterPredicate, LogicOperator } from "../factory/filterFactory";

// Tokens
export const AND_TOKEN = '&';
export const OR_TOKEN = '|';
export const XOR_TOKEN = '^';

// Operations
export const AND_OPERATOR: LogicOperator<any> = (t, filters) => filters.reduce((m: boolean, f: FilterPredicate<any>) => m && f(t), true);
export const OR_OPERATOR: LogicOperator<any> = (t, filters) => filters.reduce((m: boolean, f: FilterPredicate<any>) => m || f(t), false);
export const XOR_OPERATOR: LogicOperator<any> = (t, filters) => filters.reduce((m: number, f: FilterPredicate<any>) => f(t) ? m + 1 : m, 0) === 1;
