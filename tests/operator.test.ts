import * as Logic from "../src/defaults/logicOperations";
import * as Unary from "../src/defaults/unaryOperations";
import * as Binary from "../src/defaults/binaryOperations";
import * as Predicate from "../src/defaults/predicateOperations";
import * as Runtime from "../src/defaults/runtimeValues";
import { DateTime, Duration } from "luxon";

describe('Operator', () => {

    describe('Logical Operations', () => {

        test(Logic.AND_TOKEN, async () => {
            // arrange
            const op = Logic.AND_OPERATOR
            // act
            const falseResult = op({ value: true }, [_ => true, o => o.value, o => !o.value]);
            const trueResult = op({ value: true }, [_ => true, o => o.value, _ => true]);
            // assert
            expect(falseResult).toEqual(false);
            expect(trueResult).toEqual(true);
        });

        test(Logic.OR_TOKEN, async () => {
            // arrange
            const op = Logic.OR_OPERATOR
            // act
            const falseResult = op({ value: true }, [_ => false, o => !o.value]);
            const trueResult = op({ value: true }, [_ => false, o => o.value, o => !o.value]);
            // assert
            expect(falseResult).toEqual(false);
            expect(trueResult).toEqual(true);
        });

        test(Logic.XOR_TOKEN, async () => {
            // arrange
            const op = Logic.XOR_OPERATOR
            // act
            const falseResultNone = op({ value: true }, [_ => false, o => !o.value]);
            const falseResultMany = op({ value: true }, [_ => false, o => o.value, _ => true, o => !o.value]);
            const trueResult = op({ value: true }, [_ => false, o => o.value, o => !o.value]);
            // assert
            expect(falseResultNone).toEqual(false);
            expect(falseResultMany).toEqual(false);
            expect(trueResult).toEqual(true);
        });

    });

    describe('Binary Predicates', () => {

        test(Predicate.EQ_TOKEN, async () => {
            // arrange
            const op = Predicate.DEEP_EQUALS_PREDICATE
            // act
            const neqNull = op(null, "match");
            const eqNull = op(null, null);
            const eqUndef = op(undefined, undefined);
            const ceqNull = op(null, undefined);
            const neqNumber = op(5, 6);
            const neqString = op('true', 'false');
            const ceqNumbers = op(5, "5");
            const ceqBoolean = op(true, 1);
            const eqNumbers = op(5, 5);
            const eqStrings = op("match", "match");
            const eqObj = op({ a: 'A' }, { a: 'A' });
            const neqObj = op({ a: 'A' }, { a: 'B' });
            // assert
            expect(neqNull).toEqual(false);
            expect(neqNumber).toEqual(false);
            expect(neqString).toEqual(false);
            expect(ceqNumbers).toEqual(false);
            expect(ceqBoolean).toEqual(false);
            expect(ceqNull).toEqual(false);
            expect(eqNull).toEqual(true);
            expect(eqUndef).toEqual(true);
            expect(eqNumbers).toEqual(true);
            expect(eqStrings).toEqual(true);
            expect(eqObj).toEqual(true);
            expect(neqObj).toEqual(false);
        });

        test(Predicate.NEQ_TOKEN, async () => {
            // arrange
            const op = Predicate.STRICT_NOT_EQUALS_PREDICATE;
            // act
            const neqNull = op(null, "match");
            const eqNull = op(null, null);
            const eqUndef = op(undefined, undefined);
            const ceqNull = op(null, undefined);
            const neqNumber = op(5, 6);
            const neqString = op('true', 'false');
            const ceqNumbers = op(5, "5");
            const ceqBoolean = op(true, 1);
            const eqNumbers = op(5, 5);
            const eqStrings = op("match", "match");
            // assert
            expect(neqNull).toEqual(true);
            expect(ceqNull).toEqual(true);
            expect(neqNumber).toEqual(true);
            expect(neqString).toEqual(true);
            expect(ceqNumbers).toEqual(true);
            expect(ceqBoolean).toEqual(true);
            expect(eqNull).toEqual(false);
            expect(eqUndef).toEqual(false);
            expect(eqNumbers).toEqual(false);
            expect(eqStrings).toEqual(false);
        });

        test(Predicate.CEQ_TOKEN, async () => {
            // arrange
            const op = Predicate.COERCIVE_EQUALS_PREDICATE
            // act
            const neqNull = op(null, "match");
            const eqNull = op(null, null);
            const eqUndef = op(undefined, undefined);
            const ceqNull = op(null, undefined);
            const neqNumber = op(5, 6);
            const neqString = op('true', 'false');
            const ceqNumbers = op(5, "5");
            const ceqBoolean = op(true, 1);
            const eqNumbers = op(5, 5);
            const eqStrings = op("match", "match");
            // assert
            expect(neqNumber).toEqual(false);
            expect(neqString).toEqual(false);
            expect(neqNull).toEqual(false);
            expect(ceqNull).toEqual(true);
            expect(eqNull).toEqual(true);
            expect(eqUndef).toEqual(true);
            expect(ceqNumbers).toEqual(true);
            expect(ceqBoolean).toEqual(true);
            expect(eqNumbers).toEqual(true);
            expect(eqStrings).toEqual(true);
        });

    });

    describe('Unary Operations', () => {

        test(Unary.UPPER_TOKEN, async () => {
            // arrange
            const op = Unary.UPPER_CASE_OPERATION
            // act
            const upperUndef = op(undefined);
            const upperNull = op(null);
            const upperString = op("test");
            const upperStringObject = op(new String("testobject"));
            const upperNumber = op(5);
            // assert
            expect(upperUndef).toEqual(undefined);
            expect(upperNull).toEqual(null);
            expect(upperNumber).toEqual(5);
            expect(upperString).toEqual("TEST");
            expect(upperStringObject).toEqual("TESTOBJECT");
        });
    });

    describe('Binary Operations', () => {

        test(Binary.ADD_TOKEN, async () => {
            // arrange
            const op = Binary.ADD_OPERATION
            // act
            const addNumber = op(5, 6);
            const addNumberString = op(5, '6');
            const addNumberBoolean = op(5, true);
            const addNonNumberString = op(5, 'six');
            const addNumberNull = op(5, null);
            const addDateTime = op(DateTime.utc(2017, 4, 30), Duration.fromObject({ months: 1, days: 1 }));
            const addDateTimeReverse = op(Duration.fromObject({ months: 1, days: 1 }), DateTime.utc(2017, 4, 30));
            const addDateTimeNull = op(DateTime.utc(2017, 4, 30), null);
            // assert
            expect(addNumber).toEqual(11);
            expect(addNumberString).toEqual('56');
            expect(addNumberBoolean).toEqual(6);
            expect(addNonNumberString).toEqual('5six');
            expect(addNumberNull).toEqual(5);
            expect(DateTime.isDateTime(addDateTime)).toBeTruthy();
            expect(addDateTime).toEqual(DateTime.utc(2017, 5, 31));
            expect(DateTime.isDateTime(addDateTimeReverse)).toBeTruthy();
            expect(addDateTimeReverse).toEqual(DateTime.utc(2017, 5, 31));
            expect(addDateTimeNull).toEqual(DateTime.utc(2017, 4, 30));
        });

        test(Binary.MINUS_TOKEN, async () => {
            // arrange
            const op = Binary.MINUS_OPERATION;
            // act
            const minusNumber = op(5, 6);
            const minusNumberString = op(5, '6');
            const minusNumberBoolean = op(5, true);
            const minusNonNumberString = op(5, 'six');
            const minusDateTime = op(DateTime.utc(2017, 3, 1), Duration.fromObject({ months: 1, days: 1 }));
            const minusDateTimeNull = op(DateTime.utc(2017, 4, 30), null);
            // assert
            expect(minusNumber).toEqual(-1);
            expect(minusNumberString).toEqual(-1);
            expect(minusNumberBoolean).toEqual(4);
            expect(minusNonNumberString).toBe(NaN);
            expect(minusDateTime).toEqual(DateTime.utc(2017, 1, 31));
            expect(minusDateTimeNull).toEqual(DateTime.utc(2017, 4, 30));
        });

    });

    describe('Runtime Value Getters', () => {

        test(Runtime.NOW_TOKEN, async () => {
            // arrange
            const op = Runtime.NOW_RUNTIME_GETTER;
            // act
            const value = op() as DateTime;
            // assert
            expect(DateTime.isDateTime(value)).toBeTruthy();
            expect(value.hour === 0 && value.minute === 0 && value.second === 0 && value.millisecond === 0).toBeFalsy();
        });

        test(Runtime.TODAY_TOKEN, async () => {
            // arrange
            const op = Runtime.TODAY_RUNTIME_GETTER;
            // act
            const value = op() as DateTime;
            // assert
            expect(DateTime.isDateTime(value)).toBeTruthy();
            expect(value.hour === 0 && value.minute === 0 && value.second === 0 && value.millisecond === 0).toBeTruthy();
        });

    });

});