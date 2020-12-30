import { BinaryFilterClauseDefinition, FilterClauseDefinition, GroupFilterClauseDefinition } from "../../definition/filterClauseDefinition";
import { FilterPredicate, FilterPredicateFactory } from "../filterFactory";

/**
 * Predicate factory delegating to strategies based on clause definition type.
 */
export class StrategyPredicateFactory<T, C> implements FilterPredicateFactory<FilterClauseDefinition, T, C> {
    private readonly _groupPredicateFactory: FilterPredicateFactory<GroupFilterClauseDefinition, T, C>;
    private readonly _binaryPredicateFactory: FilterPredicateFactory<BinaryFilterClauseDefinition, T, C>;

    constructor(groupPredicateFactory: FilterPredicateFactory<GroupFilterClauseDefinition, T, C>, binaryPredicateFactory: FilterPredicateFactory<BinaryFilterClauseDefinition, T, C>) {
        this._groupPredicateFactory = groupPredicateFactory;
        this._binaryPredicateFactory = binaryPredicateFactory;
    }

    create(clauseDefinition: FilterClauseDefinition, context?: C): FilterPredicate<T> {
        switch (clauseDefinition.type) {
            case 'Group':
                return this._groupPredicateFactory.create(clauseDefinition, context);
            case 'Binary':
                return this._binaryPredicateFactory.create(clauseDefinition, context);
            default:
                throw new Error(`Unknown clause type in ${clauseDefinition}`);
        }
    }

}