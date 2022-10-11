// copy-file-util
// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { execSync } from 'node:child_process';
import assert from 'assert';
import fs     from 'fs';

// Setup
import { copyFile } from '../dist/copy-file.js';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual = fs.readdirSync('dist').sort();
      const expected = [
         'copy-file.d.ts',
         'copy-file.js',
         'copy-file.umd.cjs',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Library module', () => {

   it('is an object', () => {
      const actual =   { constructor: copyFile.constructor.name };
      const expected = { constructor: 'Object' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has a cp() function', () => {
      const actual =   { validate: typeof copyFile.cp };
      const expected = { validate: 'function' };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Executing the CLI', () => {

   it('with template variables correctly inserts values from "package.json"', () => {
      const cmd = 'node bin/cli.js --cd=spec/fixtures source/mock.txt target/{{pkg.type}}/{{pkg.name}}-v{{pkg.version}}.txt';
      execSync(cmd);
      const actual =   fs.readdirSync('spec/fixtures/target/module');
      const expected = ['copy-file-util-v' + pkg.version + '.txt'];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Calling copyFile.cp()', () => {

   it('with a target file correctly renames a file', () => {
      const source = 'spec/fixtures/source/mock.txt';
      const target = 'spec/fixtures/target/to-file/mock2.txt';
      copyFile.cp(source, { targetFile: target });
      const actual =   fs.readdirSync('spec/fixtures/target/to-file');
      const expected = ['mock2.txt'];
      assertDeepStrictEqual(actual, expected);
      });

   it('with a target folder copies a file to the correct folder', () => {
      const source = 'spec/fixtures/source/mock.txt';
      const target = 'spec/fixtures/target/to-folder';
      copyFile.cp(source, { targetFolder: target });
      const actual =   fs.readdirSync('spec/fixtures/target/to-folder');
      const expected = ['mock.txt'];
      assertDeepStrictEqual(actual, expected);
      });

   it('with "cd" set copies the file to the correct folder', () => {
      const source = 'source/mock.txt';
      const target = 'target/cd';
      copyFile.cp(source, { cd: 'spec/fixtures', targetFolder: target });
      const actual =   fs.readdirSync('spec/fixtures/target/cd');
      const expected = ['mock.txt'];
      assertDeepStrictEqual(actual, expected);
      });

   it('with "cd" set correctly renames the file', () => {
      const source = 'source/mock.txt';
      const target = 'target/cd-rename/mock2.txt';
      copyFile.cp(source, { cd: 'spec/fixtures', targetFile: target });
      const actual =   fs.readdirSync('spec/fixtures/target/cd-rename');
      const expected = ['mock2.txt'];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Correct error is thrown', () => {

   it('when the "source" file is missing', () => {
      const makeBogusCall = () => copyFile.cp();
      const exception =     { message: '[copy-file-util] Must specify the source file.' };
      assert.throws(makeBogusCall, exception);
      });

   it('when the "target" is missing', () => {
      const source = 'spec/fixtures/source/mock.txt';
      const makeBogusCall = () => copyFile.cp(source);
      const exception =     { message: '[copy-file-util] Must specify a target file or folder.' };
      assert.throws(makeBogusCall, exception);
      });

   });
