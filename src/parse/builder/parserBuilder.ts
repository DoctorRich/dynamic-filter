import { value } from "../../definition/definitionCreators";
import { FilterParser, ValueConverter } from "../filterParser";
import { TokenFilterParser } from "../tokenFilterParser";

export class FilterParserBuilder {
    // tokens
    private _predicateOperatorTokens: readonly string[];
    private _logicOperatorTokens: readonly string[];
    private _unaryOperatorTokens: readonly string[];
    private _binaryOperatorTokens: readonly string[];
    private _groupStartToken: string;
    private _groupEndToken: string;
    // value converter
    private _valueConverter: ValueConverter;

    /**
     * Build the parser
     */
    public build(): FilterParser {
        return new TokenFilterParser(
            {
                logicOperatorTokens: this.logicOperatorTokens,
                predicateOperatorTokens: this.predicateOperatorTokens,
                unaryOperatorTokens: this.unaryOperatorTokens,
                binaryOperatorTokens: this.binaryOperatorTokens,
                groupStartTokens: [this.groupStartToken],
                groupEndTokens: [this.groupEndToken]
            },
            this.valueConverter
        );
    }

    /**
     * Getter predicateOperatorTokens
     * @return {readonly string[]}
     */
    private get predicateOperatorTokens(): readonly string[] {
        if (this._predicateOperatorTokens == null) {
            this._predicateOperatorTokens = [];
        }
        return this._predicateOperatorTokens;
    }

    /**
     * Setter predicateOperatorTokens
     * @param {readonly string[]} value
     */
    public setPredicateOperatorTokens(value: readonly string[]): this {
        this._predicateOperatorTokens = value;
        return this;
    }


    /**
     * Getter logicOperatorTokens
     * @return {readonly string[]}
     */
    private get logicOperatorTokens(): readonly string[] {
        if (this._logicOperatorTokens == null) {
            this._logicOperatorTokens = [];
        }
        return this._logicOperatorTokens;
    }

    /**
     * Setter logicOperatorTokens
     * @param {readonly string[]} value
     */
    public setLogicOperatorTokens(value: readonly string[]): this {
        this._logicOperatorTokens = value;
        return this;
    }


    /**
     * Getter unaryOperatorTokens
     * @return {readonly string[]}
     */
    private get unaryOperatorTokens(): readonly string[] {
        if (this._unaryOperatorTokens == null) {
            this._unaryOperatorTokens = [];
        }
        return this._unaryOperatorTokens;
    }

    /**
     * Setter unaryOperatorTokens
     * @param {readonly string[]} value
     */
    public setUnaryOperatorTokens(value: readonly string[]): this {
        this._unaryOperatorTokens = value;
        return this;
    }

    /**
     * Getter binaryOperatorTokens
     * @return {readonly string[]}
     */
    private get binaryOperatorTokens(): readonly string[] {
        if (this._binaryOperatorTokens == null) {
            this._binaryOperatorTokens = [];
        }
        return this._binaryOperatorTokens;
    }

    /**
     * Setter binaryOperatorTokens
     * @param {readonly string[]} value
     */
    public setBinaryOperatorTokens(value: readonly string[]): this {
        this._binaryOperatorTokens = value;
        return this;
    }


    /**
     * Getter groupStartToken
     * @return {string}
     */
    private get groupStartToken(): string {
        if (this._groupStartToken == null) {
            this._groupStartToken = '(';
        }
        return this._groupStartToken;
    }

    /**
     * Setter groupStartToken
     * @param {string} value
     */
    public setGroupStartToken(value: string): this {
        this._groupStartToken = value;
        return this;
    }

    /**
     * Getter groupEndToken
     * @return {string}
     */
    private get groupEndToken(): string {
        if (this._groupEndToken == null) {
            this._groupEndToken = '(';
        }
        return this._groupEndToken;
    }

    /**
     * Setter groupEndToken
     * @param {string} value
     */
    public setGroupEndToken(value: string): this {
        this._groupEndToken = value;
        return this;
    }

    /**
     * Getter valueConverter
     * @return {ValueConverter}
     */
    private get valueConverter(): ValueConverter {
        if (this._valueConverter == null) {
            this._valueConverter = t => value(t.value);
        }
        return this._valueConverter;
    }

    /**
     * Setter valueConverter
     * @param {ValueConverter} value
     */
    public setValueConverter(value: ValueConverter): this {
        this._valueConverter = value;
        return this;
    }


}
