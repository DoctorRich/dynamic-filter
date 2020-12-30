import { BinaryOperationFilterOperandDefinition, ContextPropertyFilterOperandDefinition, FilterOperandDefinition, PropertyFilterOperandDefinition, RuntimeValueFilterOperandDefinition, UnaryOperationFilterOperandDefinition, ValueFilterOperandDefinition } from "../../definition/filterOperandDefinition";
import { FilterOperand, FilterOperandFactory } from "../filterFactory";

/**
 * Operand factory delegating to strategies based on operand definition type.
 */
export class StrategyOperandFactory<T, C> implements FilterOperandFactory<FilterOperandDefinition, T, C>{
    constructor(
        private readonly _propertyFactory: FilterOperandFactory<PropertyFilterOperandDefinition, T, C>,
        private readonly _contextPropertyFactory: FilterOperandFactory<ContextPropertyFilterOperandDefinition, T, C>,
        private readonly _unaryOperationFactory: FilterOperandFactory<UnaryOperationFilterOperandDefinition, T, C>,
        private readonly _binaryOperationFactory: FilterOperandFactory<BinaryOperationFilterOperandDefinition, T, C>,
        private readonly _runtimeValueFactory: FilterOperandFactory<RuntimeValueFilterOperandDefinition, T, C>,
        private readonly _valueFactory: FilterOperandFactory<ValueFilterOperandDefinition, T, C>
    ) { }

    create(operandDefinition: FilterOperandDefinition, context: C): FilterOperand<T> {
        switch (operandDefinition.type) {
            case 'Property':
                return this._propertyFactory.create(operandDefinition, context);
            case 'ContextProperty':
                return this._contextPropertyFactory.create(operandDefinition, context);
            case 'UnaryOperation':
                return this._unaryOperationFactory.create(operandDefinition, context);
            case 'BinaryOperation':
                return this._binaryOperationFactory.create(operandDefinition, context);
            case 'RuntimeValue':
                return this._runtimeValueFactory.create(operandDefinition, context);
            case 'Value':
                return this._valueFactory.create(operandDefinition, context);
            default:
                throw new Error(`Unknown operand type ${(operandDefinition as FilterOperandDefinition).type}`)
        }
    }

}