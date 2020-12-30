import { contextProperty, property, runtimeValue, value } from "../definition/definitionCreators";
import { FilterParserBuilder } from "../parse/builder/parserBuilder";
import { ValueConverter } from "../parse/filterParser";
import { defaultBinaryPredicates, defaultUnaryOperations } from "./defaultFilterFactory";
import * as Logic from "./logicOperations";
import * as Binary from "./binaryOperations";

// group symbols
const defaultGroupStart = '(';
const defaultGroupEnd = ')';
// operator precedence
const defaultLogicPrecedence = [Logic.AND_TOKEN, Logic.OR_TOKEN, Logic.XOR_TOKEN];
export const defaultBinaryPrecedence: readonly string[] = [
    Binary.MULTIPLY_TOKEN,
    Binary.DIVIDE_TOKEN,
    Binary.MINUS_TOKEN,
    Binary.ADD_TOKEN];
// operator tokens
const defaultPredicateTokens: readonly string[] = Array.from(defaultBinaryPredicates.keys());
const defaultUnaryTokens: readonly string[] = Array.from(defaultUnaryOperations.keys());

export const createDefaultFilterParser = () => {
    return new FilterParserBuilder()
        .setLogicOperatorTokens(defaultLogicPrecedence)
        .setBinaryOperatorTokens(defaultBinaryPrecedence)
        .setPredicateOperatorTokens(defaultPredicateTokens)
        .setUnaryOperatorTokens(defaultUnaryTokens)
        .setGroupStartToken(defaultGroupStart)
        .setGroupEndToken(defaultGroupEnd)
        .setValueConverter(defaultValueConverter)
        .build();
}



export const defaultValueConverter: ValueConverter = (t) => {
    // handle object properties
    if (t.value.startsWith('[') && t.value.endsWith(']')) {
        return property(t.value.substring(1, t.value.length - 1));
    }
    // handle context properties
    if (t.value.startsWith('{') && t.value.endsWith('}')) {
        return contextProperty(t.value.substring(1, t.value.length - 1));
    }
    // handle runtime values
    if (t.value.startsWith('@')) {
        return runtimeValue(t.value.substring(1));
    }
    // handle forced string values
    if (t.value.startsWith('\'') && t.value.endsWith('\'')) {
        return value(t.value.substring(1, t.value.length - 1));
    }
    // convert to number
    const numberValue = Number(t.value);
    return value(isNaN(numberValue) ? t.value : numberValue);
}