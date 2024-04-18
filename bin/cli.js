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
//    $ node bin/cli.js --cd=spec/fixtures source/mock.html --folder target/to-folder
//    $ node bin/cli.js --cd=spec/fixtures source/mock.html target/{{package.type}}/{{package.name}}-v{{package.version}}.html

// Imports
import { cliArgvUtil } from 'cli-argv-util';
import { copyFile } from '../dist/copy-file.js';
import { dna } from 'dna-engine';
import fs from 'fs';

// Parameters and flags
const validFlags = ['cd', 'folder', 'move', 'no-overwrite', 'note', 'quiet'];
const cli =        cliArgvUtil.parse(validFlags);
const source =     cli.params[0];
//const target =     cli.params[1];
const target =     cli.params[1].replaceAll('{{pkg.', '{{package.');  //name "pkg" deprecated in favor of "package" for clarity

// Utilities
const readPackage = () => JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const getPackageField = (match) =>  //example: '{{package.version}}' --> '3.1.4'
   dna.util.value({ package: readPackage() }, match.replace(/[{}]/g, '')) ?? 'MISSING-FIELD-ERROR';

// Copy File
const error =
   cli.invalidFlag ?              cli.invalidFlagMsg :
   cli.paramCount > 2 ?           'Extraneous parameter: ' + cli.params[2] :
   !source ?                      'Missing source file.' :
   !target && cli.flagOn.folder ? 'Missing target folder.' :
   !target ?                      'Missing target file.' :
   null;
if (error)
   throw Error('[copy-file-util] ' + error);
const targetKey = cli.flagOn.folder ? 'targetFolder' : 'targetFile';
const templateVariables = /{{[^{}]*}}/g;  //example match: "{{package.version}}"
const options = {
   cd:          cli.flagMap.cd ?? null,
   move:        cli.flagOn.move,
   overwrite:   !cli.flagOn.noOverwrite,
   [targetKey]: target.replace(templateVariables, getPackageField),
   };
const result = copyFile.cp(source, options);
if (!cli.flagOn.quiet)
   copyFile.reporter(result);
