import { FilterOperandDefinition, UnaryOperationFilterOperandDefinition } from "../../definition/filterOperandDefinition";
import { FilterOperand, FilterOperandFactory, NestedFilterOperandFactory, FilterUnaryOperation } from "../filterFactory";

/**
 * Create filter operands for unary operation operand definitions.
 * This will have a circular dependency for nested operations, so add setter and check it's been called.
 */
export class UnaryOperationOperandFactory<T, C> implements NestedFilterOperandFactory<UnaryOperationFilterOperandDefinition, T, C> {
    private readonly _unaryOperations: ReadonlyMap<String, FilterUnaryOperation>;
    private _operandFactory: FilterOperandFactory<FilterOperandDefinition, T, C>;

    constructor(unaryOperations: ReadonlyMap<String, FilterUnaryOperation>) {
        this._unaryOperations = unaryOperations;
    }

    /**
     * Setter operandFactory
     * @param {FilterOperandFactory<FilterOperandDefinition, T, C>} value
     */
    public set operandFactory(value: FilterOperandFactory<FilterOperandDefinition, T, C>) {
        this._operandFactory = value;
    }

    create(operandDefinition: UnaryOperationFilterOperandDefinition, context: C): FilterOperand<T> {
        // test factory
        if (this._operandFactory == null) {
            throw new Error('Operand Factory has not been set in UnaryOperationOperandFactory');
        }
        // test definition
        if (operandDefinition.type !== 'UnaryOperation') {
            throw new Error(`Incorrect operand definition type ${operandDefinition.type} for UnaryOperationOperandFactory`);
        }
        // return operand for the property
        const operand = this._operandFactory.create(operandDefinition.unaryOperand, context);
        const operator = this._unaryOperations.get(operandDefinition.unaryOperator);
        if (operator == null) {
            throw new Error(`Unary operator ${operandDefinition.unaryOperator} is unknown`);
        }
        // return filter operand
        return t => operator(operand(t));
    }
}