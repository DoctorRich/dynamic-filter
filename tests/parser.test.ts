import * as TestItems from './testItems';
import { TokenFilterParser } from "../src/parse/tokenFilterParser";
import { value } from "../src/definition/definitionCreators";

describe('Parser', () => {

    const parser = new TokenFilterParser(
        {
            binaryOperatorTokens: ['+', '-'],
            unaryOperatorTokens: ['upper', 'trim'],
            logicOperatorTokens: ['&', '|'],
            predicateOperatorTokens: ['='],
            groupStartTokens: ['('],
            groupEndTokens: [')']
        },
        t => value(t.value)
    );

    test('single term', async () => {
        // arrange
        const stringFilter = TestItems.singleTerm.stringFilter;
        // act
        const result = parser.parse(stringFilter);
        // assert
        expect(result).toEqual(TestItems.singleTerm.filterDefinition);
    });

    test('single term with arithmetic expression', async () => {
        // arrange
        const stringFilter = TestItems.singleTermArithmetic.stringFilter;
        // act
        const result = parser.parse(stringFilter);
        // assert
        expect(result).toEqual(TestItems.singleTermArithmetic.filterDefinition);
    });

    test('single term with unary functions', async () => {
        // arrange
        const stringFilter = TestItems.singleTermUnaryFunctions.stringFilter;
        // act
        const result = parser.parse(stringFilter);
        // assert
        expect(result).toEqual(TestItems.singleTermUnaryFunctions.filterDefinition);
    });

    test('single term with nested unary functions', async () => {
        // arrange
        const stringFilter = TestItems.singleTermNestedUnary.stringFilter;
        // act
        const result = parser.parse(stringFilter);
        // assert
        expect(result).toEqual(TestItems.singleTermNestedUnary.filterDefinition);
    });

    test('two terms with and', async () => {
        // arrange
        const stringFilter = TestItems.simpleMultiClause.stringFilter;
        // act
        const result = parser.parse(stringFilter);
        // assert
        expect(result).toEqual(TestItems.simpleMultiClause.filterDefinition);
    });

    test('grouped terms', async () => {
        // arrange
        const stringFilter = TestItems.groupedClause.stringFilter;
        // act
        const result = parser.parse(stringFilter);
        // assert
        expect(result).toEqual(TestItems.groupedClause.filterDefinition);
    });

});