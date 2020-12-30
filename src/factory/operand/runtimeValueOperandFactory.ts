import { RuntimeValueFilterOperandDefinition } from "../../definition/filterOperandDefinition";
import { FilterOperand, FilterOperandFactory, FilterRuntimValueGetter } from "../filterFactory";

/**
 * Create filter operands for runtime value operand definitions
 */
export class RuntimeValueOperandFactory implements FilterOperandFactory<RuntimeValueFilterOperandDefinition, any, any> {

    constructor(
        private readonly _runtimeValueGetters: ReadonlyMap<String, FilterRuntimValueGetter>
    ) { }

    create(operandDefinition: RuntimeValueFilterOperandDefinition, context: any): FilterOperand<any> {
        // test definition
        if (operandDefinition.type !== 'RuntimeValue') {
            throw new Error(`Incorrect operand definition type ${operandDefinition.type} for RuntimeValueOperandFactory`);
        }
        // return runtime value
        const getter = this._runtimeValueGetters.get(operandDefinition.value);
        if (getter == null) {
            throw new Error(`Runtime value ${operandDefinition.value} is unknown`);
        }
        const value = getter();
        return t => value;
    }
}
