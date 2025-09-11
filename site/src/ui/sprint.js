import { delay, Component } from '@axiom/commons';
import { digitCountOf } from '@simonpai.play/arithmetic';
import { configDebugger } from './debug.js';
import { countdown, show, hide, createElement, createAftermath } from '../element/index.js';
import { defineElements } from './elements.js';

export function sprintUi(options = {}) {
  defineElements();
  return async (context, next) => {
    const ui = new SprintUi(context, options);
    const { player } = ui;
    const returnValue = await next({ ...context, player });
    ui.exit();
    return returnValue;
  };
};

function normalizeOptions({ autoplay, ...options } = {}) {
  return Object.freeze({
    autoplay: normalizeAutoPlayOptions(autoplay),
    ...options,
  });
}

function normalizeAutoPlayOptions({ reactionTime = 300, ...options } = {}) {
  if (typeof reactionTime !== 'number') {
    throw new Error('Invalid autoplay reaction time');
  }
  return Object.freeze({
    reactionTime: Math.max(reactionTime, 0),
    ...options,
  });
}

class SprintUi extends Component {

  constructor(context, options) {
    super();
    this._context = context;
    this._options = normalizeOptions(options);
    this._children.push(
      this._player = new SprintPlayer(this, this._options.autoplay),
      this._view = new SprintView(this),
    );
    this._unsubscribes.push(configDebugger(context, this));
  }

  get player() {
    return this._player;
  }

  get view() {
    return this._view;
  }

}

class SprintPlayer extends Component {

  constructor(ui) {
    super();
    this._ui = ui;
  }

  async solve(challenge) {
    const { answer, ...rest } = await this._ui.view.solve(challenge);
    this._events.emit({ name: 'solve', challenge, playerAnswer: answer, ...rest });
    return { answer, ...rest };
  }

}

class SprintView extends Component {

  constructor(ui) {
    super();
    this._ui = ui;
    this._autoPlayer = ui._context.player;
    this._unsubscribes.push(
      this._ui._context.events.subscribe(event => this._handleContextEvent(event)),
    );
    this._setup();
  }

  _setup() {
    document.body.classList.add('sprint');
    document.body.innerHTML = `
<div class="root">
  <div class="challenges"></div>
  <div class="stage"></div>
  <div class="controls">
    <play-confirm class="start-button-panel hidden">
      <div class="start-button" data-role="confirm">Start</div>
    </play-confirm>
    <play-numpad class="hidden"></play-numpad>
  </div>
</div>`.trim();
    this._refs = {
      challenges: document.querySelector('.challenges'),
      challenge: undefined,
      stage: document.querySelector('.stage'),
      startButtonPanel: document.querySelector('.start-button-panel'),
      numpad: document.querySelector('play-numpad'),
    };
    this._refs.numpad.addEventListener('input', ({ detail }) => {
      this._refs.challenge && this._refs.challenge.input(detail.value);
    });
  }

  // player //
  async solve(challenge) {
    return this._runChallenge(challenge);
  }

  // narritive events //
  async _handleContextEvent(event) {
    switch (event.subject) {
      case 'narrative':
        switch (event.name) {
          case 'start':
            await this._handleNarrativeStart(event);
            break;
          case 'end':
            await this._handleNarrativeEnd(event);
            break;
        }
        break;
    }
  }

  async _handleNarrativeStart() {
    // block narrative with start button & countdown
    await this._confirmStart();
    await this._countdown();
  }

  async _handleNarrativeEnd({ results }) {
    await Promise.all([
      this._showAftermath(results),
      this._hideNumpad(),
    ]);
  }

  // actions //
  async _confirmStart() {
    const { startButtonPanel, numpad } = this._refs;

    // controls: start button enters
    (async () => {
      await show(startButtonPanel, 'bounceInUp', { classes: ['fast'] });
      await this._autoplayStartButton(startButtonPanel);
    })();

    await startButtonPanel.confirmed;

    // controls: start button exits, revealing numpad
    await hide(startButtonPanel, 'bounceOutDown', { classes: ['fast'] });
    await show(numpad, 'bounceInUp', { classes: ['fast'] });
  }

  async _autoplayStartButton(panel) {
    if (!this._autoPlayer) {
      return;
    }
    await delay(this._ui._options.autoplay.reactionTime);
    this._events.emit({ subject: 'autoplay', name: 'click-start-button' });
    panel.confirm();
  }

  async _countdown() {
    await countdown(this._refs.challenges, {
      interval: 800,
      display: (count) => count > 0 ? `${count}` : 'Go!',
      effect: ['fadeInDown', { classes: ['faster'] }],
    });
  }

  async _runChallenge(challenge) {
    const { expression } = challenge;
    const answerDigitCount = digitCountOf(challenge.answer);
    const element = createElement(`<play-arithmetic-challenge class="hidden" expression="${expression}" answer-digit-count="${answerDigitCount}"></play-arithmetic-challenge>`);
    this._refs.challenges.appendChild(element);
    this._refs.challenge = element;

    const start = performance.now();
    let showDuration;
    (async () => {
      const showStart = performance.now();
      await show(element, 'fadeInDown', { classes: ['fast'] });
      showDuration = performance.now() - showStart;
      await this._autoplayChallenge(challenge);
    })();
    const answer = await element.answer;
    const duration = performance.now() - start;

    await delay(300);
    this._refs.challenges.removeChild(element);
    this._refs.challenge = undefined;

    return { answer, duration };
  }

  async _autoplayChallenge(challenge) {
    if (!this._autoPlayer) {
      return;
    }
    const { answer: playerAnswer, duration } = await this._autoPlayer.solve(challenge);
    await delay(duration);
    await this._refs.numpad.type(...(`${playerAnswer}`.split('')));
  }

  async _showAftermath(results) {
    const element = createAftermath({ results });
    this._refs.challenges.appendChild(element);
    await show(element, 'fadeInDown', { classes: ['fast'] });
  }

  async _hideNumpad() {
    await hide(this._refs.numpad, 'bounceOutDown', { classes: ['fast'] });
  }

}
