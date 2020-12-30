import { LogicOperator } from "../filterFactory";
import { GroupPredicateFactory } from "../predicate/groupPredicateFactory";

export class GroupPredicateFactoryBuilder<T = any, C = any> {
    // operations
    private _groupOperators: Map<String, LogicOperator<T>>;

    /**
     * Build the factory
     */
    public build(): GroupPredicateFactory<T, C> {
        return new GroupPredicateFactory(this.groupOperators);
    }

    //#region Group Operators

    /**
     * Getter groupOperators
     * @return {Map<String, LogicOperator<T>>}
     */
    private get groupOperators(): Map<String, LogicOperator<T>> {
        if (this._groupOperators == null) {
            this._groupOperators = new Map();
        }
        return this._groupOperators;
    }

    /**
     * Setter groupOperators
     * @param {Map<String, LogicOperator<T>>} value
     */
    public setGroupOperators(value: Map<String, LogicOperator<T>>): this {
        this._groupOperators = value;
        return this;
    }

    //#endregion

}