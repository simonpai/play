import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { axiom } from '../lib/axiom.js';

test('flat', () => {
  const app = axiom();
  app.use((context, next) => next({ ...context, x: 1 }));
  app.use((context, next) => next({ ...context, y: 2 }));
  app((context) => {
    assert.is(context.x, 1);
    assert.is(context.y, 2);
  });
});

test('composition', () => {
  const preset = () => {
    const app = axiom();
    app.use((context, next) => next({ ...context, x: 1 }));
    app.use((context, next) => next({ ...context, y: 2 }));
    return app;
  };

  const app = axiom();
  app.use(preset());
  app((context) => {
    assert.is(context.x, 1);
    assert.is(context.y, 2);
  });
});

test.run();
