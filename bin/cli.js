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
//    $ node bin/cli.js spec/fixtures/source/mock.txt --folder spec/fixtures/target/to-folder

// Imports
import { copyFile } from '../dist/copy-file.js';
import chalk        from 'chalk';
import log          from 'fancy-log';

// Parameters
const validFlags = ['folder', 'quiet'];
const args =       process.argv.slice(2);
const flags =      args.filter(arg => /^--/.test(arg));
const flagMap =    Object.fromEntries(flags.map(flag => flag.replace(/^--/, '').split('=')));
const params =     args.filter(arg => !/^--/.test(arg));
const source =     params[0];
const target =     params[1];

// Reporting
const printReport = (result) => {
   const name =   chalk.gray('copy-file-util');
   const origin = chalk.blue.bold(result.origin);
   const dest =   chalk.magenta(result.dest);
   const arrow =  chalk.gray.bold(' ⟹  ');  //extra space for alignment
   const info =   chalk.white(`(${result.duration}ms)`);
   log(name, origin, arrow, dest, info);
   };

// Copy File
const exit =        (message) => (console.error('[copy-file]', message), process.exit(1));
const invalidFlag = Object.keys(flagMap).find(key => !validFlags.includes(key));
const mode =        { folder: 'folder' in flagMap, quiet: 'quiet' in flagMap };
const error =
   invalidFlag ?            'Invalid flag: ' + invalidFlag :
   params.length > 2 ?      'Extraneous parameter: ' + params[2] :
   !source ?                'Missing source file.' :
   !target && mode.folder ? 'Missing target folder.' :
   !target ?                'Missing target file.' :
   null;
if (error)
   exit(error);
const options = mode.folder ? { targetFolder: target } : { targetFile: target };
const result = copyFile.cp(source, options);
if (!mode.quiet)
   printReport(result);
