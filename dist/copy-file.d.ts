//! copy-file-util v0.1.3 ~~ https://github.com/center-key/copy-file-util ~~ MIT License

export declare type Settings = {
    cd: string;
    targetFile: string;
    targetFolder: string;
    fileExtension: string;
};
export declare type Options = Partial<Settings>;
export declare type Result = {
    origin: string;
    dest: string;
    duration: number;
};
declare const copyFile: {
    cp(sourceFile: string, options: Options): Result;
};
export { copyFile };
