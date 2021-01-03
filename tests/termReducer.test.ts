import { ParseErrorHander } from '../src/parse/parseErrorHandler';
import { TermReducer } from '../src/parse/termReducer';
import * as TestItems from './testItems';

describe('Term Reducer', () => {

    const termConverter = new TermReducer(
        ['&', '|'],
        ['='],
        ['+']
    );

    test('Convert single term', async () => {
        // arrange
        const errorHandler = new ParseErrorHander(TestItems.singleTerm.tokens);
        const groupTerm = TestItems.singleTerm.groupTerm;
        // act
        const result = termConverter.gatherAllTerms(errorHandler, groupTerm);
        // assert
        expect(result).toEqual(TestItems.singleTerm.termTree);
    });

    test('Convert single term with arithmetic expression', async () => {
        // arrange
        const errorHandler = new ParseErrorHander(TestItems.singleTermArithmetic.tokens);
        const groupTerm = TestItems.singleTermArithmetic.groupTerm;
        // act
        const result = termConverter.gatherAllTerms(errorHandler, groupTerm);
        // assert
        expect(result).toEqual(TestItems.singleTermArithmetic.termTree);
    });

    test('Convert single term with unary functions', async () => {
        // arrange
        const errorHandler = new ParseErrorHander(TestItems.singleTermUnaryFunctions.tokens);
        const groupTerm = TestItems.singleTermUnaryFunctions.groupTerm;
        // act
        const result = termConverter.gatherAllTerms(errorHandler, groupTerm);
        // assert
        expect(result).toEqual(TestItems.singleTermUnaryFunctions.termTree);
    });

    test('Convert single term with nested unary functions', async () => {
        // arrange
        const errorHandler = new ParseErrorHander(TestItems.singleTermNestedUnary.tokens);
        const groupTerm = TestItems.singleTermNestedUnary.groupTerm;
        // act
        const result = termConverter.gatherAllTerms(errorHandler, groupTerm);
        // assert
        expect(result).toEqual(TestItems.singleTermNestedUnary.termTree);
    });

    test('Convert two terms with and', async () => {
        // arrange
        const errorHandler = new ParseErrorHander(TestItems.simpleMultiClause.tokens);
        const groupTerm = TestItems.simpleMultiClause.groupTerm;
        // act
        const result = termConverter.gatherAllTerms(errorHandler, groupTerm);
        // assert
        expect(result).toEqual(TestItems.simpleMultiClause.termTree);
    });

    test('Convert grouped terms', async () => {
        // arrange
        const errorHandler = new ParseErrorHander(TestItems.groupedClause.tokens);
        const groupTerm = TestItems.groupedClause.groupTerm;
        // act
        const result = termConverter.gatherAllTerms(errorHandler, groupTerm);
        // assert
        expect(result).toEqual(TestItems.groupedClause.termTree);
    });

});
