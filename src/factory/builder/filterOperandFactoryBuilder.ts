import { BinaryOperationFilterOperandDefinition, ContextPropertyFilterOperandDefinition, FilterOperandDefinition, PropertyFilterOperandDefinition, RuntimeValueFilterOperandDefinition, UnaryOperationFilterOperandDefinition, ValueFilterOperandDefinition } from "../../definition/filterOperandDefinition";
import { FilterBinaryOperation, FilterOperandFactory, FilterRuntimValueGetter, FilterUnaryOperation, NestedFilterOperandFactory } from "../filterFactory";
import { BinaryOperationOperandFactory } from "../operand/binaryOperationOperandFactory";
import { ContextPropertyOperandFactory } from "../operand/contextPropertyOperandFactory";
import { PropertyOperandFactory } from "../operand/propertyOperandFactory";
import { RuntimeValueOperandFactory } from "../operand/runtimeValueOperandFactory";
import { StrategyOperandFactory } from "../operand/strategyOperandFactory";
import { UnaryOperationOperandFactory } from "../operand/unaryOperationOperandFactory";
import { ValueOperandFactory } from "../operand/valueOperandFactory";

export class FilterOperandFactoryBuilder<T = any, C = any> {
    // operations
    private _unaryOperations: ReadonlyMap<string, FilterUnaryOperation>;
    private _binaryOperations: ReadonlyMap<string, FilterBinaryOperation>;
    private _runtimeValueGetters: ReadonlyMap<string, FilterRuntimValueGetter>;

    // operand factories
    private _propertyFactory: FilterOperandFactory<PropertyFilterOperandDefinition, T, C>;
    private _contextPropertyFactory: FilterOperandFactory<ContextPropertyFilterOperandDefinition, T, C>;
    private _unaryOperationFactory: NestedFilterOperandFactory<UnaryOperationFilterOperandDefinition, T, C>;
    private _binaryOperationFactory: NestedFilterOperandFactory<BinaryOperationFilterOperandDefinition, T, C>;
    private _runtimeValueFactory: FilterOperandFactory<RuntimeValueFilterOperandDefinition, T, C>;
    private _valueFactory: FilterOperandFactory<ValueFilterOperandDefinition, T, C>;

    /**
     * Build the factory
     */
    public build(): FilterOperandFactory<FilterOperandDefinition, T, C> {
        const unaryOperationFactory = this.unaryOperationFactory;
        const binaryOperationFactory = this.binaryOperationFactory;
        const strategyOperandFactory = new StrategyOperandFactory(
            this.propertyFactory,
            this.contextPropertyFactory,
            unaryOperationFactory,
            binaryOperationFactory,
            this.runtimeValueFactory,
            this.valueFactory
        );
        unaryOperationFactory.operandFactory = strategyOperandFactory;
        binaryOperationFactory.operandFactory = strategyOperandFactory;
        return strategyOperandFactory;
    }

    //#region Operand Factories

    /**
     * Getter propertyFactory
     * @return {FilterOperandFactory<PropertyFilterOperandDefinition, T, C>}
     */
    private get propertyFactory(): FilterOperandFactory<PropertyFilterOperandDefinition, T, C> {
        if (this._propertyFactory == null) {
            this._propertyFactory = new PropertyOperandFactory()
        }
        return this._propertyFactory;
    }

    /**
     * Setter propertyFactory
     * @param {FilterOperandFactory<PropertyFilterOperandDefinition, T, C>} value
     */
    public setPropertyFactory(value: FilterOperandFactory<PropertyFilterOperandDefinition, T, C>): this {
        this._propertyFactory = value;
        return this;
    }

    /**
     * Getter contextPropertyFactory
     * @return {FilterOperandFactory<ContextPropertyFilterOperandDefinition, T, C>}
     */
    private get contextPropertyFactory(): FilterOperandFactory<ContextPropertyFilterOperandDefinition, T, C> {
        if (this._contextPropertyFactory == null) {
            this._contextPropertyFactory = new ContextPropertyOperandFactory();
        }
        return this._contextPropertyFactory;
    }

    /**
     * Setter contextPropertyFactory
     * @param {FilterOperandFactory<ContextPropertyFilterOperandDefinition, T, C>} value
     */
    public setContextPropertyFactory(value: FilterOperandFactory<ContextPropertyFilterOperandDefinition, T, C>): this {
        this._contextPropertyFactory = value;
        return this;
    }

    /**
     * Getter unaryOperationFactory
     * @return {NestedFilterOperandFactory<UnaryOperationFilterOperandDefinition, T, C>}
     */
    private get unaryOperationFactory(): NestedFilterOperandFactory<UnaryOperationFilterOperandDefinition, T, C> {
        if (this._unaryOperationFactory == null) {
            this._unaryOperationFactory = new UnaryOperationOperandFactory(this.unaryOperations);
        }
        return this._unaryOperationFactory;
    }

