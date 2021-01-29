const { expr } = require('./parser');

const getNumberOfUniqueLetters = (node, letters = []) => {
    if(!node) return letters;
    if(node.type === 'letter') {
        if(letters.indexOf(node.value) === -1) letters.push(node.value);
    }
    else {
        getNumberOfUniqueLetters(node.value.a, letters);
        getNumberOfUniqueLetters(node.value.b, letters);
    }

    return letters;
};

const evaluate = (node, inputMap) => {
    const pushToMap = (key, value) => {
        if(!(key in inputMap)) {
            inputMap[key] = value;
        }
    };

    if(node.type === 'letter') return node.value;

    if(node.type === 'operation') {
        let operationResult;
        let processedExpression;

        if(node.value.op === '~') {
            const operand = evaluate(node.value.a, inputMap);
            operationResult = inputMap[operand] === 1 ? 0 : 1;
            processedExpression = `~${operand}`;
        }
        else {
            const leftOperand = evaluate(node.value.a, inputMap);
            const rightOperand = evaluate(node.value.b, inputMap);

            switch(node.value.op) {
                case '&&': {
                    operationResult = inputMap[leftOperand] && inputMap[rightOperand];
                    processedExpression = `(${leftOperand} && ${rightOperand})`;
                    break;
                }
                case '||': {
                    operationResult = inputMap[leftOperand] || inputMap[rightOperand];
                    processedExpression = `(${leftOperand} || ${rightOperand})`;
                    break;
                }

                case '^': {
                    operationResult = inputMap[leftOperand] ^ inputMap[rightOperand];
                    processedExpression = `(${leftOperand} ^ ${rightOperand})`;
                    break;
                }

                case '=>': {
                    operationResult = inputMap[leftOperand] === 1 && inputMap[rightOperand] === 0 ? 0 : 1;
                    processedExpression = `(${leftOperand} => ${rightOperand})`;
                    break;
                }

                case '<=>': {
                    operationResult = inputMap[leftOperand] === inputMap[rightOperand] ? 1 : 0;
                    processedExpression = `(${leftOperand} <=> ${rightOperand})`;
                    break;
                }
                default: {
                    throw new Error(`Interpreter: Unsupported operation type ${node.value.op}`);
                }
            }
        }

        pushToMap(processedExpression, operationResult);
        return processedExpression;
    }
    else throw new Error(`Interpreter: Unsupported type ${node.type}`);
};

const constructInputs = (letters, index = 0, current = {}, results = []) => {
    if(index === letters.length) {
        results.push({...current});
        return results;
    }

    for(let i = 0; i < 2; i ++) {
        current[letters[index]] = i;
        constructInputs(letters, index + 1, current, results);
    }

    return results;
};

const interpret = program => {
    const parsedProgram = expr.run(program);

    if(parsedProgram.isError) throw new Error("Interpreter: Invalid program");

    const letters = getNumberOfUniqueLetters(parsedProgram.result);
    letters.sort();

    const inputs = constructInputs(letters);

    const result = {};

    inputs.forEach((input) => {
        evaluate(parsedProgram.result, input);

        Object.keys(input).forEach((key) => {
            if(!(key in result)) result[key] = [input[key]];
            else result[key].push(input[key]);
        });
    });

    return result;
};

module.exports = interpret;