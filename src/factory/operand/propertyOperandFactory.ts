import { PropertyFilterOperandDefinition } from "../../definition/filterOperandDefinition";
import { FilterOperand, FilterOperandFactory } from "../filterFactory";

/**
 * Create filter operands for property operand definitions
 */
export class PropertyOperandFactory<T, C> implements FilterOperandFactory<PropertyFilterOperandDefinition, T, C> {
    private readonly _propertyGetter: PropertyGetter<T, C>;

    constructor(propertyGetter: PropertyGetter<T, C> = defaultPropertyGetter) {
        this._propertyGetter = propertyGetter;
    }

    create(operandDefinition: PropertyFilterOperandDefinition, context: C): FilterOperand<T> {
        // test definition
        if (operandDefinition.type !== 'Property') {
            throw new Error(`Incorrect operand definition type ${operandDefinition.type} for PropertyOperandFactory`);
        }
        // return operand for the property
        const name = operandDefinition.propertyName;
        return t => this._propertyGetter(t, name, context);
    }
}

type PropertyGetter<T, C> = (t: T, name: string, context: C) => any;
function defaultPropertyGetter<T extends { [key: string]: any }>(t: T, name: string): any {
    return t[name];
}