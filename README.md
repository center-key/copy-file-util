# copy-file-util
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=200 alt=logo>

_Copy or rename a file with optional package version number (CLI tool designed for use in npm scripts)_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/copy-file-util/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/copy-file-util.svg)](https://www.npmjs.com/package/copy-file-util)
[![Vulnerabilities](https://snyk.io/test/github/center-key/copy-file-util/badge.svg)](https://snyk.io/test/github/center-key/copy-file-util)
[![Build](https://github.com/center-key/copy-file-util/workflows/build/badge.svg)](https://github.com/center-key/copy-file-util/actions/workflows/run-spec-on-push.yaml)

**copy-file-util** takes a source file and copies it to a new destination.&nbsp;
The command's console output includes a timestamp and formatting helpful in build systems.

<img src=https://raw.githubusercontent.com/center-key/copy-file-util/main/screenshot.png
width=800 alt=screenshot>

## A) Setup
Install package for node:
```shell
$ npm install --save-dev copy-file-util
```

## B) Usage
### 1. npm scripts
Run `copy-file` from the `"scripts"` section of your **package.json** file.

Parameters:
* The **first** parameter is the *source* file.
* The **second** parameter is the *target* file or folder (use the `--folder` flag).

Example **package.json** scripts:
```json
   "scripts": {
      "pub-license": "copy-file src/LICENSE doc/license.txt",
      "backup-license": "copy-file src/LICENSE --folder backup",
   },
```

### 2. Global
You can install **copy-file-util** globally and then run it anywhere directly from the terminal.

Example terminal commands:
```shell
$ npm install --global copy-file-util
$ copy-file src/web/api.html docs/api-manual.html
```

### 3. CLI flags
Command-line flags:
| Flag       | Description                                    | Values     |
| ---------- | ---------------------------------------------- | ---------- |
| `--cd`     | Change working directory before starting copy. | **string** |
| `--folder` | Indicates the target is a folder.              | N/A        |
| `--note`   | Place to add a comment only for humans.        | **string** |
| `--quiet`  | Suppress informational messages.               | N/A        |

Examples:
   - `copy-file app.js app.mjs --quiet`<br>
   Displays no output.

   - `copy-file app.js --folder dist`<br>
   Copies **app.js** into the **dist** folder.

### 4. Template variables
The *target* parameter can contain template variables, like `{{pkg.version}}` and `{{pkg.name}}`, which will be replaced with values with values from your project's **package.json** file.

Example:
   - `copy-file build/app.js dist/app-v{{pkg.version}}.js` &nbsp; Creates a copy of **app.js** named something like **app-v1.2.3.js** based on the version of your project.

## C) Application Code
Even though **copy-file-util** is primarily intended for build scripts, the package can easily be used programmatically in ESM and TypeScript projects.

Example:
``` typescript
import { copyFile } from 'copy-file-util';

const result = copyFile.cp('src/web/api.html' { targetFile: 'docs/api-manual.html' });
console.log('Execution time:', result.duration, 'ms');
```

See the **TypeScript Declarations** at the top of [copy-file.ts](copy-file.ts) for documentation.

<br>

---
**CLI Build Tools**
   - 🎋 [add-dist-header](https://github.com/center-key/add-dist-header):&nbsp; _Prepend a one-line banner comment (with license notice) to distribution files_
   - 📄 [copy-file-util](https://github.com/center-key/copy-file-util):&nbsp; _Copy or rename a file with optional package version number_
   - 📂 [copy-folder-util](https://github.com/center-key/copy-folder-util):&nbsp; _Recursively copy files from one folder to another folder_
   - 🔍 [replacer-util](https://github.com/center-key/replacer-util):&nbsp; _Find and replace strings or template outputs in text files_
   - 🔢 [rev-web-assets](https://github.com/center-key/rev-web-assets):&nbsp; _Revision web asset filenames with cache busting content hash fingerprints_
   - 🚆 [run-scripts-util](https://github.com/center-key/run-scripts-util):&nbsp; _Organize npm scripts into named groups of easy to manage commands_
   - 🚦 [w3c-html-validator](https://github.com/center-key/w3c-html-validator):&nbsp; _Check the markup validity of HTML files using the W3C validator_

Feel free to submit questions at:<br>
[github.com/center-key/copy-file-util/issues](https://github.com/center-key/copy-file-util/issues)

[MIT License](LICENSE.txt)
