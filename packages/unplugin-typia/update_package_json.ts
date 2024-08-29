/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import { $ } from 'bun';

const pkgJson = await $`cat ./package.json`.json();

const publishConfig = pkgJson.publishConfig ?? {};

/* ovrride the with the new values */
for (const key in publishConfig) {
	if (pkgJson[key] != null) {
		pkgJson[key] = publishConfig[key];
	}
}

pkgJson.private = false;

delete pkgJson.publishConfig ;

await $`echo '${JSON.stringify(pkgJson, null, 2)}' > ./package.json`;
