//! copy-file-util v0.1.6 ~~ https://github.com/center-key/copy-file-util ~~ MIT License

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "path", "slash"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.copyFile = void 0;
    const fs_1 = __importDefault(require("fs"));
    const path_1 = __importDefault(require("path"));
    const slash_1 = __importDefault(require("slash"));
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
            const normalize = (folder) => !folder ? '' : (0, slash_1.default)(path_1.default.normalize(folder)).replace(/\/$/, '');
            const startFolder = settings.cd ? normalize(settings.cd) + '/' : '';
            const source = sourceFile ? normalize(startFolder + sourceFile) : '';
            const sourceExists = source && fs_1.default.existsSync(source);
            const sourceIsFile = sourceExists && fs_1.default.statSync(source).isFile();
            const sourceFilename = sourceIsFile ? path_1.default.basename(source) : null;
            const targetPath = settings.targetFile ? path_1.default.dirname(settings.targetFile) : settings.targetFolder;
            const targetFolder = targetPath ? normalize(startFolder + targetPath) : null;
            const targetFile = (_a = settings.targetFile) !== null && _a !== void 0 ? _a : settings.targetFolder + '/' + sourceFilename;
            const target = normalize(startFolder + targetFile);
            if (targetFolder)
                fs_1.default.mkdirSync(targetFolder, { recursive: true });
            const badTargetFolder = !targetFolder || !fs_1.default.existsSync(targetFolder);
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
            fs_1.default.copyFileSync(source, target);
            return {
                origin: source,
                dest: target,
                duration: Date.now() - startTime,
            };
        },
    };
    exports.copyFile = copyFile;
});
