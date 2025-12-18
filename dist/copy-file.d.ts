//! copy-file-util v1.3.3 ~~ https://github.com/center-key/copy-file-util ~~ MIT License

export type Settings = {
    cd: string | null;
    targetFile: string | null;
    targetFolder: string | null;
    fileExtension: string | null;
    move: boolean;
    overwrite: boolean;
    platformEol: boolean;
};
export type Result = {
    origin: string;
    dest: string;
    duration: number;
    moved: boolean;
    skipped: boolean;
};
declare const copyFile: {
    assert(ok: unknown, message: string | null): void;
    cli(): void;
    cp(sourceFile: string, options?: Partial<Settings>): Result;
    reporter(result: Result): Result;
};
export { copyFile };
