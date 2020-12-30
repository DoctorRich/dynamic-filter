import { FilterClauseDefinition } from "../../definition/filterClauseDefinition";
import { FilterOperandDefinition } from "../../definition/filterOperandDefinition";
import { FilterBinaryPredicate, FilterOperandFactory, FilterPredicateFactory } from "../filterFactory";
import { BinaryPredicateFactory } from "../predicate/binaryPredicateFactory";
import { FilterOperandFactoryBuilder } from "./filterOperandFactoryBuilder";


export class BinaryPredicateFactoryBuilder<T = any, C = any> {
    // operations
    private _binaryPredicates: ReadonlyMap<string, FilterBinaryPredicate>;
    // operand factories
    private _leftOperandFactory: FilterOperandFactory<FilterOperandDefinition, T, C>;
    private _rightOperandFactory: FilterOperandFactory<FilterOperandDefinition, T, C>;

    /**
     * Build the factory
     */
    public build(): FilterPredicateFactory<FilterClauseDefinition, T, C> {
        return new BinaryPredicateFactory(
            this.leftOperandFactory,
            this.rightOperandFactory,
            this.binaryPredicates
        )
    }

    //#region Binary predicates

    /**
     * Getter binaryPredicates
     * @return {ReadonlyMap<string, FilterBinaryPredicate>}
     */
    private get binaryPredicates(): ReadonlyMap<string, FilterBinaryPredicate> {
        if (this._binaryPredicates == null) {
            this._binaryPredicates = new Map();
        }
        return this._binaryPredicates;
    }

    /**
     * Setter binaryPredicates
     * @param {ReadonlyMap<string, FilterBinaryPredicate>} value
     */
    public setBinaryPredicates(value: ReadonlyMap<string, FilterBinaryPredicate>): this {
        this._binaryPredicates = value;
        return this;
    }

    //#endregion

    //#region Operand factory builders

    /**
     * Getter leftOperandFactory
     * @return {FilterOperandFactory<FilterOperandDefinition, T, C>}
     */
    private get leftOperandFactory(): FilterOperandFactory<FilterOperandDefinition, T, C> {
        if (this._leftOperandFactory == null) {
            this._leftOperandFactory = new FilterOperandFactoryBuilder().build();
        }
        return this._leftOperandFactory;
    }

    /**
     * Setter leftOperandFactory
     * @param {FilterOperandFactory<FilterOperandDefinition, T, C>} value
     */
    public setLeftOperandFactory(value: FilterOperandFactory<FilterOperandDefinition, T, C>): this {
        this._leftOperandFactory = value;
        return this;
    }


    /**
     * Getter rightOperandFactory
     * @return {FilterOperandFactory<FilterOperandDefinition, T, C>}
     */
    private get rightOperandFactory(): FilterOperandFactory<FilterOperandDefinition, T, C> {
        if (this._rightOperandFactory == null) {
            this._rightOperandFactory = new FilterOperandFactoryBuilder().build();
        }
        return this._rightOperandFactory;
    }

    /**
     * Setter rightOperandFactory
     * @param {FilterOperandFactory<FilterOperandDefinition, T, C>} value
     */
    public setRightOperandFactory(value: FilterOperandFactory<FilterOperandDefinition, T, C>): this {
        this._rightOperandFactory = value;
        return this;
    }

    //#endregion


}