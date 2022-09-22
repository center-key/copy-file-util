//! copy-file-util v0.0.2 ~~ https://github.com/center-key/copy-file-util ~~ MIT License

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs-extra", "path", "slash"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.copyFile = void 0;
    const fs_extra_1 = __importDefault(require("fs-extra"));
    const path_1 = __importDefault(require("path"));
    const slash_1 = __importDefault(require("slash"));
    const copyFile = {
        cp(sourceFile, options) {
            var _a;
            const defaults = {
                targetFile: null,
                targetFolder: null,
                fileExtension: null,
            };
            const settings = Object.assign(Object.assign({}, defaults), options);
            const startTime = Date.now();
            const missingTarget = !settings.targetFile && !settings.targetFolder;
            const ambiguousTarget = !!settings.targetFile && !!settings.targetFolder;
            const normalize = (folder) => !folder ? '' : (0, slash_1.default)(path_1.default.normalize(folder)).replace(/\/$/, '');
            const source = normalize(sourceFile);
            const sourceExists = fs_extra_1.default.pathExistsSync(source);
            const sourceIsFile = sourceExists && fs_extra_1.default.statSync(source).isFile();
            const targetFolder = normalize(settings.targetFile ? path_1.default.dirname(settings.targetFile) : settings.targetFolder);
            const target = normalize((_a = settings.targetFile) !== null && _a !== void 0 ? _a : settings.targetFolder + '/' + path_1.default.basename(source));
            if (targetFolder)
                fs_extra_1.default.ensureDirSync(targetFolder);
            const badTargetFolder = !fs_extra_1.default.pathExistsSync(targetFolder);
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
            fs_extra_1.default.copySync(source, target);
            return {
                origin: source,
                dest: target,
                duration: Date.now() - startTime,
            };
        },
    };
    exports.copyFile = copyFile;
});
