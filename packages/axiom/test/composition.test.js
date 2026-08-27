import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { createAxiom } from '../lib/index.js';

test('flat', () => {
  const axiom = createAxiom();
  axiom.use((context, next) => next({ ...context, x: 1 }));
  axiom.use((context, next) => next({ ...context, y: 2 }));
  axiom((context) => {
    assert.is(context.x, 1);
    assert.is(context.y, 2);
  });
});

test('composition', () => {
  const preset = () => {
    const axiom = createAxiom();
    axiom.use((context, next) => next({ ...context, x: 1 }));
    axiom.use((context, next) => next({ ...context, y: 2 }));
    return axiom;
  };

  const axiom = createAxiom();
  axiom.use(preset());
  axiom((context) => {
    assert.is(context.x, 1);
    assert.is(context.y, 2);
  });
});

test.run();
