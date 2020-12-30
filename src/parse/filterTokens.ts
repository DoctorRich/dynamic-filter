export interface FilterTokens {
    readonly predicateOperatorTokens: readonly string[];
    readonly logicOperatorTokens: readonly string[];
    readonly unaryOperatorTokens: readonly string[];
    readonly binaryOperatorTokens: readonly string[];
    readonly groupStartTokens: readonly string[];
    readonly groupEndTokens: readonly string[];
}