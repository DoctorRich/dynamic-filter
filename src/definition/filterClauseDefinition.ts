import { FilterOperandDefinition } from "./filterOperandDefinition";

/**
 * Filter Clause Definition.
 * <p>These clauses define operations that evaluate to boolean values
 * <p>Binary clauses represent comparisons between operands (e.g. propA > 5)
 * <p>Group clauses represent logic combinations of clauses (e.g. propA > 5 & propB = 'EUR')
 */

export type FilterClauseDefinition =
    | BinaryFilterClauseDefinition
    | GroupFilterClauseDefinition
    ;

export interface GroupFilterClauseDefinition {
    readonly type: 'Group';
    readonly operator: string;
    readonly clauses: readonly FilterClauseDefinition[];
}

export interface BinaryFilterClauseDefinition {
    readonly type: 'Binary';
    readonly operator: string;
    readonly left: FilterOperandDefinition;
    readonly right: FilterOperandDefinition;
}