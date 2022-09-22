//! copy-file-util v0.0.2 ~~ https://github.com/center-key/copy-file-util ~~ MIT License

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
