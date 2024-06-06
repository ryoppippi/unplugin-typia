# unplugin-typia

**Unplugin for [Typia](https://typia.io/)**

[![JSR](https://jsr.io/badges/@ryoppippi/unplugin-typia)](https://jsr.io/@ryoppippi/unplugin-typia)

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
# install typia! (nypm detects your PM ✨)
npx nypm add typia

# setup typia!
npx typia setup
# pnpm dlx typia setup
# yarn dlx typia setup

# after installing typia, run prepare script
npm run prepare
```

More details about setting up Typia can be found in the [Typia Docs](https://typia.io/docs/setup/#unplugin-typia).

Then, add the unplugin to your favorite bundler:

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import UnpluginTypia from '@ryoppippi/unplugin-typia/vite';

export default defineConfig({
	plugins: [
		UnpluginTypia({ /* options */ }),
	],
});
```

Examples:

- [`examples/vite-vanilla`](https://github.com/ryoppippi/unplugin-typia/tree/main/examples/vite-vanilla)
- [`examples/vite-react`](https://github.com/ryoppippi/unplugin-typia/tree/main/examples/vite-react)
- [`examples/vite-hono`](https://github.com/ryoppippi/unplugin-typia/tree/main/examples/vite-hono)
- [`examples/sveltekit`](https://github.com/ryoppippi/unplugin-typia/tree/main/examples/sveltekit)

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild';
import UnpluginTypia from '@ryoppippi/unplugin-typia/esbuild';

export default {
	plugins: [
		UnpluginTypia({ /* options */ }),
	],
};
```

Examples:

- [`examples/esbuild`](https://github.com/ryoppippi/unplugin-typia/tree/main/examples/esbuild)

<br></details>

<details>
<summary>Next.js</summary><br>

```js
// next.config.mjs
import unTypiaNext from 'unplugin-typia/next';

/** @type {import('next').NextConfig} */
const config = {};

export default unTypiaNext(config);
```

Examples:

- [`examples/nextjs`](https://github.com/ryoppippi/unplugin-typia/tree/main/examples/nextjs)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import UnpluginTypia from '@ryoppippi/unplugin-typia/rollup';

export default {
	plugins: [
		UnpluginTypia({ /* options */ }),
	],
};
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
const UnpluginTypia = require('@ryoppippi/unplugin-typia/webpack');

module.exports = {
	plugins: [
		UnpluginTypia({ /* options */ }),
	],
};
```

<br></details>

More integration guides can be found in the [`JSR Doc`](https://jsr.io/@ryoppippi/unplugin-typia/doc)

You can find examples in the [`examples/`](https://github.com/ryoppippi/unplugin-typia/tree/main/examples).

## Limitations

- This plugin is highly experimental and may not work as expected.
- This plugin is not officially supported by Typia.
- This plugin parse only `.ts`, `.tsx`, `.js`, `.jsx` files. If you want to use typia in markup files such as `.svelte`, `.astro`, `.vue`, and so on, you first create typia validation functions in `.ts` files, then import them in the markup files.

## LICENSE

[MIT](./LICENSE)
