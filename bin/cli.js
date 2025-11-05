#!/usr/bin/env node
////////////////////
// copy-file-util //
// MIT License    //
////////////////////

// Usage in package.json:
//    "scripts": {
//       "pub-license": "copy-file src/LICENSE doc/license.txt"
//    },
//
// Usage from command line:
//    $ npm install --save-dev copy-file-util
//    $ copy-file src/LICENSE doc/license.txt
//
// Contributors to this project:
//    $ cd copy-file-util
//    $ npm install
//    $ npm test
//    $ node bin/cli.js --cd=spec/fixtures mock.html --folder target/to-folder
//    $ node bin/cli.js --cd=spec/fixtures mock.html target/{{package.type}}/{{package.name}}-v{{package.version}}.html

import { copyFile } from '../dist/copy-file.js';

copyFile.cli();
