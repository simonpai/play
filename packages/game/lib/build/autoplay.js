import axiom, { prng, events, debug } from '@axiom/axiom';
import { challenges, CHALLENGE_TYPE, autoplay } from '../middleware/index.js';
import { sprint } from '../logic/sprint.js';

const app = axiom();

app.use(events());
app.use(prng());
app.use(challenges());
app.use(autoplay());

app.use(debug());

const options = {
  challenges: {
    type: CHALLENGE_TYPE.MULTIPLICATION,
    level: 1,
    count: 10,
  },
};

console.log(JSON.stringify({ name: 'start', options }));

const outcome = await app(sprint(options));

console.log(JSON.stringify({ name: 'end', ...outcome }));
