import { ValueFilterOperandDefinition } from "../../definition/filterOperandDefinition";
import { FilterOperand, FilterOperandFactory } from "../filterFactory";

/**
 * Create filter operands for value operand definitions
 */
export class ValueOperandFactory implements FilterOperandFactory<ValueFilterOperandDefinition, any, any> {

    create(operandDefinition: ValueFilterOperandDefinition, context: any): FilterOperand<any> {
        // test definition
        if (operandDefinition.type !== 'Value') {
            throw new Error(`Incorrect operand definition type ${operandDefinition.type} for ValueOperandFactory`);
        }
        // return operand for the property
        const value = operandDefinition.value;
        return t => value;
    }
}
