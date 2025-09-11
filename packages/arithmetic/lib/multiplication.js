import { trimObj } from '@axiom/commons';
import { OPERATOR } from './constants.js';
import { chooseOperandsByOperandRange, hash as _hash, express } from './utils.js';

export function resolveMultiplicationChallengeOptions(options) {
  return normalizeOptions(validateOptions(options));
}

function normalizeOptions({
  level = 2,
  operandCount = 2,
  ...options
} = {}) {
  const operandMax = Math.floor(level * 10 - 1);
  const operandMin = Math.max(2, Math.floor(operandMax / 10));

  return Object.freeze(trimObj({
    level,
    operandMin,
    operandMax,
    operandCount,
    ...options,
  }));
}

function validateOptions(options = {}) {
  const { level, operandCount } = options;
  if (level !== undefined && (typeof level !== 'number' || level < 0)) {
    throw new Error(`level (${level}) must be at least 0`);
  }
  if (operandCount !== undefined && (!Number.isInteger(operandCount) || operandCount < 2)) {
    throw new Error(`operandCount (${operandCount}) must be an integer at least 2`);
  }
  return options;
}

export function generateMultiplicationChallenge({ index, total, prng }, options) {
  options = resolveMultiplicationChallengeOptions(options);
  const operator = OPERATOR.MULTIPLICATION;
  const operands = chooseOperandsByOperandRange(prng, options);
  const answer = computeMultiplicationAnswer(operands);
  return trimObj({
    index,
    total,
    operator,
    operands,
    answer,
    expression: express({ operator, operands }),
    hash: _hash({ operator, operands }),
  });
}

function computeMultiplicationAnswer(operands) {
  return operands.reduce((product, x) => product * x, 1);
}
