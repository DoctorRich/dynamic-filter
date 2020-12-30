import { TokenSeparator } from '../src/parse/tokenSeparator';

describe('Token Separator', () => {

    test('Test multiple tokens', async () => {
        // arrange
        const specialTokens = ['&', '|', '<', '>', '=', '<>', '(', ')'];
        // act
        const tokens = new TokenSeparator('propA = 2 & (propB < 4 | propC <> hello)').separateTokens(specialTokens);
        // assert
        const expected = ['propA', '=', '2', '&', '(', 'propB', '<', '4', '|', 'propC', '<>', 'hello', ')'];
        expect(tokens).toEqual(expected);
    });

    test('Test grouped clauses', async () => {
        // arrange
        const specialTokens = ['(', ')', '&', '|', '=', 'upper', 'trim'];
        // act
        const tokens = new TokenSeparator('(propA=propB&propC=propD)|(propE=propF&propG=propH)').separateTokens(specialTokens);
        // assert
        const expected = ['(', 'propA', '=', 'propB', '&', 'propC', '=', 'propD', ')', '|', '(', 'propE', '=', 'propF', '&', 'propG', '=', 'propH', ')',];
        expect(tokens).toEqual(expected);
    });



    test('complex', async () => {
        // arrange
        const stringFilter = '[propA] = {propB} | ([propA] = match3 & [objectPropNum] = {contextPropNum} - 1 -1 + 1)';
        const specialTokens = ['(', ')', '&', '|', '=', 'upper', 'trim', '-', '+'];
        // act
        const tokens = new TokenSeparator(stringFilter).separateTokens(specialTokens);
        // assert
        expect(tokens).toEqual([
            '[propA]',
            '=',
            '{propB}',
            '|',
            '(',
            '[propA]',
            '=',
            'match3',
            '&',
            '[objectPropNum]',
            '=',
            '{contextPropNum}',
            '-',
            '1',
            '-',
            '1',
            '+',
            '1',
            ')'
        ]);
    });


});