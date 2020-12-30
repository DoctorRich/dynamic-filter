import { FilterClauseDefinition } from "../definition/filterClauseDefinition";
import { FilterConverter } from "./filterConverter";
import { FilterParser, ValueConverter } from "./filterParser";
import { FilterTokens } from "./filterTokens";
import { TermConverter } from "./termConverter";
import { TermReducer } from "./termReducer";
import { TokenInterpreter } from "./tokenInterpreter";
import { TokenSeparator } from "./tokenSeparator";

export class TokenFilterParser implements FilterParser {

    private _valueConverter: ValueConverter;
    private _filterTokens: FilterTokens;
    private _allUnaryOperatorTokens: Set<string>;
    private _allBinaryOperatorTokens: Set<string>;
    private _groupStartTokens: Set<string>;
    private _groupEndTokens: Set<string>;
    private _allFilterTokens: readonly string[];

    constructor(filterTokens: FilterTokens, valueConverter: ValueConverter) {
        this._filterTokens = filterTokens;
        this._valueConverter = valueConverter;
        // create sets for speedier lookup
        this._allUnaryOperatorTokens = new Set(this._filterTokens.unaryOperatorTokens);
        this._allBinaryOperatorTokens = new Set([
            ...this._filterTokens.logicOperatorTokens,
            ...this._filterTokens.predicateOperatorTokens,
            ...this._filterTokens.binaryOperatorTokens
        ]);
        this._groupStartTokens = new Set(this._filterTokens.groupStartTokens);
        this._groupEndTokens = new Set(this._filterTokens.groupEndTokens);
        // add all filter tokens
        this._allFilterTokens = [
            ...this._filterTokens.groupStartTokens,
            ...this._filterTokens.groupEndTokens,
            ...this._filterTokens.unaryOperatorTokens,
            ...this._filterTokens.logicOperatorTokens,
            ...this._filterTokens.predicateOperatorTokens,
            ...this._filterTokens.binaryOperatorTokens
        ];
    }

    parse(s: string): FilterClauseDefinition {
        // split tokens
        const tokens = new TokenSeparator(s).separateTokens(this._allFilterTokens);
        // interpret the tokens
        const interpreter = new TokenInterpreter(
            this._allUnaryOperatorTokens,
            this._allBinaryOperatorTokens,
            this._groupStartTokens,
            this._groupEndTokens
        );

        const parsed = interpreter.parse(tokens);
        // convert item
        const reducer = new TermReducer(this._filterTokens.logicOperatorTokens, this._filterTokens.predicateOperatorTokens, this._filterTokens.binaryOperatorTokens);
        const termTree = reducer.gatherAllTerms(parsed);
        const filterConverter = new FilterConverter(this._valueConverter);
        return filterConverter.convertToFilter(termTree);
    }

}
