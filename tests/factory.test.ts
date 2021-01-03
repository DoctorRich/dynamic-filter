import { DateTime } from 'luxon';
import { createDefaultFilterFactory } from "../src/defaults/defaultFilterFactory";
import { createDefaultFilterParser } from "../src/defaults/defaultFilterParser";
import { binaryClause, binaryOp, contextProperty, groupClause, property, runtimeValue, value } from '../src/definition/definitionCreators';
import * as Runtime from '../src/defaults/runtimeValues';
import * as Binary from "../src/defaults/binaryOperations";
import * as Logic from "../src/defaults/logicOperations";
import * as Predicate from "../src/defaults/predicateOperations";

describe('Filter Factory', () => {

    describe('Filter Builder', () => {

        const items = [
            { id: 1, propA: 'no match 1', objectPropNum: 4 },
            { id: 2, propA: 'match 1' },
            { id: 3, propA: 'no match 2', objectPropNum: 2 },
            { id: 4, propA: 'match 2' }
        ];
        const context = { propB: 'match 1', contextPropNum: 3 };

        test('Single clause: property = context property', async () => {
            // arrange
            const filterFactory = createDefaultFilterFactory();
            // act
            const filterDefinition = binaryClause(property('propA'), Predicate.EQ_TOKEN, contextProperty('propB'));
            const result = items.filter(filterFactory.create(filterDefinition, context));
            // assert
            const expectedItemIds = new Set([2])
            expect(result).toEqual(items.filter(i => expectedItemIds.has(i.id)));
        });

        test('Single clause: property != context property', async () => {
            // arrange
            const filterFactory = createDefaultFilterFactory();
            // act
            const filterDefinition = binaryClause(property('propA'), Predicate.NEQ_TOKEN, contextProperty('propB'));
            const result = items.filter(filterFactory.create(filterDefinition, context));
            // assert
            const expectedItemIds = new Set([1, 3, 4])
            expect(result).toEqual(items.filter(i => expectedItemIds.has(i.id)));
        });

        test('Group clause: property = context + values', async () => {
            // arrange
            const filterFactory = createDefaultFilterFactory();
            // act
            const filterDefinition = binaryClause(
                property('objectPropNum'),
                Predicate.EQ_TOKEN,
                binaryOp(Binary.ADD_TOKEN, contextProperty('contextPropNum'), value(0.2), value(0.2), value(0.6))
            );
            const result = items.filter(filterFactory.create(filterDefinition, context));
            // assert
            const expectedItemIds = new Set([1])
            expect(result).toEqual(items.filter(i => expectedItemIds.has(i.id)));
        });

        test('Group clause: property = context - value', async () => {
            // arrange
            const filterFactory = createDefaultFilterFactory();
            // act
            const filterDefinition = binaryClause(
                property('objectPropNum'),
                Predicate.EQ_TOKEN,
                binaryOp(Binary.MINUS_TOKEN, contextProperty('contextPropNum'), value(1))
            );
            const result = items.filter(filterFactory.create(filterDefinition, context));
            // assert
            const expectedItemIds = new Set([3])
            expect(result).toEqual(items.filter(i => expectedItemIds.has(i.id)));
        });

        test('Group clause: property = context property or value', async () => {
            // arrange
            const filterFactory = createDefaultFilterFactory();
            // act
            const filterDefinition = groupClause(Logic.OR_TOKEN,
                binaryClause(property('propA'), Predicate.EQ_TOKEN, contextProperty('propB')),
                binaryClause(property('propA'), Predicate.EQ_TOKEN, value('match 2')));
            const result = items.filter(filterFactory.create(filterDefinition, context));
            // assert
            const expectedItemIds = new Set([2, 4])
            expect(result).toEqual(items.filter(i => expectedItemIds.has(i.id)));
        });

        test('Date clause: prop < TODAY', async () => {
            // arrange
            const filterFactory = createDefaultFilterFactory();
            const items = [
                { id: 1, dateProp: DateTime.local().plus({ days: 1 }) },
                { id: 2, dateProp: DateTime.local().minus({ days: 1 }) }
            ];
            // act
            const filterDefinition = binaryClause(property('dateProp'), Predicate.LT_TOKEN, runtimeValue(Runtime.TODAY_TOKEN));
            const result = items.filter(filterFactory.create(filterDefinition, context));
            // assert
            const expectedItemIds = new Set([2])
            expect(result).toEqual(items.filter(i => expectedItemIds.has(i.id)));
        });

        test('Date clause: prop > TODAY - 1', async () => {
            // arrange
            const filterFactory = createDefaultFilterFactory();
            const items = [
                { id: 1, dateProp: DateTime.local().minus({ days: 3 }) },
                { id: 2, dateProp: DateTime.local().minus({ hours: 6 }) }
            ];
            // act
            const filterDefinition = binaryClause(property('dateProp'), Predicate.GT_TOKEN,
                binaryOp(Binary.MINUS_TOKEN, runtimeValue(Runtime.TODAY_TOKEN), value({ day: 1 })));
            const result = items.filter(filterFactory.create(filterDefinition, context));
            // assert
            const expectedItemIds = new Set([2])
            expect(result).toEqual(items.filter(i => expectedItemIds.has(i.id)));
        });

        test('Less than', async () => {
            // arrange
            const filterFactory = createDefaultFilterFactory();
            // act
            const filterDefinition = binaryClause(property('objectPropNum'), Predicate.LT_TOKEN, contextProperty('contextPropNum'));
            const result = items.filter(filterFactory.create(filterDefinition, context));
            // assert
            const expectedItemIds = new Set([3]);
            expect(result).toEqual(items.filter(i => expectedItemIds.has(i.id)));
        });

    });


    describe('Parser and Filter Builder', () => {

        const items = [
            { id: 1, propA: 'no match 1', objectPropNum: 4, objectDate: DateTime.local().minus({ days: 3 }) },
            { id: 2, propA: 'match 1' },
            { id: 3, propA: 'match3', objectPropNum: 2, objectDate: DateTime.local().minus({ days: 4 }) },
            { id: 4, propA: 'match 2', objectPropNum: 2, objectDate: DateTime.local() }
        ];
        const context = { propB: 'match 1', contextPropNum: 3 };
        const filterFactory = createDefaultFilterFactory();
        const filterParser = createDefaultFilterParser();

        test('Single clause: property = context property', async () => {
            // arrange
            const filterString = '[propA] = {propB}';
            // act
            const filterDefinition = filterParser.parse(filterString);
            const result = items.filter(filterFactory.create(filterDefinition, context));
            // assert
            const expectedItemIds = new Set([2])
            expect(result).toEqual(items.filter(i => expectedItemIds.has(i.id)));
        });

        test('Or clause with numeric calculation', async () => {
            // arrange
            const filterString = '[propA] = {propB} | ([propA] = match3 & [objectPropNum] = {contextPropNum} - 1 -1 + 1)';
            // act
            const filterDefinition = filterParser.parse(filterString);
            const result = items.filter(filterFactory.create(filterDefinition, context));
            // assert
            const expectedItemIds = new Set([2, 3])
            expect(result).toEqual(items.filter(i => expectedItemIds.has(i.id)));
        });

        test('Date function calculation', async () => {
            // arrange
            const filterString = '[propA] = {propB} | [objectDate] > (@TODAY - DURATION(P1D)) ';
            // act
            const filterDefinition = filterParser.parse(filterString);
            const result = items.filter(filterFactory.create(filterDefinition, context));
            // assert
            const expectedItemIds = new Set([2, 4])
            expect(result).toEqual(items.filter(i => expectedItemIds.has(i.id)));
        });

    });

});
