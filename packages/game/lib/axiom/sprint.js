import { resolveChallengeOptions } from '@simonpai.play/arithmetic';
import { axiom } from './axiom.js';

export function sprint(options = {}) {
  options = normalizeOptions(options);
  const { challenges: challengeOptions } = options;

  return axiom({
    name: 'sprint',
    options,
  }, async function* ({ player, challenges, createEvent }) {

    // generate challenges
    yield createEvent('challenges.options', { options: challengeOptions });
    const challengeList = await challenges.generate(challengeOptions);
    yield createEvent('challenges.generate', { challenges: challengeList });

    // start
    yield createEvent('start');

    // solve challenges
    const results = [];
    for (const challenge of challengeList) {
      yield createEvent('challenges.show', { challenge });

      // wait for user's answer
      const { answer: playerAnswer, duration } = await player.solve(challenge);
      yield createEvent('player.solve', { challenge, playerAnswer, duration });

      // check the answer
      const correct = challenges.verify(challenge, playerAnswer);

      const result = Object.freeze({ challenge, playerAnswer, duration, correct });
      results.push(result);
      yield createEvent('challenges.result', { result });
    }

    // end
    yield createEvent('end', { results });

    return {
      challengeOptions,
      results,
    };
  });
}

function normalizeOptions({ challenges, ...options } = {}) {
  return Object.freeze({
    challenges: resolveChallengeOptions(challenges),
    ...options,
  });
}
