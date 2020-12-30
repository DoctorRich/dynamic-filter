import { value } from '../src/definition/definitionCreators';
import { FilterConverter } from '../src/parse/filterConverter';
import * as TestItems from './testItems';

describe('Term Tree Conerter', () => {

    const filterConverter = new FilterConverter(
        (t) => value(t.value)
    );

    test('Convert single term', async () => {
        // arrange
        const termTree = TestItems.singleTerm.termTree;
        // act
        const result = filterConverter.convertToFilter(termTree);
        // assert
        expect(result).toEqual(TestItems.singleTerm.filterDefinition);
    });

    test('Convert single term with arithmetic expression', async () => {
        // arrange
        const termTree = TestItems.singleTermArithmetic.termTree;
        // act
        const result = filterConverter.convertToFilter(termTree);
        // assert
        expect(result).toEqual(TestItems.singleTermArithmetic.filterDefinition);
    });

    test('Convert single term with unary functions', async () => {
        // arrange
        const termTree = TestItems.singleTermUnaryFunctions.termTree;
        // act
        const result = filterConverter.convertToFilter(termTree);
        // assert
        expect(result).toEqual(TestItems.singleTermUnaryFunctions.filterDefinition);
    });

    test('Convert single term with nested unary functions', async () => {
        // arrange
        const termTree = TestItems.singleTermNestedUnary.termTree;
        // act
        const result = filterConverter.convertToFilter(termTree);
        // assert
        expect(result).toEqual(TestItems.singleTermNestedUnary.filterDefinition);
    });

    test('Convert two terms with and', async () => {
        // arrange
        const termTree = TestItems.simpleMultiClause.termTree;
        // act
        const result = filterConverter.convertToFilter(termTree);
        // assert
        expect(result).toEqual(TestItems.simpleMultiClause.filterDefinition);
    });

    test('Convert grouped terms', async () => {
        // arrange
        const termTree = TestItems.groupedClause.termTree;
        // act
        const result = filterConverter.convertToFilter(termTree);
        // assert
        expect(result).toEqual(TestItems.groupedClause.filterDefinition);
    });

});
