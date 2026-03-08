// copy-file-util
// Function cp() Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import fs from 'fs';

// Setup
import { copyFile } from '../dist/copy-file.js';

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
