import { Component } from '@axiom/commons';
import { digitCountOf } from '@simonpai.play/arithmetic';

export function autoplay(options = {}) {
  return (context, next) => next({ ...context, player: new AutoPlayer(context, options) });
}

class AutoPlayer extends Component {

  _prng;
  _options;

  constructor({ prng }, options) {
    super();
    this._prng = prng;
    this._options = normalizeOptions(options);
  }

  solve(challenge) {
    // TODO: prng duration
    const duration = this._options.duration;
    const { answer } = challenge;
    const playerAnswer = this._prng.next() < this._options.correctness ? answer : generateWrongAnswer(this._prng, answer);
    return { answer: playerAnswer, duration };
  }

}

function normalizeOptions({ correctness = 1, duration = 0 } = {}) {
  return Object.freeze({
    correctness,
    duration,
  });
}

function generateWrongAnswer(prng, answer) {
  // we want a wrong answer with the same digit count
  const answerString = `${answer}`;
  const digitCount = digitCountOf(answer);
  // pick a digit to modify
  const digitIndex = Math.floor(prng.next() * digitCount);
  const digit = Number(answerString.charAt(digitIndex));
  // first digit can't be 0
  let newDigit = digitIndex === 0 ? Math.floor(prng.next() * 8) + 1 : Math.floor(prng.next() * 9);
  if (newDigit >= digit) {
    newDigit++;
  }
  return Number(answerString.substring(0, digitIndex) + newDigit + answerString.substring(digitIndex + 1));
}
