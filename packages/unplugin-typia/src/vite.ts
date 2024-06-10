/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

import unplugin from './core/index.js';

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import UnpluginTypia from 'unplugin-typia/vite'
 *
 * export default defineConfig({
 *   plugins: [UnpluginTypia()],
 * })
 * ```
 */
export default unplugin.vite;
