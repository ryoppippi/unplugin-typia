/**
 * This entry file is for webpack plugin.
 *
 * @module
 */

import unplugin from './core/index.js';

/**
 * Webpack plugin
 *
 * Currently, this plugin works only with 'esm' target.
 *
 * If you want to use 'cjs' use dynamic import
 * If you want to use 'esm' target, don't worry! You can use this plugin without any additional setup.
 *
 * Refer this issue https://github.com/samchon/typia/issues/1094
 *
 * @example
 * ```js
 * // webpack.config.js
 *
 * module.exports = async () => {
 *   const { default: UnpluginTypia } = await import('@ryoppippi/unplugin-typia/webpack');
 *     return {
 *       plugins: [
 *         new UnpluginTypia({
 *           // options
 *         }),
 *       ],
 *     };
 * };
 * ```
 *
 */
export default unplugin.webpack;
