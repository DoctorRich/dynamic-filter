import { stringify } from 'json5';
import { TermTreeOperator, TermTreeNode, ReducedTermTreeNode } from './parseTypes';

export class TermReducer {
    private readonly operators: readonly string[];
    constructor(
        private readonly logicOperatorTokens: readonly string[],
        private readonly predicateOperatorTokens: readonly string[],
        private readonly binaryOperatorTokens: readonly string[],
    ) {
        this.operators = [
            ...binaryOperatorTokens,
            ...predicateOperatorTokens,
            ...logicOperatorTokens
        ];
    }

    public gatherAllTerms(inputTerm: TermTreeNode): ReducedTermTreeNode {
        // gather binary, then predicates, and finally logic terms
        return this.checkValidityAndPrune(inputTerm,
            this.logicOperatorTokens.reduce((term, o) => this.gatherTerms({ operator: o, operatorType: 'logic' }, term),
                this.predicateOperatorTokens.reduce((term, o) => this.gatherTerms({ operator: o, operatorType: 'predicate' }, term),
                    this.binaryOperatorTokens.reduce((term, o) => this.gatherTerms({ operator: o, operatorType: 'binary' }, term), inputTerm))))
            ;
    }

    private checkValidityAndPrune(input: TermTreeNode, t: TermTreeNode): ReducedTermTreeNode {
        // recursive validity test
        switch (t.type) {
            case 'group':
                throw new Error('Group remaining ' + t.terms.length + ' = ' + JSON.stringify(t));
                break;
            case 'unary':
                if (t.operands.length != 1) throw new Error();
                t.operands.forEach(i => this.checkValidityAndPrune(input, i));
                break;
            case "predicate":
                if (t.operands.length != 2) throw new Error();
                t.operands.forEach(i => this.checkValidityAndPrune(input, i));
                break;
            case "logic":
            case "binary":
                t.operands.forEach(i => this.checkValidityAndPrune(input, i));
                break;

        }
        // prune items
        delete t.rhsOperator;
        delete t.rhsOperatorIndex;
        delete t.tokenIndex;
        // return
        return t as ReducedTermTreeNode;
    }

    private gatherTerms(gatheringOperator: GatheringOperator, t: TermTreeNode): TermTreeNode {
        let term = t;
        switch (t.type) {
            case 'group':
                t.terms = this.gatherGroupTerms(gatheringOperator, t.terms);
                if (t.terms.length === 1) {
                    term = t.terms[0];
                    term.rhsOperator = t.rhsOperator;
                    term.rhsOperatorIndex = t.rhsOperatorIndex;
                }
                break;
            case 'unary':
            case 'predicate':
            case 'binary':
            case 'logic':
                t.operands = this.gatherGroupTerms(gatheringOperator, t.operands);
                break;
        }
        return term;
    }

    private gatherGroupTerms(gatheringOperator: GatheringOperator, terms: readonly TermTreeNode[]): TermTreeNode[] {
        // do nothing if empty
        if (terms == null || terms.length === 0) {
            return [];
        }
        // create state and gather terms
        const state = new GatherState();
        terms.forEach((t, i) => {
            // keep track if this is the last item
            const lastItem = i === terms.length - 1;

            // gather children first
            const term = this.gatherTerms(gatheringOperator, t);

            // then handle this term
            if (lastItem) {
                this.handleFinalTerm(state, term, gatheringOperator);
            } else {
                this.handleNonFinalTerm(state, term, gatheringOperator);
            }
        });
        return state.outputTerms;
    }



    private handleFinalTerm(state: GatherState, term: TermTreeNode, gatherOperator: GatheringOperator) {
        // This is the final term in the group (and thus should have no following operator)
        if (state.isGroupOpen()) {
            // add to the current group and create 
            state.addCurrent(term);
            this.createGatheredTermsAndAddToOutput(state, gatherOperator, null);
        }
        else {
            state.addOutput(term);
        }
    }
    private handleNonFinalTerm(state: GatherState, term: TermTreeNode, gatherOperator: GatheringOperator) {
        // test if these items match
        if (term.rhsOperator === gatherOperator.operator) {
            state.addCurrent(term);
        }
        else {
            this.handleNonMatchTerm(state, term, gatherOperator);
        }
    }
    private handleNonMatchTerm(state: GatherState, term: TermTreeNode, gatherOperator: GatheringOperator) {
        // this is a non-match term
        //state.isCompleteMatch = false;
        if (state.isGroupOpen()) {
            // in the middle of grouping, and came across different operator, so close grouping
            // this will be the last term in this new group, so blank the following operator for this last term, and pass the terms operator to the group
            const rhsOperator = term.rhsOperator;
            if (rhsOperator == null) {
                throw new Error('RHS operator missing: ' + JSON.stringify(term));
            }
            delete term.rhsOperator;
            delete term.rhsOperatorIndex;
            state.addCurrent(term);
            // create new terms
            this.createGatheredTermsAndAddToOutput(state, gatherOperator, rhsOperator);
        }
        else {
            // just add this term to the outputs
            state.addOutput(term);
        }
    }

    private createGatheredTermsAndAddToOutput(state: GatherState, gatherOperator: GatheringOperator, rhsOperator: string) {
        const currentGroup = state.getAndResetCurrent();
        const newOperator: TermTreeOperator =
        {
            tokenIndex: currentGroup?.[0].tokenIndex,
            type: gatherOperator.operatorType,
            operator: gatherOperator.operator,
            operands: currentGroup,
            rhsOperator
        };
        state.addOutput(newOperator);
    }
}

interface GatheringOperator {
    operatorType: 'logic' | 'predicate' | 'unary' | 'binary';
    operator: string;
}

class GatherState {
    private currentTerms: TermTreeNode[];
    private _outputTerms: TermTreeNode[] = [];
    private isCompleteMatch: boolean = true;

    public isGroupOpen() {
        return this.currentTerms != null;
    }

    public addCurrent(t: TermTreeNode) {
        if (!this.isGroupOpen()) {
            this.currentTerms = [];
        }
        this.currentTerms.push(t);
    }

    public addOutput(t: TermTreeNode) {
        this._outputTerms.push(t);
    }

    public getAndResetCurrent() {
        const terms = this.currentTerms;
        this.currentTerms = null;
        return terms;
    }

    /**
     * Getter outputTerms
     * @return {TermTreeNode[] }
     */
    public get outputTerms(): TermTreeNode[] {
        return this._outputTerms;
    }
}
