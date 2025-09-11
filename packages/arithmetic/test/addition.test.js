import { test } from 'uvu';
import * as assert from 'uvu/assert';
//import { schoolLevel0IndexToOperands } from '../lib/addition.js';

/*
test('schoolLevel0IndexToOperands', () => {
  let count = 0;
  for (let x = 0; x <= 9; x++) {
    count += Math.min(11 - x, 10);
  }
  assert.is(count, 64);

  const results = new Set();
  for (let i = 0; i < count; i++) {
    const [x, y] = schoolLevel0IndexToOperands(i);
    assert.ok(x >= 0 && x <= 9);
    assert.ok(y >= 0 && y <= 9);
    assert.ok(x + y <= 10);
    results.add(`${x},${y}`);
  }
  assert.is(results.size, count);

});
*/

test.run();
