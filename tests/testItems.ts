import { FilterClauseDefinition } from '../src/definition/filterClauseDefinition';
import { TermNodeGroup, ReducedTermTreeNode, InterpreterGroup } from '../src/parse/parseTypes';

interface TestItem {
    stringFilter: string;
    tokens: readonly string[];
    groupTerm: InterpreterGroup;
    termTree: ReducedTermTreeNode;
    filterDefinition?: FilterClauseDefinition;
}

export const singleTerm: TestItem = {
    stringFilter: 'propA = propB',
    tokens: ['propA', '=', 'propB'],
    groupTerm: {
        type: 'group',
        tokenIndex: null,
        terms: [
            {
                type: 'value',
                value: 'propA',
                tokenIndex: 0,
                rhsOperator: '=',
                rhsOperatorIndex: 1
            },
            {
                type: 'value',
                value: 'propB',
                tokenIndex: 2
            }
        ]
    },
    termTree: {
        type: 'predicate',
        operator: '=',
        operands: [
            { type: 'value', value: 'propA' },
            { type: 'value', value: 'propB' }
        ]
    },
    filterDefinition: {
        type: 'Binary',
        left: { type: 'Value', value: 'propA' },
        right: { type: 'Value', value: 'propB' },
        operator: '='
    }
};

export const singleTermArithmetic: TestItem = {
    stringFilter: 'propA = propB+4',
    tokens: ['propA', '=', 'propB', '+', '4'],
    groupTerm: {
        type: 'group',
        tokenIndex: null,
        terms: [
            {
                type: 'value',
                value: 'propA',
                tokenIndex: 0,
                rhsOperator: '=',
                rhsOperatorIndex: 1
            },
            {
                type: 'value',
                value: 'propB',
                tokenIndex: 2,
                rhsOperator: '+',
                rhsOperatorIndex: 3
            },
            {
                type: 'value',
                value: '4',
                tokenIndex: 4
            }
        ]
    },
    termTree: {
        type: 'predicate',
        operator: '=',
        operands: [
            { type: 'value', value: 'propA' },
            {
                type: 'binary',
                operator: '+',
                operands: [
                    { type: 'value', value: 'propB' },
                    { type: 'value', value: '4' }
                ]
            }
        ]
    },
    filterDefinition: {
        type: 'Binary',
        left: { type: 'Value', value: 'propA' },
        right: {
            type: 'BinaryOperation',
            binaryOperands: [{ type: 'Value', value: 'propB' }, { type: 'Value', value: '4' }],
            binaryOperator: '+'
        },
        operator: '='
    }
};

export const singleTermUnaryFunctions: TestItem = {
    stringFilter: 'upper(propA) = trim(propB)',
    tokens: ['upper', '(', 'propA', ')', '=', 'trim', '(', 'propB', ')'],
    groupTerm: {
        type: 'group',
        tokenIndex: null,
        terms: [
            {
                type: 'unary',
                operator: 'upper',
                tokenIndex: 0,
                operands: [{
                    type: 'group',
                    tokenIndex: 1,
                    terms: [
                        {
                            type: 'value',
                            value: 'propA',
                            tokenIndex: 2
                        }
                    ]
                }],
                rhsOperator: '=',
                rhsOperatorIndex: 4
            },
            {
                type: 'unary',
                operator: 'trim',
                tokenIndex: 5,
                operands: [{
                    type: 'group',
                    tokenIndex: 6,
                    terms: [
                        {
                            type: 'value',
                            value: 'propB',
                            tokenIndex: 7
                        }
                    ]
                }],
            },
        ]
    },
    termTree: {
        type: 'predicate',
        operator: '=',
        operands: [
            {
                type: 'unary',
                operator: 'upper',
                operands: [{ type: 'value', value: 'propA' }]
            },
            {
                type: 'unary',
                operator: 'trim',
                operands: [{ type: 'value', value: 'propB' }]
            }
        ]
    },
    filterDefinition: {
        type: 'Binary',
        left: { type: 'UnaryOperation', unaryOperand: { type: 'Value', value: 'propA' }, unaryOperator: 'upper' },
        right: { type: 'UnaryOperation', unaryOperand: { type: 'Value', value: 'propB' }, unaryOperator: 'trim' },
        operator: '='
    }


}

