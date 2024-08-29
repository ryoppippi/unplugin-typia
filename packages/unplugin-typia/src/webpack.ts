/**
 * This entry file is for webpack plugin.
 *
 * @module
 */

import unplugin from './core/index.js';

/**
 * Webpack plugin
 *
 * Currently, this plugin on JSR works only with 'esm' target.
 * If you want to use 'cjs' target, please download from npm and use it.
 * If you want to download from JSR, you have following options:
 * If you want to use 'cjs' target on Node < 20.17.0 , please use with [`jiti`](https://github.com/unjs/jiti).
 * If you want to use 'cjs' target on Node >= 20.17.0, please use with `require` and enable [`--experimental-require-modules` flag](https://github.com/nodejs/node/pull/51977).
 * If you want to use 'esm' target, don't worry! You can use this plugin without any additional setup.
 *
 * Refer this issue https://github.com/samchon/typia/issues/1094
 *
 * @example
 * ```js
 * // webpack.config.js
 *
 * // if you use Node < 20.17.0
 * const jiti = require("jiti")(__filename);
 * const { default: UnpluginTypia } = jiti("@ryoppippi/unplugin-typia/webpack");
 *
 * // if you use Node >= 20.17.0
 * const { default: UnpluginTypia } = require("@ryoppippi/unplugin-typia/webpack");
 *
 * module.exports = {
 *  plugins: [UnpluginTypia({ /* your config *\/ })],
 * }
 * ```
 *
 */
export default unplugin.webpack;
