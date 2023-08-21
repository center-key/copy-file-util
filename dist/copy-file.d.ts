//! copy-file-util v1.1.1 ~~ https://github.com/center-key/copy-file-util ~~ MIT License

export type Options = {
    cd: string;
    targetFile: string;
    targetFolder: string;
    fileExtension: string;
    move: boolean;
};
export type Result = {
    origin: string;
    dest: string;
    duration: number;
    moved: boolean;
};
declare const copyFile: {
    cp(sourceFile: string, options: Partial<Options>): Result;
};
export { copyFile };
