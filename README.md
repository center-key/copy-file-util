# copy-file-util
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=200 alt=logo>

_Copy or rename a file (CLI tool designed for use in npm scripts)_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/copy-file-util/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/copy-file-util.svg)](https://www.npmjs.com/package/copy-file-util)
[![Vulnerabilities](https://snyk.io/test/github/center-key/copy-file-util/badge.svg)](https://snyk.io/test/github/center-key/copy-file-util)
[![Build](https://github.com/center-key/copy-file-util/workflows/build/badge.svg)](https://github.com/center-key/copy-file-util/actions/workflows/run-spec-on-push.yaml)

**copy-file-util** copies a folder and its subfolders.

## A) Setup

Install package for node:
```shell
$ npm install --save-dev copy-file-util
```

## B) Usage

### 1. npm scripts
Call `copy-file` from the `"scripts"` section of your **package.json** file.

The **first** parameter is the *source* file.
The **second** parameter is the *target* file or folder (use the `--fodler` flag).

Example **package.json** script:
```json
   "scripts": {
      "pub-license": "copy-file src/LICENSE doc/license.txt",
      "backup-license": "copy-file src/LICENSE --folder backup",
   },
```

Try out the script with the command: `npm run pub-license`

### 2. Global
You can install **copy-file-util** globally and then run it anywhere directly from the terminal.

Example terminal commands:
```shell
$ npm install --global copy-file-util
$ copy-file src/web/api.html docs/api-manual.html
```

### 3. ESM and TypeScript Code
Even though **copy-file-util** is primarily intended for build scripts, the package can easily be used in ESM and TypeScript projects.

``` typescript
import { copyFile } from 'copy-file-util';
const result = copyFile.cp('src/web/api.html' { targetFile: 'docs/api-manual.html' });
console.log('Execution time:', result.duration, 'ms');
```

See the **TypeScript Declaration File** file [copy-file.d.ts](dist/copy-file.d.ts) in the **dist** folder for documentation.

## C) CLI Flags

| Flag       | Description                       | Values | Default |
| ---------- | --------------------------------- | ------ | ------- |
| `--folder` | Indicates the target is a folder. | N/A    | N/A     |
| `--quiet`  | Suppress informational messages.  | N/A    | N/A     |

### Examples
   - `copy-file app.js app.mjs --quite` &nbsp; Displays no output.
   - `copy-file app.js --folder dist` &nbsp; Copies **app.js** into the **dist** folder.

<br>

---
**Build Tools**
   - 🎋 [add-dist-header](https://github.com/center-key/add-dist-header):&nbsp; _Prepend a one-line header comment (with license notice) to distribution files_
   - 📄 [copy-file-util](https://github.com/center-key/copy-file-util):&nbsp; _Copy or rename a file (CLI tool designed for use in npm scripts)_
   - 📂 [copy-folder-cli](https://github.com/center-key/copy-folder-cli):&nbsp; _Recursively copy a folder (CLI tool designed for use in npm scripts)_
   - 🚦 [w3c-html-validator](https://github.com/center-key/w3c-html-validator):&nbsp; _Check the markup validity of HTML files using the W3C validator_

Feel free to submit questions at:<br>
[github.com/center-key/copy-file-util/issues](https://github.com/center-key/copy-file-util/issues)

[MIT License](LICENSE.txt)
