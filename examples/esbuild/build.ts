/* eslint-disable no-console, unicorn/prefer-top-level-await */

import { build } from 'esbuild'
import UnpluginTypia from 'unplugin-typia/esbuild';
import $ from 'dax-sh';

const outDir = 'dist' as const

await $`rm -rf ${outDir}`

await build({
  entryPoints: ['main.ts'],
  bundle: true,
  outfile: `${outDir}/main.mjs`,
  plugins: [UnpluginTypia()],
  format: 'esm'
})

console.log('Build completed!')