    /**
     * Setter unaryOperationFactory
     * @param {NestedFilterOperandFactory<UnaryOperationFilterOperandDefinition, T, C>} value
     */
    public setUnaryOperationFactory(value: NestedFilterOperandFactory<UnaryOperationFilterOperandDefinition, T, C>): this {
        this._unaryOperationFactory = value;
        return this;
    }


    /**
     * Getter binaryOperationFactory
     * @return {NestedFilterOperandFactory<BinaryOperationFilterOperandDefinition, T, C>}
     */
    private get binaryOperationFactory(): NestedFilterOperandFactory<BinaryOperationFilterOperandDefinition, T, C> {
        if (this._binaryOperationFactory == null) {
            this._binaryOperationFactory = new BinaryOperationOperandFactory(this.binaryOperations);
        }
        return this._binaryOperationFactory;
    }

    /**
     * Setter binaryOperationFactory
     * @param {NestedFilterOperandFactory<BinaryOperationFilterOperandDefinition, T, C>} value
     */
    public setBinaryOperationFactory(value: NestedFilterOperandFactory<BinaryOperationFilterOperandDefinition, T, C>): this {
        this._binaryOperationFactory = value;
        return this;
    }

    /**
     * Getter valueFactory
     * @return {FilterOperandFactory<ValueFilterOperandDefinition, T, C>}
     */
    private get valueFactory(): FilterOperandFactory<ValueFilterOperandDefinition, T, C> {
        if (this._valueFactory == null) {
            this._valueFactory = new ValueOperandFactory();
        }
        return this._valueFactory;
    }

    /**
     * Setter valueFactory
     * @param {FilterOperandFactory<ValueFilterOperandDefinition, T, C>} value
     */
    public setValueFactory(value: FilterOperandFactory<ValueFilterOperandDefinition, T, C>): this {
        this._valueFactory = value;
        return this;
    }

    /**
     * Getter unaryOperations
     * @return {ReadonlyMap<string, FilterUnaryOperation>}
     */
    private get unaryOperations(): ReadonlyMap<string, FilterUnaryOperation> {
        if (this._unaryOperations == null) {
            this._unaryOperations = new Map();
        }
        return this._unaryOperations;
    }

    /**
     * Setter unaryOperations
     * @param {ReadonlyMap<string, FilterUnaryOperation>} value
     */
    public setUnaryOperations(value: ReadonlyMap<string, FilterUnaryOperation>): this {
        this._unaryOperations = value;
        return this;
    }


    /**
     * Getter binaryOperations
     * @return {ReadonlyMap<String, FilterBinaryOperation>}
     */
    private get binaryOperations(): ReadonlyMap<String, FilterBinaryOperation> {
        if (this._binaryOperations == null) {
            this._binaryOperations = new Map();
        }
        return this._binaryOperations;
    }

    /**
     * Setter binaryOperations
     * @param {ReadonlyMap<string, FilterBinaryOperation>} value
     */
    public setBinaryOperations(value: ReadonlyMap<string, FilterBinaryOperation>): this {
        this._binaryOperations = value;
        return this;
    }


    /**
     * Getter runtimeValueFactory
     * @return {FilterOperandFactory<RuntimeValueFilterOperandDefinition, T, C>}
     */
    public get runtimeValueFactory(): FilterOperandFactory<RuntimeValueFilterOperandDefinition, T, C> {
        if (this._runtimeValueFactory == null) {
            this._runtimeValueFactory = new RuntimeValueOperandFactory(this.runtimeValueGetters);
        }
        return this._runtimeValueFactory;
    }

    /**
     * Setter runtimeValueFactory
     * @param {FilterOperandFactory<RuntimeValueFilterOperandDefinition, T, C>} value
     */
    public setRuntimeValueFactory(value: FilterOperandFactory<RuntimeValueFilterOperandDefinition, T, C>): this {
        this._runtimeValueFactory = value;
        return this;
    }


    /**
     * Getter runtimeValueGetters
     * @return {ReadonlyMap<string, FilterRuntimValueGetter>}
     */
    public get runtimeValueGetters(): ReadonlyMap<string, FilterRuntimValueGetter> {
        if (this._runtimeValueGetters == null) {
            this._runtimeValueGetters = new Map();
        }
        return this._runtimeValueGetters;
    }

    /**
     * Setter runtimeValueGetters
     * @param {ReadonlyMap<string, FilterRuntimValueGetter>} value
     */
    public setRuntimeValueGetters(value: ReadonlyMap<string, FilterRuntimValueGetter>): this {
        this._runtimeValueGetters = value;
        return this;
    }

    //#endregion

}