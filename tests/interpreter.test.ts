import { TokenInterpreter } from '../src/parse/tokenInterpreter';
import * as TestItems from './testItems';

describe('Interpreter', () => {

    const interpreter = new TokenInterpreter(
        new Set(['upper', 'trim']),
        new Set(['&', '|', '=', '+']),
        new Set(['(']),
        new Set([')'])
    );

    test('Interpret single term', async () => {
        // arrange
        const tokens = TestItems.singleTerm.tokens;
        // act
        const result = interpreter.parse(tokens);
        // assert
        expect(result).toEqual(TestItems.singleTerm.groupTerm);
    });

    test('Interpret single term with arithmetic expression', async () => {
        // arrange
        const tokens = TestItems.singleTermArithmetic.tokens;
        // act
        const result = interpreter.parse(tokens);
        // assert
        expect(result).toEqual(TestItems.singleTermArithmetic.groupTerm);
    });

    test('Interpret single term with unary functions', async () => {
        // arrange
        const tokens = TestItems.singleTermUnaryFunctions.tokens;
        // act
        const result = interpreter.parse(tokens);
        // assert
        expect(result).toEqual(TestItems.singleTermUnaryFunctions.groupTerm);
    });

    test('Interpret single term with nested unary functions', async () => {
        // arrange
        const tokens = TestItems.singleTermNestedUnary.tokens;
        // act
        const result = interpreter.parse(tokens);
        // assert
        expect(result).toEqual(TestItems.singleTermNestedUnary.groupTerm);
    });

    test('Interpret two terms with and', async () => {
        // arrange
        const tokens = TestItems.simpleMultiClause.tokens;
        // act
        const result = interpreter.parse(tokens);
        // assert
        expect(result).toEqual(TestItems.simpleMultiClause.groupTerm);
    });

    test('Interpret grouped terms', async () => {
        // arrange
        const tokens = TestItems.groupedClause.tokens;
        // act
        const result = interpreter.parse(tokens);
        // assert
        expect(result).toEqual(TestItems.groupedClause.groupTerm);
    });

});
