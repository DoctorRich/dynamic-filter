# dynamic-filter
Code for creating serializable dynamic filters


## Default parser and factory

A number of operations work out of the box with the default parser and filter factory
* Logic tokens - AND, OR, XOR (& | ^)
* Predicate comparisons - =, !=, <, >
* Arithmetic operations - +. -, *, /
* Unary functions - TRIM, UPPER, LOWER, DATETIME, DURATION 
* Runtime date time values - @TODAY, @NOW

```js
// create default filter parser and factory
const filterParser = createDefaultFilterParser();
const filterFactory = createDefaultFilterFactory();

// items to filter
const items = [
    { id: 1, objectNum: 4, objectDate: DateTime.local(2016, 7, 13) },
    { id: 2, objectNum: 6 },
    { id: 3, objectNum: 2, objectDate: DateTime.local(2016, 8, 20) },
    { id: 4, objectNum: 2, objectDate: DateTime.local(2016, 7, 13) }
];

// filter context object
const context = {
    contextNum: 5
};

// filter string
const filterString = '[objectNum] = {contextNum} + 1 | [objectDate] > (@TODAY - DURATION(P1D)) ';
// parse and create filter predicate
const filterDefinition = filterParser.parse(filterString);
const filterPredicate = filterFactory.create(filterDefinition, context);
// filter results
const result = items.filter(filterPredicate);
```
