// copy-file-cli ~~ MIT License

import fs from 'fs-extra';
import path from 'path';
import slash from 'slash';

export type Options = {
   targetFile?:    string,  //destination path for file copy operation
   targetFolder?:  string,  //destination folder for file copy operation
   fileExtension?: string,  //new file extension for the target file
   };
export type Result = {
   origin:   string,  //path of origination file
   dest:     string,  //path of destination file
   duration: number,  //execution time in milliseconds
   };

const copyFile = {

   cp(sourceFile: string, options: Options): Result {
      const defaults = {
         targetFile:    null,
         targetFolder:  null,
         fileExtension: null,
         };
      const settings = { ...defaults, ...options };
      const startTime = Date.now();
      const missingTarget =   !settings.targetFile && !settings.targetFolder;
      const ambiguousTarget = !!settings.targetFile && !!settings.targetFolder;
      const normalize = (folder: string | null) =>
         !folder ? '' : slash(path.normalize(folder)).replace(/\/$/, '');
      const source =       normalize(sourceFile);
      const sourceExists = fs.pathExistsSync(source);
      const sourceIsFile = sourceExists && fs.statSync(source).isFile();
      const targetFolder = normalize(settings.targetFile ? path.dirname(settings.targetFile) : settings.targetFolder);
      const target =       normalize(settings.targetFile ?? settings.targetFolder + '/' + path.basename(source));
      if (targetFolder)
         fs.ensureDirSync(targetFolder);
      const badTargetFolder = !fs.pathExistsSync(targetFolder);
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
         throw Error('[copy-file-cli] ' + errorMessage);
      fs.copySync(source, target);
      return {
         origin:   source,
         dest:     target,
         duration: Date.now() - startTime,
         };
      },

   };

export { copyFile };
