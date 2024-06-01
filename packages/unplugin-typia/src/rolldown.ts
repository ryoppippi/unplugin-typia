/**
 * This entry file is for Rolldown plugin.
 *
 * @module
 */

import unplugin from './core/index.js';

/**
 * Rollup plugin
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import UnpluginTypia from 'unplugin-typia/rolldown'
 *
 * export default {
 *   plugins: [UnpluginTypia()],
 * }
 * ```
 */
export default unplugin.rolldown;
