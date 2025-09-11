import terser from '@rollup/plugin-terser';
import { BASE } from './rollup.config.base.js';

export default BASE.map(config => ({
  ...config,
  plugins: [
    ...config.plugins,
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      },
    }),
  ],
}));
