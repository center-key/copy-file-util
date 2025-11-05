// copy-file-util
// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { cliArgvUtil } from 'cli-argv-util';
import assert from 'assert';
import fs     from 'fs';

// Setup
import { copyFile } from '../dist/copy-file.js';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual = fs.readdirSync('dist').sort();
      const expected = [
         'copy-file.d.ts',
         'copy-file.js',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Library module', () => {

   it('is an object', () => {
      const actual =   { constructor: copyFile.constructor.name };
      const expected = { constructor: 'Object' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has functions named cli(), cp(), and reporter()', () => {
      const module = copyFile;
      const actual = Object.keys(module).sort().map(key => [key, typeof module[key]]);
      const expected = [
         ['cli',      'function'],
         ['cp',       'function'],
         ['reporter', 'function'],
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Calling copyFile.cp()', () => {

   it('with a target file correctly renames a file', () => {
      const source = 'spec/fixtures/mock.html';
      const target = 'spec/target/to-file/mock2.html';
      copyFile.cp(source, { targetFile: target });
      const actual =   fs.readdirSync('spec/target/to-file');
      const expected = ['mock2.html'];
      assertDeepStrictEqual(actual, expected);
      });

   it('with a target folder copies a file to the correct folder', () => {
      const source = 'spec/fixtures/mock.html';
      const target = 'spec/target/to-folder';
      copyFile.cp(source, { targetFolder: target });
      const actual =   fs.readdirSync('spec/target/to-folder');
      const expected = ['mock.html'];
      assertDeepStrictEqual(actual, expected);
      });

   it('with "cd" set copies the file to the correct folder', () => {
      const source = 'fixtures/mock.html';
      const target = 'target/cd';
      copyFile.cp(source, { cd: 'spec', targetFolder: target });
      const actual =   fs.readdirSync('spec/target/cd');
      const expected = ['mock.html'];
      assertDeepStrictEqual(actual, expected);
      });

   it('with "cd" set correctly renames the file', () => {
      const source = 'fixtures/mock.html';
      const target = 'target/cd-rename/mock2.html';
      copyFile.cp(source, { cd: 'spec', targetFile: target });
      const actual =   fs.readdirSync('spec/target/cd-rename');
      const expected = ['mock2.html'];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Correct error is thrown', () => {

   it('when the "source" file is missing', () => {
      const makeBogusCall = () => copyFile.cp();
      const exception =     { message: '[copy-file-util] Must specify the source file.' };
      assert.throws(makeBogusCall, exception);
      });

   it('when the "target" is missing', () => {
      const source = 'spec/fixtures/mock.html';
      const makeBogusCall = () => copyFile.cp(source);
      const exception =     { message: '[copy-file-util] Must specify a target file or folder.' };
      assert.throws(makeBogusCall, exception);
      });

   });

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

   });
