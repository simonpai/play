import { prng as _prng, random } from '@axiom/prng';
import { CHALLENGE_TYPE } from './constants.js';
import { generateAdditionChallenge, resolveAdditionChallengeOptions } from './addition.js';
import { generateMultiplicationChallenge, resolveMultiplicationChallengeOptions } from './multiplication.js';

export function resolveChallengeOptions(...optionsList) {
  const options = mergeChallengeOptions(...optionsList);
  const { type } = options;
  if (!type) {
    throw new Error('Challenge type is required');
  }
  switch (type) {
    case CHALLENGE_TYPE.ADDITION:
      return resolveAdditionChallengeOptions(options);
    case CHALLENGE_TYPE.MULTIPLICATION:
      return resolveMultiplicationChallengeOptions(options);
    default:
      throw new Error(`Unrecognized challenge type: ${type}`);
  }
}

export function generateChallenges(context, ...optionsList) {
  context = normalizeChallengeContext(context);
  const { count = 1, deduplicate = true, ...options } = resolveChallengeOptions(...optionsList);

  const challenges = [];
  const hashes = new Set();
  while (challenges.length < count) {
    const challenge = generateChallenge({ ...context, total: count, index: challenges.length }, options);
    // deduplicate
    if (!deduplicate || !hashes.has(challenge.hash)) {
      challenges.push(challenge);
      hashes.add(challenge.hash);
    }
  }
  return challenges;
}

function normalizeChallengeContext({
  prng = _prng(random),
} = {}) {
  return {
    prng,
  };
}

function mergeChallengeOptions(...optionsList) {
  return optionsList.reduce((options, override) => ({
    ...options,
    ...override,
  }), {});
}

function generateChallenge(context, options) {
  const { type } = options;
  switch (type) {
    case CHALLENGE_TYPE.ADDITION:
      return generateAdditionChallenge(context, options);
    case CHALLENGE_TYPE.MULTIPLICATION:
      return generateMultiplicationChallenge(context, options);
    default:
      throw new Error(`Unrecognized challenge type: ${type}`);
  }
}
