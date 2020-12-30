import { FilterTerm, InterpreterGroup, TermTreeOperator, TermTreeValue, TransientParseItem } from "./parseTypes";

/**
 * Interprets the tokens, collecting them into filter terms (groups of binary clauses and logic operators)
 */
export class TokenInterpreter {
    constructor(
        private readonly _unaryOperators: Set<string>,
        private readonly _binaryOperators: Set<string>,
        private readonly _startTokens: Set<string>,
        private readonly _endTokens: Set<string>,
    ) { }

    public parse(tokens: readonly string[]): InterpreterGroup {
        const stateManager = this.createStateManager(tokens);
        // create handlers
        const handlers = this.createHandlers(stateManager);
        // interpret tokens
        while (stateManager.moveNext()) {
            const token = stateManager.currentToken();
            handlers.reduce((isHandled, handler) => isHandled || handler.handleToken(token), false);
        }
        // finish
        return stateManager.finish();
    }

    private createStateManager(tokens: readonly string[]): StateManager {
        const stateManager = new StateManager(
            {
                tokens,
                termStack: [],
                currentTokenIndex: -1
            },
            new TermFactory()
        );
        stateManager.pushGroup();
        return stateManager;
    }


    private createHandlers(stateManager: StateManager): TokenHandler[] {
        const handlers = [
            new StartGroupHander(stateManager, this._startTokens, this._unaryOperators),
            new EndGroupHandler(stateManager, this._endTokens),
            new OperatorHander(stateManager, this._binaryOperators),
            new ClauseOperandHandler(stateManager)
        ];
        return handlers;

    }
}

interface TokenHandler {
    handleToken(token: string): boolean;
}


//#region Interpreter State and Management

/**
 * The state contains the tokens and current interpreter position.
 * The term stack represent a stack of currently parsing group terms.
 * If the tokens are correct, then there should remain only one group after interpreting all tokens.
 */
interface InterpreterState {
    readonly tokens: readonly string[];
    currentTokenIndex: number;
    readonly termStack: InterpreterGroup[];
}

/**
 * Factory for creating the term objects
 */
class TermFactory {

    public createGroup(tokenIndex: number, unaryOperator?: string): InterpreterGroup {
        return {
            type: 'group',
            tokenIndex: tokenIndex < 0 ? null : tokenIndex,
            terms: [],
            unaryOperator,
            transientItem: {}
        };
    }

    public createUnaryOperation(tokenIndex: number, operator: string, operands: InterpreterGroup): TermTreeOperator {
        return {
            type: 'unary',
            tokenIndex,
            operator,
            operands: [operands]
        };
    }

    public createValue(tokenIndex: number, value: string): TermTreeValue {
        return {
            type: 'value',
            tokenIndex,
            value
        };
    }

}

/**
 * Helper class for querying and updating the state
 */
class StateManager {

    constructor(
        private _state: InterpreterState,
        private _termFactory: TermFactory
    ) { }

    public throwParseError(m: string) {
        const padding = 5;
        const start = 0; //Math.max(0, this._state.currentTokenIndex - padding);
        const stop = this._state.tokens.length; //Math.min(this._state.tokens.length, this._state.currentTokenIndex + padding);
        let point = start === 0 ? '' : '... ';
        for (let i = start; i < stop; ++i) {
            if (i === this._state.currentTokenIndex) {
                point += ' -->';
            }
            point += this._state.tokens[i];
            if (i === this._state.currentTokenIndex) {
                point += '<-- ';
            }
        }
        throw new Error('Error at: ' + point + ' ' + m);
    }

    //#region Token iteration
    public moveNext(): boolean {
        return ++this._state.currentTokenIndex < this._state.tokens.length;
    }
    public currentToken(): string {
        return this._state.tokens[this._state.currentTokenIndex];
    }
    public currentIndex(): number {
        return this._state.currentTokenIndex;
    }

    //#endregion

    public finish(): InterpreterGroup {
        // finish any final clauses
        if (this.isItemFull(this.getCurrentTransientItem())) {
            this.addValueFromTransient();
        }
        const cg = this.getCurrentGroup();
        delete cg.transientItem;
        // check stack 
        if (this._state.termStack.length !== 1) {
            this.throwParseError('Mismatched close group');
        }
        // return group
        return this._state.termStack.pop();
    }

    //#region Add filter terms
    public addBinaryOperator(tokenIndex: number, token: string) {
        if (this.isGroupEmpty()) {
            this.throwParseError('Operator on empty group not supported');
        }
        const items = this.getCurrentGroup().terms;
        const current = items[items.length - 1];
        current.rhsOperator = token;
        current.rhsOperatorIndex = tokenIndex;
    }

    public addUnaryOperation(group: InterpreterGroup) {
        const item = this.getCurrentTransientItem();
        const unaryOperator = this._termFactory.createUnaryOperation(item.tokenIndex, item.value, group);
        this.pushFilterTerm(unaryOperator);
        this.resetCurrentParsingItem();
    }

    public addValueFromTransient() {
        const transientItem = this.getCurrentTransientItem();
        if (transientItem.value != null) {
            const value = this._termFactory.createValue(transientItem.tokenIndex, transientItem.value);
            this.pushFilterTerm(value);
            this.resetCurrentParsingItem();
        }
    }

