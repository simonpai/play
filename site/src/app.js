import { prng, events, debug } from '@axiom/axiom';
import { minigames, minigame, challenges, CHALLENGE_TOPIC, autoplay, sprint, axiom } from '@simonpai.play/game';
import { ui } from './ui/index.js';

export default function app({
  autoplay: useAutoplay = false,
} = {}) {
  axiom.use(events({ console: true }));
  axiom.use(prng());

  axiom.use(challenges());
  axiom.use(minigames()
    .add(sprint)
  );

  if (useAutoplay) {
    axiom.use(autoplay({ correctness: 0.75 }));
  }
  axiom.use(debug());

  axiom.use(ui());
  
  const options = {
    minigame: 'sprint',
    challenges: {
      topic: CHALLENGE_TOPIC.MULTIPLICATION,
      level: 1,
      count: 20,
      deduplicate: true,
    },
  };

  return minigame(options);
}
