import { FilterBinaryOperation, FilterBinaryPredicate, FilterRuntimValueGetter, FilterUnaryOperation, LogicOperator } from "../factory/filterFactory";
import { FilterPredicateFactoryBuilder } from "../factory/builder/filterPredicateFactoryBuilder";
import { BinaryPredicateFactoryBuilder } from "../factory/builder/binaryPredicateFactoryBuilder";
import { GroupPredicateFactoryBuilder } from "../factory/builder/groupPredicateFactoryBuilder";
import { FilterOperandFactoryBuilder } from "../factory/builder/filterOperandFactoryBuilder";
import * as Logic from "./logicOperations";
import * as Unary from "./unaryOperations";
import * as Binary from "./binaryOperations";
import * as Predicate from "./predicateOperations";
import * as Runtime from "./runtimeValues";

export const createDefaultFilterFactory = <T, C>() => {
    const operandFactory = new FilterOperandFactoryBuilder<T, C>()
        .setUnaryOperations(defaultUnaryOperations)
        .setBinaryOperations(defaultBinaryOperations)
        .setRuntimeValueGetters(defaultRuntimeValueGetters)
        .build();
    const groupPredicateFactory = new GroupPredicateFactoryBuilder()
        .setGroupOperators(defaultLogicOperators)
        .build();
    const binaryPredicateFactory = new BinaryPredicateFactoryBuilder()
        .setLeftOperandFactory(operandFactory)
        .setRightOperandFactory(operandFactory)
        .setBinaryPredicates(defaultBinaryPredicates)
        .build();
    return new FilterPredicateFactoryBuilder<T, C>()
        .setGroupPredicateFactory(groupPredicateFactory)
        .setBinaryPredicateFactory(binaryPredicateFactory)
        .build();
}

//#region  logic
export const defaultLogicOperators: Map<String, LogicOperator<any>> = new Map([
    [Logic.AND_TOKEN, Logic.AND_OPERATOR],
    [Logic.OR_TOKEN, Logic.OR_OPERATOR],
    [Logic.XOR_TOKEN, Logic.XOR_OPERATOR]
]);
//#endregion

//#region predicates
export const defaultBinaryPredicates: Map<string, FilterBinaryPredicate> = new Map([
    [Predicate.EQ_TOKEN, Predicate.DEEP_EQUALS_PREDICATE],
    [Predicate.NEQ_TOKEN, Predicate.STRICT_NOT_EQUALS_PREDICATE],
    [Predicate.GT_TOKEN, Predicate.GT_PREDICATE],
    [Predicate.LT_TOKEN, Predicate.LT_PREDICATE],
]);
//#endregion

//#region unary
export const defaultUnaryOperations: ReadonlyMap<string, FilterUnaryOperation> = new Map([
    [Unary.UPPER_TOKEN, Unary.UPPER_CASE_OPERATION],
    [Unary.LOWER_TOKEN, Unary.LOWER_CASE_OPERATION],
    [Unary.TRIM_TOKEN, Unary.TRIM_OPERATION],
    [Unary.DATE_TIME_TOKEN, Unary.AS_DATE_TIME_OPERATION],
    [Unary.DURATION_TOKEN, Unary.AS_DURATION_OPERATION],
]);
//#endregion

//#region binary
export const defaultBinaryOperations: ReadonlyMap<string, FilterBinaryOperation> = new Map([
    [Binary.MULTIPLY_TOKEN, Binary.MULTIPLY_OPERATION],
    [Binary.DIVIDE_TOKEN, Binary.DIVIDE_OPERATION],
    [Binary.ADD_TOKEN, Binary.ADD_OPERATION],
    [Binary.MINUS_TOKEN, Binary.MINUS_OPERATION]
]);
//#endregion

//#region  runtime values
export const defaultRuntimeValueGetters: ReadonlyMap<string, FilterRuntimValueGetter> = new Map([
    [Runtime.NOW_TOKEN, Runtime.NOW_RUNTIME_GETTER],
    [Runtime.TODAY_TOKEN, Runtime.TODAY_RUNTIME_GETTER],
]);
//#endregion