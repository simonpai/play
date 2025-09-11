//import 'dotenv/config';
//import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import yaml from '@rollup/plugin-yaml';
import glob from 'fast-glob';

// glob entry
const entries = glob.sync('src/entry/*.js');

export const BASE = entries.map(entry => ({
  plugins: [
    nodeResolve({ browser: true }),
    yaml(),
    replace({
      preventAssignment: true,
      //'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  input: entry,
  output: {
    file: entry.replace('src/entry', 'dist/js'),
    format: 'iife',
    indent: false,
  },
}));
