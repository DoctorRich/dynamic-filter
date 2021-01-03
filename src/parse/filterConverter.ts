import { stringify } from "json5";
import { binaryClause, binaryOp, groupClause, unaryOp } from "../definition/definitionCreators";
import { BinaryFilterClauseDefinition, FilterClauseDefinition, GroupFilterClauseDefinition } from "../definition/filterClauseDefinition";
import { FilterOperandDefinition } from "../definition/filterOperandDefinition";
import { ValueConverter } from "./filterParser";
import { TermTreeNode, TermTreeOperator } from "./parseTypes";

export class FilterConverter {

    constructor(
        private readonly _valueConverter: ValueConverter,
    ) { }

    public convertToFilter(term: TermTreeNode): FilterClauseDefinition {
        return this.convertLogicalOperatorTerm(term);
    }

    private convertLogicalOperatorTerm(t: TermTreeNode): FilterClauseDefinition {
        switch (t.type) {
            case 'logic':
                return this.convertLogic(t);
            case 'predicate':
                return this.convertPredicate(t);
        }
        throw new Error(`${t.type} is not valid as a term for a logical operator`);
    }

    private convertLogic(t: TermTreeOperator): GroupFilterClauseDefinition {
        // logic operator term can only contain logic or predicate groups (resulting in a boolean)
        return groupClause(t.operator, ...t.operands.map(i => this.convertLogicalOperatorTerm(i)));
    }

    private convertPredicate(t: TermTreeOperator): BinaryFilterClauseDefinition {
        if (t?.operands?.length !== 2) {
            throw new Error(`Predicate ${t.operator} does not have required number of operands`);
        }
        return binaryClause(this.convertToOperand(t.operands[0]), t.operator, this.convertToOperand(t.operands[1]));
    }

    private convertClauseOperator(t: TermTreeOperator): FilterOperandDefinition {
        switch (t.type) {
            case 'unary':
                return unaryOp(t.operator, this.convertToOperand(t.operands[0]));
            case 'binary':
                return binaryOp(t.operator, ...t.operands.map(i => this.convertToOperand(i)));
            default:
                throw new Error(`${stringify(t)} Binary clause operand ${t.operator} is a ${t.type} but must be a unary or binary operation`);
        }
    }

    private convertToOperand(t: TermTreeNode): FilterOperandDefinition {
        switch (t.type) {
            case 'value':
                return this._valueConverter(t);
            case 'logic':
            case 'predicate':
            case 'unary':
            case 'binary':
                return this.convertClauseOperator(t);
            default:
                throw new Error(`Binary clause operand ${t.type} must be operator or value`);
        }
    }
}
