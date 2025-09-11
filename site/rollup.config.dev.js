import { BASE } from './rollup.config.base.js';

export default BASE.map(config => ({
  ...config,
  output: {
    ...config.output,
    indent: true,
  },
  watch: true,
}));
