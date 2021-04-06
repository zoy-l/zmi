import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'
import path from 'path'

const cwd = path.join(__dirname, '.')
const pkg = require(path.join(cwd, 'package.json'))

/**
 * @type { import('rollup').RollupOptions }
 */
export default {
  input: path.resolve(cwd, 'src/index.ts'),
  external: ['fsevents', ...Object.keys(pkg.dependencies)],
  plugins: [
    copy({
      /* temporarily reserved */
    }),
    nodeResolve({ preferBuiltins: true }),
    typescript({
      tsconfig: '../../tsconfig.rollup.json',
      target: 'es2016',
      include: ['src/*.ts'],
      exclude: ['src/*.test.ts'],
      declarationDir: './dist',
      baseUrl: cwd
    }),
    commonjs({ extensions: ['.js'] }),
    json(),
    terser()
  ],
  output: {
    dir: path.join(cwd, 'dist'),
    format: 'cjs'
  }
}
