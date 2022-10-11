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
//    $ npm install --global copy-file-util
//    $ copy-file src/LICENSE doc/license.txt
//
// Contributors to this project:
//    $ cd copy-file-util
//    $ npm install
//    $ npm test
//    $ node bin/cli.js --cd=spec/fixtures source/mock.txt --folder target/to-folder
//    $ node bin/cli.js --cd=spec/fixtures source/mock.txt target/{{pkg.type}}/{{pkg.name}}-v{{pkg.version}}.txt

// Imports
import { copyFile } from '../dist/copy-file.js';
import { dna } from 'dna-engine';
import chalk from 'chalk';
import fs    from 'fs';
import log   from 'fancy-log';

// Parameters
const validFlags =  ['cd', 'folder', 'quiet'];
const args =        process.argv.slice(2);
const flags =       args.filter(arg => /^--/.test(arg));
const flagMap =     Object.fromEntries(flags.map(flag => flag.replace(/^--/, '').split('=')));
const flagOn =      Object.fromEntries(validFlags.map(flag => [flag, flag in flagMap]));
const invalidFlag = Object.keys(flagMap).find(key => !validFlags.includes(key));
const params =      args.filter(arg => !/^--/.test(arg));

// Data
const source = params[0];
const target = params[1];

// Utilities
const readPackage = () => JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const getPackageField = (match) =>
   dna.util.value({ pkg: readPackage() }, match.replace(/[{}]/g, '')) ?? 'MISSING-FIELD-ERROR';

// Reporting
const printReport = (result) => {
   const name =   chalk.gray('copy-file');
   const origin = chalk.blue.bold(result.origin);
   const dest =   chalk.magenta(result.dest);
   const arrow =  chalk.gray.bold(' ⟹  ');  //extra space for alignment
   const info =   chalk.white(`(${result.duration}ms)`);
   log(name, origin, arrow, dest, info);
   };

// Copy File
const error =
   invalidFlag ?              'Invalid flag: ' + invalidFlag :
   params.length > 2 ?        'Extraneous parameter: ' + params[2] :
   !source ?                  'Missing source file.' :
   !target && flagOn.folder ? 'Missing target folder.' :
   !target ?                  'Missing target file.' :
   null;
if (error)
   throw Error('[copy-file-util] ' + error);
const targetKey = flagOn.folder ? 'targetFolder' : 'targetFile';
const options = {
   cd:          flagMap.cd ?? null,
   [targetKey]: target.replace(/{{[^{}]*}}/g, getPackageField),
   };
const result = copyFile.cp(source, options);
if (!flagOn.quiet)
   printReport(result);
