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
 * import UnpluginTypia from 'unplugin-typia/esbuild';
 *
 * build({
 *   plugins: [
 *     UnpluginTypia({}),
 *   ],
 * })
 * ```
 */
export default unplugin.esbuild;
