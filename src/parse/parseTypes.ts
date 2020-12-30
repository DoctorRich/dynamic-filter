/**
 * Tokens are converted into a Term Tree before terms are reduced (operators gathered by precedence) and then converted into the Filter Definition
 */
export type TermTreeNode =
    | TermNodeGroup
    | TermTreeValue
    | TermTreeOperator
    ;

export interface TermNodeBase {
    tokenIndex?: number,
    rhsOperator?: string;
    rhsOperatorIndex?: number;
}
export interface TermNodeGroup extends TermNodeBase {
    type: 'group',
    terms: TermTreeNode[];
}
export interface TermTreeValue extends TermNodeBase {
    type: 'value',
    value: string,
}
export interface TermTreeOperator extends TermNodeBase {
    type: 'logic' | 'predicate' | 'unary' | 'binary',
    operator: string;
    operands: TermTreeNode[];
}

/**
 * Fully reduced tree
 */
export type ReducedTermTreeNode =
    | TermTreeValue
    | ReducedTermTreeOperator
    ;
export interface ReducedTermTreeOperator extends TermTreeOperator {
    operands: ReducedTermTreeNode[];
}

/**
 * Intermediate interpreter terms 
 */
export interface InterpreterGroup extends TermNodeGroup {
    type: 'group';
    terms: FilterTerm[];
    transientItem?: TransientParseItem;
    unaryOperator?: string;
}
export interface TransientParseItem {
    tokenIndex?: number,
    value?: string;
}
export type FilterTerm = InterpreterGroup | TermTreeOperator | TermTreeValue;



