/* eslint-disable no-console, unicorn/prefer-top-level-await */

import { build } from 'esbuild'
import { $ } from 'bun';
import UnpluginTypia from '@ryoppippi/unplugin-typia/esbuild';

const outDir = 'dist' as const

await $`rm -rf ${outDir}`

await build({
  entryPoints: ['main.ts'],
  bundle: true,
  outfile: `${outDir}/main.mjs`,
  plugins: [UnpluginTypia({
    log: 'verbose',
    cache: false,
  })],
  format: 'esm'
})

console.log('Build completed!')
