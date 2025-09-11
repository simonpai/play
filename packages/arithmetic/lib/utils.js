export function chooseOperandsByOperandRange(prng, { operandCount, operandMin, operandMax }) {
  const operands = [];
  for (let i = 0; i < operandCount; i++) {
    operands.push(prng.nextInt(operandMin, operandMax));
  }
  return operands;
}

export function hash({ operator, operands }) {
  return `${operator}[${operands.join(',')}]`;
}

export function express({ operator, operands }) {
  return operands.join(` ${operatorMathSymbol(operator)} `);
}

export function operatorMathSymbol(operator) {
  switch (operator) {
    case '*':
      return '×';
    case '/':
      return '÷';
    default:
      return operator;
  }
}
