import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
export default [
  {
    input: './src/index.ts',
    output: {
      file: './dist/src/index.esm.js',
      format: 'esm',
    },
    plugins: [typescript(), json()],
  },
  {
    input: './src/index.ts',
    output: {
      file: './dist/src/index.js',
      format: 'cjs',
    },
    plugins: [typescript(), json()],
  },
];
