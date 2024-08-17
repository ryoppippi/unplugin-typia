# unplugin-typia

**unplugin for [Typia](https://typia.io/)**

[![JSR](https://jsr.io/badges/@ryoppippi/unplugin-typia)](https://jsr.io/@ryoppippi/unplugin-typia)
[![JSR](https://jsr.io/badges/@ryoppippi/unplugin-typia/score)](https://jsr.io/@ryoppippi/unplugin-typia)

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

> When using typia with types imported from non-relative paths like tsconfig `compilerOptions.paths` or relative to
> tsconfig `compilerOptions.baseUrl`, they must be defined in vite.config.ts under [resolve.alias](https://vitejs.dev/config/shared-options#resolve-alias)
> in order to be resolved, according to vite's resolution mechanism.

Examples:

- [`examples/vite-react`](https://github.com/ryoppippi/unplugin-typia/tree/main/examples/vite-react)
- [`examples/vite-hono`](https://github.com/ryoppippi/unplugin-typia/tree/main/examples/vite-hono)
- [`examples/sveltekit`](https://github.com/ryoppippi/unplugin-typia/tree/main/examples/sveltekit)

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import UnpluginTypia from '@ryoppippi/unplugin-typia/esbuild';

export default {
	plugins: [
		UnpluginTypia({ /* options */ }),
	],
};
```

Examples:

- [`tests/rollup.spec.ts`](https://github.com/ryoppippi/unplugin-typia/tree/main/packages/unplugin-typia/tests/esbuild.spec.ts)

<br></details>

<details>
<summary>Next.js</summary><br>

```js
// next.config.mjs
import unTypiaNext from 'unplugin-typia/next';

/** @type {import('next').NextConfig} */
const nextConfig = { /* your next.js config */};

/** @type {import("unplugin-typia").Options} */
const unpluginTypiaOptions = { /* your unplugin-typia options */ };

export default unTypiaNext(nextConfig, unpluginTypiaOptions);

// you can omit the unplugin-typia options when you don't need to customize it
// export default unTypiaNext(nextConfig);
```

Examples:

- [`examples/nextjs`](https://github.com/ryoppippi/unplugin-typia/tree/main/examples/nextjs)

<br></details>

<details>
<summary>Bun.build</summary><br>

### Example 1: Using for building script

```ts
// build.ts
import UnpluginTypia from '@ryoppippi/unplugin-typia/bun';

await Bun.build({
	entrypoints: ['./index.ts'],
	outdir: './out',
	plugins: [
		UnpluginTypia({ /* your options */})
	]
});
```

For building the script:

```sh
bun run ./build.ts
node ./out/index.js
```

Check the [Plugins – Bundler | Bun Docs](https://bun.sh/docs/bundler/plugins) for more details.

### Example 2: Using for running script

```ts
// preload.ts
import { plugin } from 'bun';
import UnpluginTypia from '@ryoppippi/unplugin-typia/bun';

plugin(UnpluginTypia({ /* your options */}));
```

```toml
# bun.toml
preload = "preload.ts"

[test]
preload = "preload.ts"
```

For running the script:

```sh
bun run ./index.ts
```

Check the [Plugins – Runtime | Bun Docs](https://bun.sh/docs/runtime/plugins) for more details.

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

Examples:

- [`tests/rollup.spec.ts`](https://github.com/ryoppippi/unplugin-typia/tree/main/packages/unplugin-typia/tests/rollup.spec.ts)

<br></details>

<details>
<summary>Webpack</summary><br>
> ⚠️ Note: Currently, this plugin works only with 'esm' target. If you want to use 'cjs' target, please use with [`jiti`](https://github.com/unjs/jiti). Refer [this issue](https://github.com/samchon/typia/issues/1094).

```sh
npm install jiti
```

```js
// webpack.config.js
const jiti = require('jiti')(__filename);
const { default: UnpluginTypia } = jiti('@ryoppippi/unplugin-typia/webpack');

module.exports = {
	plugins: [
		UnpluginTypia({ /* options */ }),
	],
};
```

<br></details>

More integration guides can be found in the [`JSR Doc`](https://jsr.io/@ryoppippi/unplugin-typia/doc)

You can find examples in the [`examples/`](https://github.com/ryoppippi/unplugin-typia/tree/main/examples).

## Supported File Extensions

- `.ts`
- `.tsx`
- `.mts`
- `.mtsx`
- `.svelte` (only script tag with `lang="ts"`)

## Limitations

- This plugin is highly experimental and may not work as expected.
- This plugin is not officially supported by Typia.

## Development

This repository is a monorepo managed by [Bun](https://bun.sh).

- [unplugin-typia](https://github.com/ryoppippi/unplugin-typia/tree/main/packages/unplugin-typia)
- [examples](https://github.com/ryoppippi/unplugin-typia/tree/main/examples)

```sh
bun i --frozen-lockfile
```

## LICENSE

[MIT](./LICENSE)

![analytics](https://repobeats.axiom.co/api/embed/30d90d6f9ab91e8b06159ba792765a1377ea7d3e.svg 'Repobeats analytics image')
