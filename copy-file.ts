// copy-file-util ~~ MIT License

// Imports
import fs    from 'fs';
import path  from 'path';
import slash from 'slash';

// Types
export type Settings = {
   cd:            string,   //change working directory before starting copy
   targetFile:    string,   //destination path for file copy operation
   targetFolder:  string,   //destination folder for file copy operation
   fileExtension: string,   //new file extension for the target file
   move:          boolean,  //delete the source file after copying it
   };
export type Result = {
   origin:   string,   //path of origination file
   dest:     string,   //path of destination file
   duration: number,   //execution time in milliseconds
   moved:    boolean,  //original file was deleted
   };

const copyFile = {

   cp(sourceFile: string, options?: Partial<Settings>): Result {
      const defaults = {
         cd:            null,
         targetFile:    null,
         targetFolder:  null,
         fileExtension: null,
         move:          false,
         };
      const settings = { ...defaults, ...options };
      const startTime = Date.now();
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
      if (settings.move)
         fs.renameSync(source, target);
      else
         fs.copyFileSync(source, target);
      return {
         origin:   source,
         dest:     target,
         moved:    settings.move,
         duration: Date.now() - startTime,
         };
      },

   };

export { copyFile };
