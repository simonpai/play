import axiom, { prng, events, debug } from '@axiom/axiom';
import { challenges, CHALLENGE_TYPE, autoplay as _autoplay, sprint } from '@simonpai.play/game';
import { ui } from './ui/index.js';

export default function app({ autoplay = false } = {}) {
  const app = axiom();

  app.use(events({ console: true }));
  app.use(prng());
  app.use(challenges());
  if (autoplay) {
    app.use(_autoplay({ correctness: 0.75 }));
  }
  app.use(debug());

  app.use(ui());
  
  const options = {
    challenges: {
      type: CHALLENGE_TYPE.MULTIPLICATION,
      level: 1,
      count: 10,
    },
  };

  return app(sprint(options));
}