export const singleTermNestedUnary: TestItem = {
    stringFilter: 'upper(trim(propA)) = upper(trim(propB))',
    tokens: ['upper', '(', 'trim', '(', 'propA', ')', ')', '=', 'upper', '(', 'trim', '(', 'propB', ')', ')'],
    groupTerm: {
        type: 'group',
        tokenIndex: null,
        terms: [
            {
                type: 'unary',
                operator: 'upper',
                tokenIndex: 0,
                operands: [{
                    type: 'group',
                    tokenIndex: 1,
                    terms: [
                        {
                            type: 'unary',
                            operator: 'trim',
                            tokenIndex: 2,
                            operands: [{
                                type: 'group',
                                tokenIndex: 3,
                                terms: [

                                    {
                                        type: 'value',
                                        value: 'propA',
                                        tokenIndex: 4
                                    }
                                ]
                            }],
                        },
                    ]
                }],
                rhsOperator: '=',
                rhsOperatorIndex: 7
            },
            {
                type: 'unary',
                operator: 'upper',
                tokenIndex: 8,
                operands: [{
                    type: 'group',
                    tokenIndex: 9,
                    terms: [
                        {
                            type: 'unary',
                            operator: 'trim',
                            tokenIndex: 10,
                            operands: [{
                                type: 'group',
                                tokenIndex: 11,
                                terms: [
                                    {
                                        type: 'value',
                                        value: 'propB',
                                        tokenIndex: 12
                                    }
                                ]
                            }],
                        },
                    ]
                }]
            }
        ]
    },
    termTree: {
        type: 'predicate',
        operator: '=',
        operands: [
            {
                type: 'unary',
                operator: 'upper',
                operands: [
                    {
                        type: 'unary',
                        operator: 'trim',
                        operands: [{ type: 'value', value: 'propA' }]
                    }]
            },
            {
                type: 'unary',
                operator: 'upper',
                operands: [
                    {
                        type: 'unary',
                        operator: 'trim',
                        operands: [{ type: 'value', value: 'propB' }]
                    }]
            }
        ]
    },
    filterDefinition: {
        type: 'Binary',
        left: { type: 'UnaryOperation', unaryOperand: { type: 'UnaryOperation', unaryOperand: { type: 'Value', value: 'propA' }, unaryOperator: 'trim' }, unaryOperator: 'upper' },
        right: { type: 'UnaryOperation', unaryOperand: { type: 'UnaryOperation', unaryOperand: { type: 'Value', value: 'propB' }, unaryOperator: 'trim' }, unaryOperator: 'upper' },
        operator: '='
    }

}

export const simpleMultiClause: TestItem = {
    stringFilter: 'propA = propB & propC = propD',
    tokens: ['propA', '=', 'propB', '&', 'propC', '=', 'propD'],
    groupTerm: {
        type: 'group',
        tokenIndex: null,
        terms: [
            { type: 'value', tokenIndex: 0, value: 'propA', rhsOperator: '=', rhsOperatorIndex: 1 },
            { type: 'value', tokenIndex: 2, value: 'propB', rhsOperator: '&', rhsOperatorIndex: 3 },
            { type: 'value', tokenIndex: 4, value: 'propC', rhsOperator: '=', rhsOperatorIndex: 5 },
            { type: 'value', tokenIndex: 6, value: 'propD' }
        ]
    },
    termTree: {
        type: 'logic',
        operator: '&',
        operands: [
            {
                type: 'predicate',
                operator: '=',
                operands: [{ type: 'value', value: 'propA' }, { type: 'value', value: 'propB' }]
            },
            {
                type: 'predicate',
                operator: '=',
                operands: [{ type: 'value', value: 'propC' }, { type: 'value', value: 'propD' }]
            }
        ]
    },
    filterDefinition: {
        type: 'Group',
        operator: '&',
        clauses: [
            {
                type: 'Binary',
                left: { type: 'Value', value: 'propA' },
                right: { type: 'Value', value: 'propB' },
                operator: '='
            },
            {
                type: 'Binary',
                left: { type: 'Value', value: 'propC' },
                right: { type: 'Value', value: 'propD' },
                operator: '='
            }]
    }

}

