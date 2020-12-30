import { FilterBinaryPredicate, FilterBinaryPredicateDecorator } from "../factory/filterFactory";
import deep from 'deep-equal';

// Tokens
export const CEQ_TOKEN = '~';
export const EQ_TOKEN = '=';
export const NEQ_TOKEN = '!=';
export const LT_TOKEN = '<';
export const GT_TOKEN = '>';

// Operations
export const STRICT_NOT_EQUALS_PREDICATE: FilterBinaryPredicate = (a, b) => a !== b;
export const DEEP_EQUALS_PREDICATE: FilterBinaryPredicate = (a, b) => deep(a, b, { strict: true });
export const COERCIVE_EQUALS_PREDICATE: FilterBinaryPredicate = (a, b) => a == b;
export const LT_PREDICATE: FilterBinaryPredicate = (a, b) => a < b;
export const GT_PREDICATE: FilterBinaryPredicate = (a, b) => a > b;

// decorator
export const NOT_PREDICATE: FilterBinaryPredicateDecorator = (p) => (a, b) => !p(a, b);
