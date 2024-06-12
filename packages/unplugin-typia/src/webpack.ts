/**
 * This entry file is for webpack plugin.
 *
 * @module
 */

import unplugin from './core/index.js';

/**
 * Webpack plugin
 *
 * Currently, this plugin works only with 'esm' target. If you want to use 'cjs' target, please use with [`jiti`](https://github.com/unjs/jiti).
 *
 * Refer this issue https://github.com/samchon/typia/issues/1094
 *
 * @example
 * ```js
 * // webpack.config.js
 * const jiti = require("jiti")(__filename);
 * const { default: UnpluginTypia } = jiti("@ryoppippi/unplugin-typia/webpack");
 *
 * module.exports = {
 *  plugins: [UnpluginTypia({ /* your config *\/ })],
 * }
 * ```
 *
 */
export default unplugin.webpack;
