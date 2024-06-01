/**
 * This entry file is for esbuild plugin. Requires esbuild >= 0.15
 *
 * @module
 */

import unplugin from './core/index.js';

/**
 * Esbuild plugin
 *
 * @example
 * ```ts
 * // esbuild.config.js
 * import { build } from 'esbuild'
 *
 * build({
 *   plugins: [require('unplugin-typia/esbuild')()],
 * })
 * ```
 */
export default unplugin.esbuild;
