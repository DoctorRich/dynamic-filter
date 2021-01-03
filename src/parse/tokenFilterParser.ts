import { FilterClauseDefinition } from "../definition/filterClauseDefinition";
import { FilterConverter } from "./filterConverter";
import { FilterParser, ValueConverter } from "./filterParser";
import { FilterTokens } from "./filterTokens";
import { ParseErrorHander } from "./parseErrorHandler";
import { TermConverter } from "./termConverter";
import { TermReducer } from "./termReducer";
import { TokenInterpreter } from "./tokenInterpreter";
import { TokenSeparator } from "./tokenSeparator";

export class TokenFilterParser implements FilterParser {

    private readonly _valueConverter: ValueConverter;
    private readonly _termReducer: TermReducer;
    private readonly _filterTokens: FilterTokens;
    private readonly _allUnaryOperatorTokens: Set<string>;
    private readonly _allBinaryOperatorTokens: Set<string>;
    private readonly _groupStartTokens: Set<string>;
    private readonly _groupEndTokens: Set<string>;
    private readonly _allFilterTokens: readonly string[];

    constructor(filterTokens: FilterTokens, valueConverter: ValueConverter) {
        this._filterTokens = filterTokens;
        this._valueConverter = valueConverter;
        this._termReducer = new TermReducer(this._filterTokens.logicOperatorTokens, this._filterTokens.predicateOperatorTokens, this._filterTokens.binaryOperatorTokens);
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
        const parseErrorHandler = new ParseErrorHander(tokens);
        // interpret the tokens
        const interpreter = new TokenInterpreter(
            this._allUnaryOperatorTokens,
            this._allBinaryOperatorTokens,
            this._groupStartTokens,
            this._groupEndTokens
        );
        // parse and convert item
        const parsed = interpreter.parse(tokens);
        const termTree = this._termReducer.gatherAllTerms(parseErrorHandler, parsed);
        const filterConverter = new FilterConverter(this._valueConverter);
        return filterConverter.convertToFilter(termTree);
    }

}
