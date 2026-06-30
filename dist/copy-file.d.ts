//! copy-file-util v1.3.7 ~~ https://github.com/center-key/copy-file-util ~~ MIT License

export type Settings = {
    cd: string | null;
    targetFile: string | null;
    targetFolder: string | null;
    fileExtension: string | null;
    move: boolean;
    overwrite: boolean;
    platformEol: boolean;
    removeSemVer: boolean;
};
export type Result = {
    origin: string;
    dest: string;
    duration: number;
    moved: boolean;
    skipped: boolean;
};
declare const copyFile: {
    version: string;
    assertOk(ok: unknown, message: string | null): void;
    cp(sourceFile: string, options?: Partial<Settings>): Result;
    reporter(result: Result): Result;
    cli(): void;
};
export { copyFile };
