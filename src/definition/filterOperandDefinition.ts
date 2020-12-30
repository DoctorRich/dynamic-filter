/**
 * Filter Operand Definition.
 * <p>These are operands for evaluating clauses
 * <p>A property operand defines a property on the filter object
 * <p>A context property operand defines a property on the context object supplied when the filter is built
 * <p>A unary function operand performs some function on another operand (e.g. upper casing a string value)
 * <p>A value operand represents a value unrelated to the filter object (e.g. a static value, or a derived value such as current time)
 */
export type FilterOperandDefinition =
    | PropertyFilterOperandDefinition
    | ContextPropertyFilterOperandDefinition
    | UnaryOperationFilterOperandDefinition
    | BinaryOperationFilterOperandDefinition
    | RuntimeValueFilterOperandDefinition
    | ValueFilterOperandDefinition
    ;

export interface PropertyFilterOperandDefinition {
    readonly type: 'Property';
    readonly propertyName: string;
}

export interface ContextPropertyFilterOperandDefinition {
    readonly type: 'ContextProperty';
    readonly propertyName: string;
}

export interface UnaryOperationFilterOperandDefinition {
    readonly type: 'UnaryOperation';
    readonly unaryOperator: string;
    readonly unaryOperand: FilterOperandDefinition;
}

export interface ValueFilterOperandDefinition {
    readonly type: 'Value';
    readonly value: any;
}

export interface RuntimeValueFilterOperandDefinition {
    readonly type: 'RuntimeValue';
    readonly value: string;
}

export interface BinaryOperationFilterOperandDefinition {
    readonly type: 'BinaryOperation';
    readonly binaryOperator: string;
    readonly binaryOperands: readonly FilterOperandDefinition[];
}