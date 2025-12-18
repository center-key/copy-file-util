//! copy-file-util v1.3.3 ~~ https://github.com/center-key/copy-file-util ~~ MIT License

import { cliArgvUtil } from 'cli-argv-util';
import { dna } from 'dna-engine';
import { EOL } from 'node:os';
import chalk from 'chalk';
import fs from 'fs';
import log from 'fancy-log';
import path from 'path';
import slash from 'slash';
const copyFile = {
    assert(ok, message) {
        if (!ok)
            throw new Error(`[copy-file-util] ${message}`);
    },
    cli() {
        const validFlags = ['cd', 'folder', 'move', 'no-overwrite', 'note', 'platform-eol', 'quiet'];
        const cli = cliArgvUtil.parse(validFlags);
        const source = cli.params[0];
        const target = cli.params[1];
        const getPkgField = (substring) => {
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
            const value = dna.util.value({ package: pkg }, substring.replace(/[{}]/g, ''));
            return value ?? 'MISSING-FIELD-ERROR';
        };
        const error = cli.invalidFlag ? cli.invalidFlagMsg :
            cli.paramCount > 2 ? 'Extraneous parameter: ' + cli.params[2] :
                !source ? 'Missing source file.' :
                    !target && cli.flagOn.folder ? 'Missing target folder.' :
                        !target ? 'Missing target file.' :
                            null;
        copyFile.assert(!error, error);
        const templateVariables = /{{[^{}]*}}/g;
        const targetValue = target.replace(templateVariables, getPkgField);
        const options = {
            cd: cli.flagMap.cd ?? null,
            targetFile: !cli.flagOn.folder ? targetValue : null,
            targetFolder: cli.flagOn.folder ? targetValue : null,
            fileExtension: null,
            move: !!cli.flagOn.move,
            overwrite: !cli.flagOn.noOverwrite,
            platformEol: !!cli.flagOn.platformEol,
        };
        const result = copyFile.cp(source, options);
        if (!cli.flagOn.quiet)
            copyFile.reporter(result);
    },
    cp(sourceFile, options) {
        const defaults = {
            cd: null,
            targetFile: null,
            targetFolder: null,
            fileExtension: null,
            move: false,
            overwrite: true,
            platformEol: false,
        };
        const settings = { ...defaults, ...options };
        const startTime = Date.now();
        const missingTarget = !settings.targetFile && !settings.targetFolder;
        const doubleTarget = !!settings.targetFile && !!settings.targetFolder;
        const cleanUp = (folder) => slash(path.normalize(folder)).replace(/\/$/, '');
        const cleanPath = (folder) => !folder ? '' : cleanUp(folder);
        const startFolder = settings.cd ? cleanPath(settings.cd) + '/' : '';
        const source = sourceFile ? cleanPath(startFolder + sourceFile) : '';
        const sourceExists = source && fs.existsSync(source);
        const sourceIsFile = sourceExists && fs.statSync(source).isFile();
        const sourceFilename = sourceIsFile ? path.basename(source) : null;
        const targetPath = settings.targetFile ? path.dirname(settings.targetFile) : settings.targetFolder;
        const targetFolder = targetPath ? cleanPath(startFolder + targetPath) : null;
        const targetFile = settings.targetFile ?? `${settings.targetFolder}/${sourceFilename}`;
        const target = cleanPath(startFolder + targetFile);
        const targetExists = !missingTarget && fs.existsSync(target);
        const skip = targetExists && !settings.overwrite;
        if (targetFolder)
            fs.mkdirSync(targetFolder, { recursive: true });
        const badTargetFolder = !targetFolder || !fs.existsSync(targetFolder);
        const error = settings.fileExtension ? 'Option "fileExtension" not yet implemented.' :
            !sourceFile ? 'Must specify the source file.' :
                !sourceExists ? 'Source file does not exist: ' + source :
                    !sourceIsFile ? 'Source is not a file: ' + source :
                        missingTarget ? 'Must specify a target file or folder.' :
                            doubleTarget ? 'Target cannot be both a file and a folder.' :
                                badTargetFolder ? 'Target folder cannot be written to: ' + String(targetFolder) :
                                    null;
        copyFile.assert(!error, error);
        const createTarget = () => {
            if (settings.move)
                fs.renameSync(source, target);
            else
                fs.copyFileSync(source, target);
            const platformEol = (text) => text.replace(/\r?\n/g, EOL);
            if (settings.platformEol)
                fs.writeFileSync(target, platformEol(fs.readFileSync(target, 'utf-8')));
        };
        if (!skip)
            createTarget();
        return {
            origin: source,
            dest: target,
            moved: settings.move,
            skipped: skip,
            duration: Date.now() - startTime,
        };
    },
    reporter(result) {
        const name = chalk.gray('copy-file');
        const ancestor = cliArgvUtil.calcAncestor(result.origin, result.dest);
        const status = result.skipped ? ', skip -- target exists' : result.moved ? ', move' : '';
        const info = chalk.white(`(${result.duration}ms${status})`);
        log(name, ancestor.message, info);
        return result;
    },
};
export { copyFile };
