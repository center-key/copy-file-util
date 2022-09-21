# copy-file-cli
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=200 alt=logo>

_A file copy and rename utility designed for use in npm scripts_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/copy-file-cli/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/copy-file-cli.svg)](https://www.npmjs.com/package/copy-file-cli)
[![Vulnerabilities](https://snyk.io/test/github/center-key/copy-file-cli/badge.svg)](https://snyk.io/test/github/center-key/copy-file-cli)
[![Build](https://github.com/center-key/copy-file-cli/workflows/build/badge.svg)](https://github.com/center-key/copy-file-cli/actions/workflows/run-spec-on-push.yaml)

**copy-file-cli** copies a folder and its subfolders.

## A) Setup

Install package for node:
```shell
$ npm install --save-dev copy-file-cli
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
You can install **copy-file-cli** globally and then run it anywhere directly from the terminal.

Example terminal commands:
```shell
$ npm install --global copy-file-cli
$ copy-file src/web/api.html docs/api-manual.html
```

### 3. ESM and TypeScript Code
Even though **copy-file-cli** is primarily intended for build scripts, the package can easily be used in ESM and TypeScript projects.

``` typescript
import { copyFile } from 'copy-file-cli';
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
   - 🎋 [add-dist-header](https://github.com/center-key/add-dist-header):&nbsp; _Adds a header comment to a file and saves it to your distribution folder_
   - 📄 [copy-file-cli](https://github.com/center-key/copy-file-cli):&nbsp; _A file copy and rename utility designed for use in npm scripts_
   - 📂 [copy-folder-cli](https://github.com/center-key/copy-folder-cli):&nbsp; _A recursive directory file copy utility designed for use in npm scripts_

[MIT License](LICENSE.txt)
