export class TokenSeparator {
    private readonly _input: string;
    private _tokens: string[];
    private _currentIndex: number;
    private _transientToken: string;

    constructor(input: string) {
        this._input = input == null ? '' : input;
    }

    public separateTokens(specialTokens: readonly string[]): string[] {
        this._initialise();
        // 
        const firstChars = this._getFirstChars(specialTokens);
        const sortedTokens = this._orderByLongest([...specialTokens]);
        // while there are characters to read
        while (this._currentIndex < this._input.length) {
            // get the current character
            const currChar = this._input[this._currentIndex];
            // if it's the start of a special token, then match maximally
            const foundSpecial = firstChars.has(currChar) && sortedTokens.reduce((isMatch, s) => isMatch || this._matchForward(s), false);
            // if not, then advance
            if (!foundSpecial) {
                this._storeCharAndAdvance();
            }
        }
        // push any remaining token
        this._pushCurrent();
        // return
        return this._tokens;
    }

    private _initialise() {
        this._tokens = [];
        this._currentIndex = 0;
        this._transientToken = '';
    }

    private _getFirstChars(specialTokens: readonly string[]) {
        return specialTokens.reduce((m, s) => s != null && s.length > 0 ? m.add(s[0]) : m, new Set<string>());
    }

    private _orderByLongest(specialTokens: string[]) {
        return specialTokens.sort((a, b) => b.length - a.length);
    }

    private _matchForward(s: string): boolean {
        if (this._currentIndex + s.length <= this._input.length && this._input.substr(this._currentIndex, s.length) === s) {
            this._pushAndAdvance(s);
            return true;
        }
        return false;
    }

    private _pushCurrent() {
        const currentToken = this._transientToken.trim();
        if (currentToken.length > 0) {
            this._tokens.push(currentToken);
            this._transientToken = '';
        }
    }

    private _pushAndAdvance(s: string) {
        this._pushCurrent();
        this._tokens.push(s);
        this._currentIndex += s.length;
    }

    private _storeCharAndAdvance() {
        this._transientToken += this._input[this._currentIndex];
        this._currentIndex++;
    }

}