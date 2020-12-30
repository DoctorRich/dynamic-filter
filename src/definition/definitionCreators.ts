import { BinaryFilterClauseDefinition, FilterClauseDefinition, GroupFilterClauseDefinition } from "./filterClauseDefinition"
import { UnaryOperationFilterOperandDefinition, BinaryOperationFilterOperandDefinition, ContextPropertyFilterOperandDefinition, FilterOperandDefinition, PropertyFilterOperandDefinition, ValueFilterOperandDefinition, RuntimeValueFilterOperandDefinition } from "./filterOperandDefinition"

export function property(propertyName: string): PropertyFilterOperandDefinition {
    return {
        type: 'Property',
        propertyName,
    }
}

export function contextProperty(propertyName: string): ContextPropertyFilterOperandDefinition {
    return {
        type: 'ContextProperty',
        propertyName,
    }
}

export function value(value: string | number | {}): ValueFilterOperandDefinition {
    return {
        type: 'Value',
        value,
    }
}

export function runtimeValue(value: string): RuntimeValueFilterOperandDefinition {
    return {
        type: 'RuntimeValue',
        value,
    }
}

export function unaryOp(unaryOperator: string, unaryOperand: FilterOperandDefinition): UnaryOperationFilterOperandDefinition {
    return {
        type: 'UnaryOperation',
        unaryOperand,
        unaryOperator
    }
}

export function binaryOp(binaryOperator: string, ...binaryOperands: FilterOperandDefinition[]): BinaryOperationFilterOperandDefinition {
    return {
        type: 'BinaryOperation',
        binaryOperands,
        binaryOperator
    }
}

export function binaryClause(left: FilterOperandDefinition, comparator: string, right: FilterOperandDefinition): BinaryFilterClauseDefinition {
    return {
        type: 'Binary',
        left,
        right,
        operator: comparator
    };
}

export function groupClause(logicOperator: string, ...clauses: FilterClauseDefinition[]): GroupFilterClauseDefinition {
    return {
        type: 'Group',
        operator: logicOperator,
        clauses,
    };
}
