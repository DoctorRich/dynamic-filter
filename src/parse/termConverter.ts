import { InterpreterGroup, TermNodeGroup } from "./parseTypes";

function assertUnreachable(x: never): never {
    throw new Error("Didn't expect to get here");
}
/**
 * Converts the interpreted terms into filter clause definitions
 */
export class TermConverter {

    public convertGroup(t: InterpreterGroup): TermNodeGroup {
        // convert terms
        const terms = t.terms.reduce((m, o) => {
            //            const converted = this.convertFilterTerm(o, m.length === 0 ? null : m[m.length - 1]);
            // if (converted != null) {
            //     m.push(converted);
            //            }
            return m;
        }, []);
        // return the group
        return {
            type: 'group',
            tokenIndex: t.tokenIndex,
            terms
        };
    }

    // private parseError(t: FilterTerm) {
    //     throw new Error('NO previous item:' + JSON.stringify(t));
    // }
    // private convertValue(t: ValueTerm): TermTreeValue {
    //     return {
    //         type: 'value',
    //         tokenIndex: t.tokenIndex,
    //         value: t.value
    //     };
    // }
    // private convertUnaryOp(t: UnaryOperatorTerm): TermTreeOperator {
    //     return {
    //         type: 'operator',
    //         tokenIndex: t.tokenIndex,
    //         operatorType: 'unary',
    //         operator: t.operator,
    //         operands: this.convertGroup(t.operand).terms
    //     };
    // }
    // private convertFilterTerm(t: FilterTerm, previous: TermTreeNode): TermTreeNode {
    //     switch (t.type) {
    //         case "value":
    //             return this.convertValue(t);
    //         case "operator":
    //             return this.convertUnaryOp(t);
    //         case "group":
    //             return this.convertGroup(t);
    //     }
    //     return assertUnreachable(t);
    // }
}
