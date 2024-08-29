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

const exports = pkgJson.exports ?? {};
/** 
* convert ts exports to js exports
* ```
*     ".": "./src/index.ts",
*```
* to
* ```
*   ".": {
*       "import": {
*           "types": "./dist/index.d.ts",
*           "default": "./dist/index.js"
*       },
*       "require": {
*           "types": "./dist/index.d.cts",
*           "default": "./dist/index.cjs"
*       }
*   },
* ```
*/
for (const key in exports) {
  if (exports[key] != null && exports[key].endsWith('.ts')){
    const value = exports[key];

    /** replace src with dist & and remove the .ts extension */
    const newValue = value.replace('src', 'dist').replace('.ts', '');

    exports[key] = {
      import: {
        types: `${newValue}.d.ts`,
        default: `${newValue}.js`,
      },
      require: {
        types: `${newValue}.d.cts`,
        default: `${newValue}.cjs`,
      },
    };
  }
}


await $`echo '${JSON.stringify(pkgJson, null, 2)}' > ./package.json`;
