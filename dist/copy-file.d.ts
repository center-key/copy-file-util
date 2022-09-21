//! copy-file-cli v0.0.1 ~~ https://github.com/center-key/copy-file-cli ~~ MIT License

export declare type Options = {
    targetFile?: string;
    targetFolder?: string;
    fileExtension?: string;
};
export declare type Result = {
    origin: string;
    dest: string;
    duration: number;
};
declare const copyFile: {
    cp(sourceFile: string, options: Options): Result;
};
export { copyFile };
