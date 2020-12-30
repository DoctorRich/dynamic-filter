import { ContextPropertyFilterOperandDefinition, PropertyFilterOperandDefinition } from "../../definition/filterOperandDefinition";
import { FilterOperand, FilterOperandFactory } from "../filterFactory";

/**
 * Create filter operands for context property operand definitions
 */
export class ContextPropertyOperandFactory<T, C> implements FilterOperandFactory<ContextPropertyFilterOperandDefinition, T, C> {
    private readonly _propertyGetter: ContextPropertyGetter<T, C>;

    constructor(propertyGetter: ContextPropertyGetter<T, C> = defaultContextPropertyGetter) {
        this._propertyGetter = propertyGetter;
    }

    create(operandDefinition: ContextPropertyFilterOperandDefinition, context: C): FilterOperand<T> {
        // test definition
        if (operandDefinition.type !== 'ContextProperty') {
            throw new Error(`Incorrect operand definition type ${operandDefinition.type} for ContextPropertyOperandFactory`);
        }
        // return operand for the property
        const name = operandDefinition.propertyName;
        return t => this._propertyGetter(context, name, t);
    }
}

type ContextPropertyGetter<T, C> = (context: C, name: string, t: T) => any;
function defaultContextPropertyGetter<C extends { [key: string]: any }>(context: C, name: string): any {
    return context[name];
}