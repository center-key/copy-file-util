// copy-file-util ~~ MIT License

// Imports
import chalk from 'chalk';
import fs    from 'fs';
import log   from 'fancy-log';
import path  from 'path';
import slash from 'slash';

// Types
export type Settings = {
   cd:            string,   //change working directory before starting copy
   targetFile:    string,   //destination path for file copy operation
   targetFolder:  string,   //destination folder for file copy operation
   fileExtension: string,   //new file extension for the target file
   move:          boolean,  //delete the source file after copying it
   overwrite:     boolean,  //clobber target file if it exists
   };
export type Result = {
   origin:   string,   //path of origination file
   dest:     string,   //path of destination file
   duration: number,   //execution time in milliseconds
   moved:    boolean,  //original file was deleted
   skipped:  boolean,  //target file exists and was not overwritten
   };

const copyFile = {

   cp(sourceFile: string, options?: Partial<Settings>): Result {
      const defaults = {
         cd:            null,
         targetFile:    null,
         targetFolder:  null,
         fileExtension: null,
         move:          false,
         overwrite:     true,
         };
      const settings =        { ...defaults, ...options };
      const startTime =       Date.now();
      const missingTarget =   !settings.targetFile && !settings.targetFolder;
      const ambiguousTarget = !!settings.targetFile && !!settings.targetFolder;
      const normalize = (folder: string | null) =>
         !folder ? '' : slash(path.normalize(folder)).replace(/\/$/, '');
      const startFolder =    settings.cd ? normalize(settings.cd) + '/' : '';
      const source =         sourceFile ? normalize(startFolder + sourceFile) : '';
      const sourceExists =   source && fs.existsSync(source);
      const sourceIsFile =   sourceExists && fs.statSync(source).isFile();
      const sourceFilename = sourceIsFile ? path.basename(source) : null;
      const targetPath =     settings.targetFile ? path.dirname(settings.targetFile) : settings.targetFolder;
      const targetFolder =   targetPath ? normalize(startFolder + targetPath) : null;
      const targetFile =     settings.targetFile ?? settings.targetFolder + '/' + sourceFilename;
      const target =         normalize(startFolder + targetFile);
      const targetExists =   !missingTarget && fs.existsSync(target);
      const skip =           targetExists && !settings.overwrite;
      if (targetFolder)
         fs.mkdirSync(targetFolder, { recursive: true });
      const badTargetFolder = !targetFolder || !fs.existsSync(targetFolder);
      const errorMessage =
         settings.fileExtension ? 'Option "fileExtension" not yet implemented.' :
         !sourceFile ?            'Must specify the source file.' :
         !sourceExists ?          'Source file does not exist: ' + source :
         !sourceIsFile ?          'Source is not a file: ' + source :
         missingTarget ?          'Must specify a target file or folder.' :
         ambiguousTarget ?        'Target cannot be both a file and a folder.' :
         badTargetFolder ?        'Target folder cannot be written to: ' + targetFolder :
         null;
      if (errorMessage)
         throw Error('[copy-file-util] ' + errorMessage);
      if (!skip && settings.move)
         fs.renameSync(source, target);
      else if (!skip)
         fs.copyFileSync(source, target);
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
      const name =   chalk.gray('copy-file');
      const origin = chalk.blue.bold(result.origin);
      const dest =   chalk.magenta(result.dest);
      const arrow =  chalk.gray.bold('→');
      const status = result.skipped ? ', skip -- target exists' : result.moved ? ', move' : '';
      const info =   chalk.white(`(${result.duration}ms${status})`);
      log(name, origin, arrow, dest, info);
      return result;
      },

   };

export { copyFile };
