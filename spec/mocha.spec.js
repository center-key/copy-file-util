// copy-file-util
// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { readdirSync } from 'fs';
import assert from 'assert';
import slash from 'slash';

// Setup
import { copyFile } from '../dist/copy-file.js';

// Utilities
const readDirSync = (folder) => readdirSync(folder).map(file => slash(file)).sort();

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual = readDirSync('dist');
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
describe('Calling copyFile.cp()', () => {

   it('with a target file correctly copies a file', () => {
      const source = 'spec/fixtures/source/mock.txt';
      const target = 'spec/fixtures/target/to-file/mock2.txt';
      copyFile.cp(source, { targetFile: target });
      const actual =   readDirSync('spec/fixtures/target/to-file');
      const expected = ['mock2.txt'];
      assertDeepStrictEqual(actual, expected);
      });

   it('with a target folder copies a file to the correct folder', () => {
      const source = 'spec/fixtures/source/mock.txt';
      const target = 'spec/fixtures/target/to-folder';
      copyFile.cp(source, { targetFolder: target });
      const actual =   readDirSync('spec/fixtures/target/to-folder');
      const expected = ['mock.txt'];
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
