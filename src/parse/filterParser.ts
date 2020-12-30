import { FilterClauseDefinition } from "../definition/filterClauseDefinition";
import { FilterOperandDefinition } from "../definition/filterOperandDefinition";
import { TermTreeValue } from "./parseTypes";

/**
 * Parse a filter string into a filter clause definition
 */
export interface FilterParser {
    parse(s: string): FilterClauseDefinition;
}

/**
 * Converts a parsed value into a filter operand definition
 */
export type ValueConverter = (t: TermTreeValue) => FilterOperandDefinition;

