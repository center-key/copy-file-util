// copy-file-util
// CLI Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { cliArgvUtil } from 'cli-argv-util';
import fs from 'node:fs';

// Setup
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

////////////////////////////////////////////////////////////////////////////////
describe('Executing the CLI', () => {
   const run = (posix) => cliArgvUtil.run(pkg, posix);

   it('with template variables correctly inserts values from "package.json"', () => {
      run('copy-file --cd=spec fixtures/mock.html target/{{package.type}}/{{package.name}}-v{{package.version}}.html');
      const actual =   fs.readdirSync('spec/target/module');
      const expected = ['copy-file-util-v' + pkg.version + '.html'];
      assertDeepStrictEqual(actual, expected);
      });

   it('to move a file correctly deletes the source file', () => {
      run('copy-file spec/fixtures/mock.html --folder spec/target/move/a');
      run('copy-file spec/target/move/a/mock.html --move --folder spec/target/move/b');
      const actual =   cliArgvUtil.readFolder('spec/target/move');
      const expected = [
         'a',
         'b',
         'b/mock.html',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   it('with the --no-overwrite flag prevents the target file from being clobbered', () => {
      run('copy-file spec/fixtures/mock.html spec/target/skip/mock1.html --no-overwrite --quiet');
      run('copy-file spec/fixtures/mock.html spec/target/skip/mock2.html --no-overwrite --quiet');
      run('copy-file spec/target/skip/mock1.html spec/target/skip/mock2.html --move --no-overwrite');
      const actual =   cliArgvUtil.readFolder('spec/target/skip');
      const expected = [
         'mock1.html',
         'mock2.html',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   it('with the --remove-sem-ver flag removes the version number from the file header', () => {
      run('copy-file dist/copy-file.d.ts --folder spec/target/no-sem-ver --remove-sem-ver');
      const actual =   fs.readdirSync('spec/target/no-sem-ver');
      const expected = ['copy-file.d.ts'];
      assertDeepStrictEqual(actual, expected);
      });

   });
