#!/usr/bin/env bun

import { $ } from 'bun';
import { join } from 'node:path';
import {tmpdir} from 'node:os';

function getTagName() {
  const githubRef = Bun.env.GITHUB_REF;
  if (githubRef && githubRef.startsWith("refs/tags/")) {
    return githubRef.replace("refs/tags/", "");
  } else {
    return undefined;
  }
}

const tagName = getTagName();
if (tagName == null) {
  throw new Error("Could not get tag name from GITHUB_REF");
}

const versionStr = tagName.replace(/^v/, "");
const pkgName = `@jsr/ryoppippi__unplugin-typia@${versionStr}`;

/* create tmp dir */
const tmpDir = tmpdir();

$.cwd(tmpDir);

/* clone the repo */
await $`echo '@jsr:registry=https://npm.jsr.io' >> .npmrc`

await $`bun init -y && bun add ${pkgName}`;

$.cwd(join(tmpDir, 'node_modules', '@jsr', 'ryoppippi__unplugin-typia'));

const pkgJson = await $`cat ./package.json`.json();

if(pkgJson.version !== versionStr) {
  throw new Error(`Version mismatch: ${pkgJson.version} !== ${versionStr}`);
}

pkgJson.name = "@ryoppippi/unplugin-typia";
pkgJson.description = "unplugin for typia";
pkgJson.repository = `https://github.com/ryoppippi/unplugin-typia.git`;
pkgJson.license = "MIT";
pkgJson.author = "ryoppippi";

await $`echo '${JSON.stringify(pkgJson, null, 2)}' > ./package.json`;

await $`npm publish --access public --provenance`;

