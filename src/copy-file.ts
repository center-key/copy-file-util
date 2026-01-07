// copy-file-util ~~ MIT License
//
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

// Imports
import { cliArgvUtil } from 'cli-argv-util';
import { dna } from 'dna-engine';
import { EOL } from 'node:os';
import chalk from 'chalk';
import fs    from 'fs';
import log   from 'fancy-log';
import path  from 'path';
import slash from 'slash';

// Types
export type Settings = {
   cd:            string | null,  //change working directory before starting copy
   targetFile:    string | null,  //destination path for file copy operation
   targetFolder:  string | null,  //destination folder for file copy operation
   fileExtension: string | null,  //new file extension for the target file
   move:          boolean,        //delete the source file after copying it
   overwrite:     boolean,        //clobber target file if it exists
   platformEol:   boolean,        //save target file with OS dependent line endings (\n on Unix and \r\n on Windows)
   removeSemVer:  boolean,        //deletes text like 'v1.2.3' to avoid noisy diffs
   };
export type Result = {
   origin:   string,   //path of origination file
   dest:     string,   //path of destination file
   duration: number,   //execution time in milliseconds
   moved:    boolean,  //original file was deleted
   skipped:  boolean,  //target file exists and was not overwritten
   };

const copyFile = {

   assert(ok: unknown, message: string | null) {
      if (!ok)
         throw new Error(`[copy-file-util] ${message}`);
      },

   cli() {
      const validFlags = ['cd', 'folder', 'move', 'no-overwrite', 'note', 'platform-eol',
         'quiet', 'remove-sem-ver'];
      const cli =    cliArgvUtil.parse(validFlags);
      const source = cli.params[0];
      const target = cli.params[1];
      const getPkgField = (substring: string) => {  //example: '{{package.version}}' --> '3.1.4'
         type Pkg =    { [key: string]: string };
         const pkg =   <Pkg>JSON.parse(fs.readFileSync('package.json', 'utf-8'));
         const value = dna.util.value({ package: pkg }, substring.replace(/[{}]/g, ''));
         return <string | undefined>value ?? 'MISSING-FIELD-ERROR';
         };
      const error =
         cli.invalidFlag ?              cli.invalidFlagMsg! :
         cli.paramCount > 2 ?           'Extraneous parameter: ' + cli.params[2]! :
         !source ?                      'Missing source file.' :
         !target && cli.flagOn.folder ? 'Missing target folder.' :
         !target ?                      'Missing target file.' :
         null;
      copyFile.assert(!error, error);
      const templateVariables = /{{[^{}]*}}/g;  //example match: "{{package.version}}"
      const targetValue = target!.replace(templateVariables, getPkgField);
      const options: Settings = {
         cd:            cli.flagMap.cd ?? null,
         targetFile:    !cli.flagOn.folder ? targetValue : null,
         targetFolder:  cli.flagOn.folder ? targetValue : null,
         fileExtension: null,
         move:          !!cli.flagOn.move,
         overwrite:     !cli.flagOn.noOverwrite,
         platformEol:   !!cli.flagOn.platformEol,
         removeSemVer:  !!cli.flagOn.removeSemVer,
         };
      const result = copyFile.cp(source!, options);
      if (!cli.flagOn.quiet)
         copyFile.reporter(result);
      },

   cp(sourceFile: string, options?: Partial<Settings>): Result {
      const defaults: Settings = {
         cd:            null,
         targetFile:    null,
         targetFolder:  null,
         fileExtension: null,
         move:          false,
         overwrite:     true,
         platformEol:   false,
         removeSemVer:  false,
         };
      const settings =       { ...defaults, ...options };
      const startTime =      Date.now();
      const missingTarget =  !settings.targetFile && !settings.targetFolder;
      const doubleTarget =   !!settings.targetFile && !!settings.targetFolder;
      const cleanUp =        (folder: string) => slash(path.normalize(folder)).replace(/\/$/, '');
      const cleanPath =      (folder: string | null) => !folder ? '' : cleanUp(folder);
      const startFolder =    settings.cd ? cleanPath(settings.cd) + '/' : '';
      const source =         sourceFile ? cleanPath(startFolder + sourceFile) : '';
      const sourceExists =   source && fs.existsSync(source);
      const sourceIsFile =   sourceExists && fs.statSync(source).isFile();
      const sourceFilename = sourceIsFile ? path.basename(source) : null;
      const targetPath =     settings.targetFile ? path.dirname(settings.targetFile) : settings.targetFolder;
      const targetFolder =   targetPath ? cleanPath(startFolder + targetPath) : null;
      const targetFile =     settings.targetFile ?? `${settings.targetFolder}/${sourceFilename}`;
      const target =         cleanPath(startFolder + targetFile);
      const targetExists =   !missingTarget && fs.existsSync(target);
      const skip =           targetExists && !settings.overwrite;
      if (targetFolder)
         fs.mkdirSync(targetFolder, { recursive: true });
      const badTargetFolder = !targetFolder || !fs.existsSync(targetFolder);
      const error =
         settings.fileExtension ? 'Option "fileExtension" not yet implemented.' :
         !sourceFile ?            'Must specify the source file.' :
         !sourceExists ?          'Source file does not exist: ' + source :
         !sourceIsFile ?          'Source is not a file: ' + source :
         missingTarget ?          'Must specify a target file or folder.' :
         doubleTarget ?           'Target cannot be both a file and a folder.' :
         badTargetFolder ?        'Target folder cannot be written to: ' + String(targetFolder) :
         null;
      copyFile.assert(!error, error);
      const rewriteTarget = () => {
         const semVer =   /\s+v[0-9]+\.[0-9]+\.[0-9]+\s+/;
         const content1 = fs.readFileSync(target, 'utf-8');
         const content2 = settings.platformEol ?  content1.replace(/\r?\n/g, EOL) : content1;
         const content3 = settings.removeSemVer ? content2.replace(semVer, ' ') :   content2;
         if (content1 !== content3)
            fs.writeFileSync(target, content3);
         }
      const createTarget = () => {
         if (settings.move)
            fs.renameSync(source, target);
         else
            fs.copyFileSync(source, target);
         if (settings.platformEol || settings.removeSemVer)
            rewriteTarget();
         };
      if (!skip)
         createTarget();
      return {
         origin:   source,
         dest:     target,
         moved:    settings.move,
         skipped:  skip,
         duration: Date.now() - startTime,
         };
      },

   reporter(result: Result): Result {
      // Example output:
      //    [10:52:42] copy-file build/app.js → dist/app.js (1ms, moved)
      const name =     chalk.gray('copy-file');
      const ancestor = cliArgvUtil.calcAncestor(result.origin, result.dest);
      const status =   result.skipped ? ', skip -- target exists' : result.moved ? ', move' : '';
      const info =     chalk.white(`(${result.duration}ms${status})`);
      log(name, ancestor.message, info);
      return result;
      },

   };

export { copyFile };
