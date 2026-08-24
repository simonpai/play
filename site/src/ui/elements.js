import { defineAndUpgrade, PlayArithmeticChallengeElement, PlayConfirmElement, PlayNumpadElement, PlayRatingElement } from '../element/index.js';

export function defineElements() {
  defineAndUpgrade(
    PlayArithmeticChallengeElement,
    PlayConfirmElement,
    PlayNumpadElement,
    PlayRatingElement,
  );
}
