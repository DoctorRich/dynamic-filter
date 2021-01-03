import * as TestItems from './testItems';
import { TokenFilterParser } from "../src/parse/tokenFilterParser";
import { value } from "../src/definition/definitionCreators";
import { createDefaultFilterParser } from '../src/defaults/defaultFilterParser';

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


    describe('Parser error', () => {
        const filterParser = createDefaultFilterParser();

        test('Single clause: two predicates', async () => {
            // arrange
            const filterString = '[propA] == {propB}';
            // act/assert
            expect(() => filterParser.parse(filterString)).toThrow('Error at character (16): [propA]= -->=<-- {propB} Operator = invalid here');
        });

        test('Single clause: two separate predicates', async () => {
            // arrange
            const filterString = '[propA] = < {propB}';
            // act/assert
            expect(() => filterParser.parse(filterString)).toThrow('Error at character (16): [propA]= --><<-- {propB} Operator < invalid here');
        });

        test.only('Single clause: too many predicates', async () => {
            // arrange
            const filterString = '[propA] = {propB} < 4';
            // act/assert
            expect(() => filterParser.parse(filterString)).toThrow('Error at character (7): [propA] -->=<-- {propB}<4 Predicate result should not be used as input for the < predicate');
        });

        test.only('Nested clause: too many predicates', async () => {
            // arrange
            const filterString = 'UPPER(TRIM([propA])) = 4 < 3';
            // act/assert
            expect(() => filterParser.parse(filterString)).toThrow('UPPER(TRIM([propA])) -->=<-- 4<3 Predicate result should not be used as input for the < predicate');
        });

        test('Single clause: too many brackets', async () => {
            // arrange
            const filterString = '([propA] = {propB}))';
            // act/assert
            expect(() => filterParser.parse(filterString)).toThrow('Error at character (18): ([propA]={propB}) -->)<--  Mismatched token');
        });

    });



});