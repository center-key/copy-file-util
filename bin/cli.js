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

// Imports
import { copyFile } from '../dist/copy-file.js';
import chalk from 'chalk';
import fs    from 'fs';
import log   from 'fancy-log';

// Parameters
const validFlags =  ['cd', 'folder', 'quiet'];
const args =        process.argv.slice(2);
const flags =       args.filter(arg => /^--/.test(arg));
const flagMap =     Object.fromEntries(flags.map(flag => flag.replace(/^--/, '').split('=')));
const invalidFlag = Object.keys(flagMap).find(key => !validFlags.includes(key));
const params =      args.filter(arg => !/^--/.test(arg));

// Data
const source = params[0];
const target = params[1];
const mode =   { folder: 'folder' in flagMap, quiet: 'quiet' in flagMap };

// Utilities
const getPackageVersion = () => !fs.existsSync('package.json') ? 'ERROR' :
   JSON.parse(fs.readFileSync('package.json', 'utf-8')).version;

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
   invalidFlag ?            'Invalid flag: ' + invalidFlag :
   params.length > 2 ?      'Extraneous parameter: ' + params[2] :
   !source ?                'Missing source file.' :
   !target && mode.folder ? 'Missing target folder.' :
   !target ?                'Missing target file.' :
   null;
if (error)
   throw Error('[copy-file-util] ' + error);
const targetKey = mode.folder ? 'targetFolder' : 'targetFile';
const options = {
   cd:          flagMap.cd ?? null,
   [targetKey]: target.replace(/{{{pkg.version}}}/, getPackageVersion),
   };
const result = copyFile.cp(source, options);
if (!mode.quiet)
   printReport(result);
