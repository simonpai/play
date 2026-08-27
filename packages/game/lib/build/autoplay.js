import { prng, events, debug } from '@axiom/axiom';
import { challenges, CHALLENGE_TOPIC, autoplay } from '../middleware/index.js';
import { axiom, sprint } from '../axiom/index.js';

axiom.use(events());
axiom.use(prng());
axiom.use(challenges());
axiom.use(autoplay());

axiom.use(debug());

const options = {
  challenges: {
    topic: CHALLENGE_TOPIC.MULTIPLICATION,
    level: 1,
    count: 10,
  },
};

console.log(JSON.stringify({ name: 'start', options }));

const outcome = await sprint(options);

console.log(JSON.stringify({ name: 'end', ...outcome }));
