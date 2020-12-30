import { FilterClauseDefinition, GroupFilterClauseDefinition } from "../../definition/filterClauseDefinition";
import { FilterPredicate, FilterPredicateFactory, NestedFilterPredicateFactory, LogicOperator } from "../filterFactory";

/**
 * Predicate factory creating logical groupings of predicates.
 * This requires a circular reference so provide a setter and check it has been called.
 */
export class GroupPredicateFactory<T, C> implements NestedFilterPredicateFactory<GroupFilterClauseDefinition, T, C> {
    private _predicateFactory: FilterPredicateFactory<FilterClauseDefinition, T, C>;
    private readonly _groupOperators: Map<String, LogicOperator<T>>;

    constructor(groupOperators: Map<String, LogicOperator<T>>) {
        this._groupOperators = groupOperators;
    }

    /**
     * Setter predicateFactory
     * @param {FilterPredicateFactory<FilterClauseDefinition, T, C>} value
     */
    public set predicateFactory(value: FilterPredicateFactory<FilterClauseDefinition, T, C>) {
        this._predicateFactory = value;
    }


    create(clauseDefinition: GroupFilterClauseDefinition, context?: C): FilterPredicate<T> {
        // test the factory has been set
        if (this._predicateFactory == null) {
            throw new Error('Predicate Factory has not been set in GroupPredicateFactory');
        }
        // test definition
        if (clauseDefinition.type !== 'Group') {
            throw new Error(`Incorrect clause definition type ${clauseDefinition.type} for GroupPredicateFactory`);
        }
        // create the predicates
        const predicates = clauseDefinition.clauses.map(c => this._predicateFactory.create(c, context));
        // get the logical operator
        const logicOperator = this._groupOperators.get(clauseDefinition.operator);
        if (logicOperator == null) {
            throw new Error(`Logical operator ${clauseDefinition.operator} is unknown`);
        }
        // return filter predicate
        return t => logicOperator(t, predicates);
    }


}