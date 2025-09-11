import { defineAndUpgrade, PlayArithmeticChallengeElement, PlayConfirmElement, PlayNumpadElement } from '../element/index.js';

export function defineElements() {
  defineAndUpgrade(
    PlayArithmeticChallengeElement,
    PlayConfirmElement,
    PlayNumpadElement,
  );
}
