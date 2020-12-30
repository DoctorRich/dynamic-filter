import { BinaryFilterClauseDefinition, FilterClauseDefinition, GroupFilterClauseDefinition } from "../../definition/filterClauseDefinition";
import { FilterPredicateFactory, NestedFilterPredicateFactory } from "../filterFactory";
import { StrategyPredicateFactory } from "../predicate/strategyPredicateFactory";
import { BinaryPredicateFactoryBuilder } from "./binaryPredicateFactoryBuilder";
import { GroupPredicateFactoryBuilder } from "./groupPredicateFactoryBuilder";

export class FilterPredicateFactoryBuilder<T = any, C = any> {
    // predicate factories
    private _groupPredicateFactory: NestedFilterPredicateFactory<GroupFilterClauseDefinition, T, C>;
    private _binaryPredicateFactory: FilterPredicateFactory<BinaryFilterClauseDefinition, T, C>;

    /**
     * Build the factory
     */
    public build(): FilterPredicateFactory<FilterClauseDefinition, T, C> {
        const groupPredicateFactory = this.groupPredicateFactory;
        const strategyPredicateFactory = new StrategyPredicateFactory(
            groupPredicateFactory,
            this.binaryPredicateFactory
        );
        groupPredicateFactory.predicateFactory = strategyPredicateFactory;
        return strategyPredicateFactory;
    }

    //#region Predicate Factories 

    /**
     * Getter groupPredicateFactory
     * @return {NestedFilterPredicateFactory<GroupFilterClauseDefinition, T, C>}
     */
    private get groupPredicateFactory(): NestedFilterPredicateFactory<GroupFilterClauseDefinition, T, C> {
        if (this._groupPredicateFactory == null) {
            this._groupPredicateFactory = new GroupPredicateFactoryBuilder().build();
        }
        return this._groupPredicateFactory;
    }

    /**
     * Setter groupPredicateFactory
     * @param {NestedFilterPredicateFactory<GroupFilterClauseDefinition, T, C>} value
     */
    public setGroupPredicateFactory(value: NestedFilterPredicateFactory<GroupFilterClauseDefinition, T, C>): this {
        this._groupPredicateFactory = value;
        return this;
    }


    /**
     * Getter binaryPredicateFactory
     * @return {FilterPredicateFactory<BinaryFilterClauseDefinition, T, C>}
     */
    private get binaryPredicateFactory(): FilterPredicateFactory<BinaryFilterClauseDefinition, T, C> {
        if (this._binaryPredicateFactory == null) {
            this._binaryPredicateFactory = new BinaryPredicateFactoryBuilder().build();
        }
        return this._binaryPredicateFactory;
    }

    /**
     * Setter binaryPredicateFactory
     * @param {FilterPredicateFactory<BinaryFilterClauseDefinition, T, C>} value
     */
    public setBinaryPredicateFactory(value: FilterPredicateFactory<BinaryFilterClauseDefinition, T, C>): this {
        this._binaryPredicateFactory = value;
        return this;
    }

    //#endregion

}