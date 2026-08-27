import { prng as _prng, random } from '@axiom/prng';
import { CHALLENGE_TOPIC } from './constants.js';
import { generateAdditionChallenge, resolveAdditionChallengeOptions } from './addition.js';
import { generateMultiplicationChallenge, resolveMultiplicationChallengeOptions } from './multiplication.js';

export function resolveChallengeOptions(...optionsList) {
  const options = mergeChallengeOptions(...optionsList);
  const { topic } = options;
  if (!topic) {
    throw new Error('Challenge topic is required');
  }
  switch (topic) {
    case CHALLENGE_TOPIC.ADDITION:
      return resolveAdditionChallengeOptions(options);
    case CHALLENGE_TOPIC.MULTIPLICATION:
      return resolveMultiplicationChallengeOptions(options);
    default:
      throw new Error(`Unrecognized challenge topic: ${topic}`);
  }
}

// consecutive duplicate draws before we consider the problem pool exhausted
const MAX_DEDUPLICATE_ATTEMPTS = 100;

export function generateChallenges(context, ...optionsList) {
  context = normalizeChallengeContext(context);
  const { count = 1, deduplicate = false, ...options } = resolveChallengeOptions(...optionsList);

  const challenges = [];
  let hashes = new Set();
  let attempts = 0;
  while (challenges.length < count) {
    const challenge = generateChallenge({ ...context, total: count, index: challenges.length }, options);
    // deduplicate as much as possible: once all problems are seen, start a new round
    if (deduplicate && hashes.has(challenge.hash)) {
      if (++attempts < MAX_DEDUPLICATE_ATTEMPTS) {
        continue;
      }
      hashes = new Set();
    }
    challenges.push(challenge);
    hashes.add(challenge.hash);
    attempts = 0;
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
  const { topic } = options;
  switch (topic) {
    case CHALLENGE_TOPIC.ADDITION:
      return generateAdditionChallenge(context, options);
    case CHALLENGE_TOPIC.MULTIPLICATION:
      return generateMultiplicationChallenge(context, options);
    default:
      throw new Error(`Unrecognized challenge topic: ${topic}`);
  }
}