    public addGroupToParent() {
        const group = this.popGroup();
        delete group.transientItem;
        this.pushFilterTerm(group);
    }

    private pushFilterTerm(term: FilterTerm) {
        const currentGroup = this.getCurrentGroup();
        if (currentGroup == null) {
            this.throwParseError('No groups left');
        }
        currentGroup.terms.push(term);
    }
    //#endregion

    //#region group stack operations
    public pushGroup(unaryOperator?: string) {
        this._state.termStack.push(this._termFactory.createGroup(this._state.currentTokenIndex, unaryOperator));
    }

    public popGroup(): InterpreterGroup {
        if (this._state.termStack.length == 1) {
            this.throwParseError('No groups left to pop');
        }
        return this._state.termStack.pop();
    }
    //#endregion
    public hasGroupToClose() {
        return (this._state.termStack.length > 1);
    }
    public resetCurrentParsingItem() {
        return this.getCurrentGroup().transientItem = {};
    }

    public getCurrentGroup() {
        return this._state.termStack[this._state.termStack.length - 1];
    }

    public getCurrentTransientItem() {
        return this.getCurrentGroup().transientItem;
    }

    public isGroupEmpty() {
        return this.getCurrentGroup().terms.length === 0;
    }

    public isTransientItemComplete(transientItem?: TransientParseItem) {
        return this.isItemFull(transientItem == null ? this.getCurrentTransientItem() : transientItem);
    }

    public isTransientItemEmpty() {
        return this.isItemUnset(this.getCurrentTransientItem());
    }

    private isItemFull(c: TransientParseItem) {
        return c.value != null;;
    }

    private isItemUnset(c: TransientParseItem) {
        return c.value == null;
    }
}
//#endregion

//#region Token Hanldlers

class StartGroupHander implements TokenHandler {
    constructor(
        private _stateManager: StateManager,
        private _startTokens: Set<string>,
        private _unaryFunctionTokens: Set<string>
    ) { }

    public handleToken(token: string): boolean {
        if (this._startTokens.has(token)) {
            // is a clause operator valid here
            if (this.isStartGroupValid()) {
                // either an operator or logical group here
                if (this._stateManager.isTransientItemComplete()) {
                    this._stateManager.pushGroup(this._stateManager.getCurrentTransientItem().value);
                } else {
                    this._stateManager.pushGroup();
                }
            } else {
                this._stateManager.throwParseError('Invalid item before group:' + this._stateManager.getCurrentTransientItem().value);
            }
            return true;
        }
        return false;
    }

    private isStartGroupValid() {
        const c = this._stateManager.getCurrentTransientItem();
        return c.value == null || this._unaryFunctionTokens.has(c.value?.trim());
    }
}

class EndGroupHandler implements TokenHandler {
    constructor(
        private _stateManager: StateManager,
        private _endTokens: Set<string>
    ) { }

    public handleToken(token: string): boolean {
        if (this._endTokens.has(token)) {
            const g = this._stateManager.getCurrentGroup();
            if (this.isEndGroupValid(g)) {
                // handle group 
                if (g.unaryOperator != null) {
                    this.handleOperationEndGroup();
                } else {
                    this.handleLogicalEndGroup();
                }
            } else {
                this._stateManager.throwParseError('cannot end group here');
            }
            return true;
        }
        return false;
    }

    private isEndGroupValid(c: InterpreterGroup) {
        // must be at least one group
        return this._stateManager.hasGroupToClose();
    }

    private handleOperationEndGroup() {
        // push any transient terms onto the group item list, and then add the group onto the previous item list
        if (this._stateManager.isTransientItemComplete()) {
            this._stateManager.addValueFromTransient();
        }
        const opGroup = this._stateManager.popGroup();
        delete opGroup.transientItem;
        delete opGroup.unaryOperator;
        this._stateManager.addUnaryOperation(opGroup);
    }

    private handleLogicalEndGroup() {
        // push any transient terms onto the group item list, and then add the group onto the previous item list
        if (this._stateManager.isTransientItemComplete()) {
            this._stateManager.addValueFromTransient();
        }
        this._stateManager.addGroupToParent();
    }

}

class OperatorHander implements TokenHandler {
    constructor(
        private _stateManager: StateManager,
        private _operators: Set<string>,
    ) { }

    public handleToken(token: string): boolean {
        if (this._operators.has(token)) {
            if (this.isOperatorValid()) {
                this._stateManager.addValueFromTransient();
                this._stateManager.addBinaryOperator(this._stateManager.currentIndex(), token);
            } else {
                this._stateManager.throwParseError('Operator ' + token + ' invalid here');
            }
            return true;
        }
        return false;
    }

    private isOperatorValid() {
        // can't be the first item in a group and can't follow another operator
        return !(this._stateManager.isGroupEmpty() && this._stateManager.isTransientItemEmpty());
    }

}

class ClauseOperandHandler implements TokenHandler {
    constructor(
        private _stateManager: StateManager
    ) { }

    public handleToken(token: string): boolean {
        if (this.isOperandValid()) {
            const t = this._stateManager.getCurrentTransientItem();
            t.tokenIndex = this._stateManager.currentIndex();
            t.value = token;
        } else {
            this._stateManager.throwParseError('Value ' + token + 'not allowed here ');
        }
        return true;
    }

    private isOperandValid() {
        return this._stateManager.isTransientItemEmpty();
    }

}
//#endregion