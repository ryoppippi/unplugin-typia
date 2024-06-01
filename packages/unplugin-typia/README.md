# unplugin-typia

**Unplugin for [Typia](https://typia.io/)**

[![JSR](https://jsr.io/badges/@ryoppippi/unplugin-typia>)](https://jsr.io/@ryoppippi/unplugin-typia)

> ⚠️ Note: this is highly experimental software.

## Why

Typia is fantastic, but it is hard to setup, even for frontend development.
If you use some bundlers for frontend like `Vite`, it is even harder to setup.
This unplugin aims to make it easier to use Typia in your projects.

## Install

First, install `unplugin-typia`:

```bash
# jsr
npx jsr add -D @ryoppippi/unplugin-typia
```

Then, install `typia`:

```bash
npm install --save typia
npm install --save-dev typescript ts-patch ts-node

npx ts-patch install
npx typia patch
```

You should follow the [manual setup instructions](https://typia.io/docs/setup/#manual-setup) on the Typia website.
However, you don't need to add plugins to the `tsconfig.json` file.

Then, add the unplugin to your favorite bundler:

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import UnpluginTypia from '@ryoppippi/unplugin-typia';

export default defineConfig({
	plugins: [
		UnpluginTypia.vite({ /* options */ }),
	],
});
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import UnpluginTypia from '@ryoppippi/unplugin-typia';

export default {
	plugins: [
		UnpluginTypia.rollup({ /* options */ }),
	],
};
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild';
import UnpluginTypia from '@ryoppippi/unplugin-typia';

export default {
	plugins: [
		UnpluginTypia.esbuild({ /* options */ }),
	],
};
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
const UnpluginTypia = require('@ryoppippi/unplugin-typia');

module.exports = {
	plugins: [
		UnpluginTypia.webpack({ /* options */ }),
	],
};
```

<br></details>

## Examples

You can find examples in the [`examples/`](https://github.com/ryoppippi/unplugin-typia/tree/main/examples).

## LICENSE

[MIT](./LICENSE)
