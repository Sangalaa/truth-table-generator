const { str, choice, between, letters, recursiveParser, sequenceOf, many, many1, pipeParsers, mapTo } = require('arcsecond');

const binaryOperatorParser = choice([
    str('&&'),
    str('||'),
    str('=>'),
    str('<=>'),
    str('^'),
]);

const unaryOperatorParser = str('~');

const betweenBrackets = between (str('(')) (str(')'));

const letterParser = pipeParsers([
    letters,
    mapTo((result) => ({
        type: 'letter',
        value: result
    }))
]);

const expr = recursiveParser(() => choice([
    letterParser,
    binaryOperationParser,
    unaryOperationParser,
]));

const unaryOperationParser = pipeParsers([
    choice([
        sequenceOf([unaryOperatorParser, expr]),
        many(betweenBrackets(expr))
    ]),
    mapTo((results) => {
        results = results.flat(1);

        const resultsLength = results.length;
    
        if(resultsLength === 0) return results;
        if(resultsLength === 1) return results[0];
    
        const currentOperator = results[0];
        if(results[1].type === 'operation' && results[1].value.op === currentOperator) {
            return results[1].value.a;
        }
        else return {
            type: 'operation',
            value: {
                op: results[0],
                a: results[1]
            }
        };
    })
]);

const binaryOperationParser = pipeParsers([
    betweenBrackets(
        sequenceOf([
            many(str(' ')),
            expr,
            many1(str(' ')),
            binaryOperatorParser,
            many1(str(' ')),
            expr,
            many(str(' '))
        ])),
    mapTo((results) => ({
            type: 'operation',
            value: {
                a: results[1],
                op: results[3],
                b: results[5]
            }
        })
    )
]);

module.exports = {expr};