/**
 * This entry file is for Farm plugin.
 *
 * @module
 */

import unplugin from './core/index.js';

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // farm.config.ts
 * import UnpluginTypia from 'unplugin-typia/farm'
 *
 * export default defineConfig({
 *   plugins: [UnpluginTypia()],
 * })
 * ```
 */
export default unplugin.farm;
