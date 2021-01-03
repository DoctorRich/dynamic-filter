export class ParseErrorHander {

    constructor(
        private readonly _tokens: readonly string[]
    ) { }

    public throwParseError(tokenIndex: number, m: string) {
        const start = 0;
        const stop = this._tokens.length;
        let filterValue = '';
        let charIndex = 0;
        for (let i = start; i < stop; ++i) {
            const iToken = this._tokens[i];
            const isCurrent = i === tokenIndex;
            filterValue += isCurrent ? ' -->' + iToken + '<-- ' : iToken;
            if (i < tokenIndex) {
                charIndex += iToken.length;
            }
        }
        throw new Error(`Error at character (${charIndex}): ${filterValue} ${m}`);
    }

}
