/**
 * This entry file is for webpack plugin.
 *
 * @module
 */

import unplugin from './core/index.js';

/**
 * Webpack plugin
 *
 * @example
 * ```ts
 * // webpack.config.js
 * module.exports = {
 *  plugins: [require("@ryoppippi/unplugin-typia/webpack")()],
 * }
 * ```
 */
export default unplugin.webpack;
