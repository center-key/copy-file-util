//! copy-file-util v0.1.1 ~~ https://github.com/center-key/copy-file-util ~~ MIT License

import fs from 'fs-extra';
import path from 'path';
import slash from 'slash';
const copyFile = {
    cp(sourceFile, options) {
        var _a;
        const defaults = {
            cd: null,
            targetFile: null,
            targetFolder: null,
            fileExtension: null,
        };
        const settings = Object.assign(Object.assign({}, defaults), options);
        const startTime = Date.now();
        const missingTarget = !settings.targetFile && !settings.targetFolder;
        const ambiguousTarget = !!settings.targetFile && !!settings.targetFolder;
        const normalize = (folder) => !folder ? '' : slash(path.normalize(folder)).replace(/\/$/, '');
        const startFolder = settings.cd ? normalize(settings.cd) + '/' : '';
        const source = normalize(startFolder + sourceFile);
        const sourceExists = fs.pathExistsSync(source);
        const sourceIsFile = sourceExists && fs.statSync(source).isFile();
        const targetPath = settings.targetFile ? path.dirname(settings.targetFile) : settings.targetFolder;
        const targetFolder = normalize(startFolder + targetPath);
        const targetFile = (_a = settings.targetFile) !== null && _a !== void 0 ? _a : settings.targetFolder + '/' + path.basename(source);
        const target = normalize(startFolder + targetFile);
        if (targetFolder)
            fs.ensureDirSync(targetFolder);
        const badTargetFolder = !fs.pathExistsSync(targetFolder);
        const errorMessage = settings.fileExtension ? 'Option "fileExtension" not yet implemented.' :
            !sourceFile ? 'Must specify the source file.' :
                !sourceExists ? 'Source file does not exist: ' + source :
                    !sourceIsFile ? 'Source is not a file: ' + source :
                        missingTarget ? 'Must specify a target file or folder.' :
                            ambiguousTarget ? 'Target cannot be both a file and a folder.' :
                                badTargetFolder ? 'Target folder cannot be written to: ' + targetFolder :
                                    null;
        if (errorMessage)
            throw Error('[copy-file-util] ' + errorMessage);
        fs.copySync(source, target);
        return {
            origin: source,
            dest: target,
            duration: Date.now() - startTime,
        };
    },
};
export { copyFile };
