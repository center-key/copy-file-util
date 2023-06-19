//! copy-file-util v1.0.1 ~~ https://github.com/center-key/copy-file-util ~~ MIT License

export type Settings = {
    cd: string;
    targetFile: string;
    targetFolder: string;
    fileExtension: string;
};
export type Options = Partial<Settings>;
export type Result = {
    origin: string;
    dest: string;
    duration: number;
};
declare const copyFile: {
    cp(sourceFile: string, options: Options): Result;
};
export { copyFile };
