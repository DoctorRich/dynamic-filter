import { FilterClauseDefinition } from "../definition/filterClauseDefinition";
import { FilterOperandDefinition } from "../definition/filterOperandDefinition";

export type FilterPredicate<T> = (t: T) => boolean;
export type FilterOperand<T> = (t: T) => any;

/**
 * Creates a filter predicate that can be used to filter objects of type T
 */
export interface FilterPredicateFactory<D, T, C> {
    create(clauseDefinition: D, context?: C): FilterPredicate<T>;
}

export interface NestedFilterPredicateFactory<D, T, C> extends FilterPredicateFactory<D, T, C> {
    predicateFactory: FilterPredicateFactory<FilterClauseDefinition, T, C>;
}

/**
 * Creates a filter operand that can be used to create runtime values to compare from objects of type T
 */
export interface FilterOperandFactory<D, T, C> {
    create(operandDefinition: D, context: C): FilterOperand<T>;
}
export interface NestedFilterOperandFactory<D, T, C> extends FilterOperandFactory<D, T, C> {
    operandFactory: FilterOperandFactory<FilterOperandDefinition, T, C>;
}

export type FilterRuntimValueGetter = () => any;
export type FilterUnaryOperation = (operand: any) => any;
export type FilterBinaryOperation = (lhs: any, rhs: any) => any;
export type FilterBinaryPredicate = (lhs: any, rhs: any) => boolean;
export type FilterBinaryPredicateDecorator = (p: FilterBinaryPredicate) => FilterBinaryPredicate;

/**
 * Perform logic operations on filter predicate outcomes given a filter object t
 */
export type LogicOperator<T> = (t: T, filters: readonly FilterPredicate<T>[]) => boolean;