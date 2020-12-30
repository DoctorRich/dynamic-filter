import { BinaryFilterClauseDefinition } from "../../definition/filterClauseDefinition";
import { FilterOperandDefinition } from "../../definition/filterOperandDefinition";
import { FilterBinaryPredicate, FilterOperandFactory, FilterPredicate, FilterPredicateFactory } from "../filterFactory";

/**
 * Factory for building filter predicates from binary operands
 */
export class BinaryPredicateFactory<T, C> implements FilterPredicateFactory<BinaryFilterClauseDefinition, T, C> {
    private readonly _leftOperandFactory: FilterOperandFactory<FilterOperandDefinition, T, C>;
    private readonly _rightOperandFactory: FilterOperandFactory<FilterOperandDefinition, T, C>;
    private readonly _binaryPredicates: ReadonlyMap<String, FilterBinaryPredicate>;


    constructor(leftOperandFactory: FilterOperandFactory<FilterOperandDefinition, T, C>, rightOperandFactory: FilterOperandFactory<FilterOperandDefinition, T, C>, binaryPredicates: ReadonlyMap<String, FilterBinaryPredicate>) {
        this._leftOperandFactory = leftOperandFactory;
        this._rightOperandFactory = rightOperandFactory;
        this._binaryPredicates = binaryPredicates;
    }

    create(clauseDefinition: BinaryFilterClauseDefinition, context?: C): FilterPredicate<T> {
        // test definition
        if (clauseDefinition.type !== 'Binary') {
            throw new Error(`Incorrect clause definition type ${clauseDefinition.type} for BinaryPredicateFactory`);
        }
        // create the binary arguments
        const lhs = this._leftOperandFactory.create(clauseDefinition.left, context);
        const rhs = this._rightOperandFactory.create(clauseDefinition.right, context);
        // get the predicate
        const binaryPredicate = this._binaryPredicates.get(clauseDefinition.operator);
        if (binaryPredicate == null) {
            throw new Error(`Binary predicate ${clauseDefinition.operator} is unknown`);
        }
        // return filter predicate
        return t => binaryPredicate(lhs(t), rhs(t));
    }

}