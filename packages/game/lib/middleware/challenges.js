import { Component } from '@axiom/commons';
import { generateChallenges, resolveChallengeOptions } from '@simonpai.play/arithmetic';

export { CHALLENGE_TOPIC } from '@simonpai.play/arithmetic';

export function challenges(options = {}) {
  return (context, next) => next({ ...context, challenges: new Challenges(context, options) });
}

class Challenges extends Component {

  _prng;
  _options;

  constructor({ prng }, options) {
    super();
    this._prng = prng;
    this._options = options;
  }

  generate(options) {
    const context = { prng: this._prng };
    options = resolveChallengeOptions(this._options, options);
    return generateChallenges(context, options);
  }

  verify(challenge, answer) {
    return challenge.answer === answer;
  }
    
}