export const groupedClause: TestItem = {
    stringFilter: '(propA = propB & propC = propD)|(propE=propF&propG=propH)',
    tokens: ['(', 'propA', '=', 'propB', '&', 'propC', '=', 'propD', ')', '|', '(', 'propE', '=', 'propF', '&', 'propG', '=', 'propH', ')'],
    groupTerm: {
        type: 'group',
        tokenIndex: null,
        terms: [
            {
                type: 'group',
                tokenIndex: 0,
                terms: [
                    {
                        type: 'value',
                        value: 'propA',
                        tokenIndex: 1,
                        rhsOperator: '=',
                        rhsOperatorIndex: 2
                    },
                    {
                        type: 'value',
                        value: 'propB',
                        tokenIndex: 3,
                        rhsOperator: '&',
                        rhsOperatorIndex: 4
                    },
                    {
                        type: 'value',
                        value: 'propC',
                        tokenIndex: 5,
                        rhsOperator: '=',
                        rhsOperatorIndex: 6
                    },
                    {
                        type: 'value',
                        value: 'propD',
                        tokenIndex: 7
                    }
                ],
                rhsOperator: '|',
                rhsOperatorIndex: 9
            },
            {
                type: 'group',
                tokenIndex: 10,
                terms: [
                    {
                        type: 'value',
                        value: 'propE',
                        tokenIndex: 11,
                        rhsOperator: '=',
                        rhsOperatorIndex: 12
                    },
                    {
                        type: 'value',
                        value: 'propF',
                        tokenIndex: 13,
                        rhsOperator: '&',
                        rhsOperatorIndex: 14
                    },
                    {
                        type: 'value',
                        value: 'propG',
                        tokenIndex: 15,
                        rhsOperator: '=',
                        rhsOperatorIndex: 16
                    },
                    {
                        type: 'value',
                        value: 'propH',
                        tokenIndex: 17
                    }
                ]
            }
        ]
    },
    termTree: {
        type: 'logic',
        operator: '|',
        operands: [
            {
                type: 'logic', operator: '&',
                operands: [{
                    type: 'predicate', operator: '=',
                    operands: [{ type: 'value', value: 'propA' }, { type: 'value', value: 'propB' }]
                },
                {
                    type: 'predicate', operator: '=',
                    operands: [{ type: 'value', value: 'propC' }, { type: 'value', value: 'propD' }]
                }]
            },
            {
                type: 'logic', operator: '&',
                operands: [
                    {
                        type: 'predicate', operator: '=',
                        operands: [{ type: 'value', value: 'propE' }, { type: 'value', value: 'propF' }]
                    },
                    {
                        type: 'predicate', operator: '=',
                        operands: [{ type: 'value', value: 'propG' }, { type: 'value', value: 'propH' }]
                    }]
            }]
    },
    filterDefinition: {
        type: 'Group',
        operator: '|',
        clauses: [
            {
                type: 'Group',
                operator: '&',
                clauses: [{
                    type: 'Binary',
                    left: { type: 'Value', value: 'propA' },
                    right: { type: 'Value', value: 'propB' },
                    operator: '='
                }, {
                    type: 'Binary',
                    left: { type: 'Value', value: 'propC' },
                    right: { type: 'Value', value: 'propD' },
                    operator: '='
                }]
            },
            {
                type: 'Group',
                operator: '&',
                clauses: [
                    {
                        type: 'Binary',
                        left: { type: 'Value', value: 'propE' },
                        right: { type: 'Value', value: 'propF' },
                        operator: '='
                    }, {
                        type: 'Binary',
                        left: { type: 'Value', value: 'propG' },
                        right: { type: 'Value', value: 'propH' },
                        operator: '='
                    }]
            }]
    }

}
