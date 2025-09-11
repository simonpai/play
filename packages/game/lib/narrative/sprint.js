import { resolveChallengeOptions } from '@simonpai.play/arithmetic';

export function sprint(options = {}) {
  options = normalizeOptions(options);
  const { challenges: challengeOptions } = options;

  return [{
    name: 'sprint',
    options,
  }, async function* (context) {
    const { player, challenges } = context;

    // generate challenges
    yield event('challenges', 'options', { options: challengeOptions });
    const challengeList = await challenges.generate(challengeOptions);
    yield event('challenges', 'generate', { challenges: challengeList });

    // start
    yield event('narrative', 'start');

    // solve challenges
    const results = [];
    for (const challenge of challengeList) {
      yield event('challenges', 'show', { challenge });

      // wait for user's answer
      const { answer: playerAnswer, duration } = await player.solve(challenge);
      yield event('player', 'solve', { challenge, playerAnswer, duration });

      // check the answer
      const correct = challenges.verify(challenge, playerAnswer);

      const result = Object.freeze({ challenge, playerAnswer, duration, correct });
      results.push(result);
      yield event('narrative', 'result', { result });
    }

    // end
    yield event('narrative', 'end', { results });

    return {
      challengeOptions,
      results,
    };
  }];
}

function normalizeOptions({ challenges, ...options } = {}) {
  return Object.freeze({
    challenges: resolveChallengeOptions(challenges),
    ...options,
  });
}

function event(subject, name, data) {
  return Object.freeze({
    subject,
    name,
    ...data,
  });
}
