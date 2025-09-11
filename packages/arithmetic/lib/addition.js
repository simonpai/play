import { trimObj } from '@axiom/commons';
import { OPERATOR } from './constants.js';
import { chooseOperandsByOperandRange, hash as _hash, express } from './utils.js';

export function resolveAdditionChallengeOptions(options) {
  return normalizeOptions(validateOptions(options));
}

function normalizeOptions({
  level = 2,
  operandCount = 2,
  ...options
} = {}) {
  const operandMax = Math.floor((2 ** level) * 10);
  const operandMin = Math.floor(operandMax / 10);

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

export function generateAdditionChallenge({ index, total, prng }, options) {
  options = resolveAdditionChallengeOptions(options);
  const operator = OPERATOR.ADDITION;
  const operands = chooseOperandsByOperandRange(prng, options);
  const answer = computeAdditionAnswer(operands);
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

function computeAdditionAnswer(operands) {
  return operands.reduce((sum, x) => sum + x, 0);
}
