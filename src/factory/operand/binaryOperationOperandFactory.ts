import { BinaryOperationFilterOperandDefinition, FilterOperandDefinition, UnaryOperationFilterOperandDefinition } from "../../definition/filterOperandDefinition";
import { FilterOperand, FilterOperandFactory, NestedFilterOperandFactory, FilterUnaryOperation, FilterBinaryOperation } from "../filterFactory";

/**
 * Create filter operands for unary operation operand definitions.
 * This will have a circular dependency for nested operations, so add setter and check it's been called.
 */
export class BinaryOperationOperandFactory<T, C> implements NestedFilterOperandFactory<BinaryOperationFilterOperandDefinition, T, C> {
    private readonly _binaryOperations: ReadonlyMap<String, FilterBinaryOperation>;
    private _operandFactory: FilterOperandFactory<FilterOperandDefinition, T, C>;

    constructor(binaryOperations: ReadonlyMap<String, FilterBinaryOperation>) {
        this._binaryOperations = binaryOperations;
    }

    /**
     * Setter operandFactory
     * @param {FilterOperandFactory<FilterOperandDefinition, T, C>} value
     */
    public set operandFactory(value: FilterOperandFactory<FilterOperandDefinition, T, C>) {
        this._operandFactory = value;
    }

    create(operandDefinition: BinaryOperationFilterOperandDefinition, context: C): FilterOperand<T> {
        // test factory
        if (this._operandFactory == null) {
            throw new Error('Operand Factory has not been set in BinaryOperationOperandFactory');
        }
        // test definition
        if (operandDefinition.type !== 'BinaryOperation') {
            throw new Error(`Incorrect operand definition type ${operandDefinition.type} for BinaryOperationOperandFactory`);
        }
        // test operands
        if (operandDefinition.binaryOperands?.length < 2) {
            throw new Error(`At least two operands required for BinaryOperationOperandFactory`);
        }
        // return operand for the property
        const operator = this._binaryOperations.get(operandDefinition.binaryOperator);
        if (operator == null) {
            throw new Error(`Binary operator ${operandDefinition.binaryOperator} is unknown`);
        }
        const operands = operandDefinition.binaryOperands.map(o => this._operandFactory.create(o, context));
        // return operation
        return operands.length === 2 ?
            t => operator(operands[0](t), operands[1](t)) :
            t => operands.reduce((lhs, rhs) => operator(lhs, rhs(t)), operands.shift()(t));
    }
}