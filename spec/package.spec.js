// copy-file-util
// Package Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import fs from 'node:fs';

// Setup
import { copyFile } from '../dist/copy-file.js';

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
describe('Library version number', () => {

   it('follows semantic version formatting', () => {
      const version =  copyFile.version;
      const semVer =   /\d+[.]\d+[.]\d+/;
      const actual =   { version: version, valid: semVer.test(version) };
      const expected = { version: version, valid: true };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Library module', () => {

   const module = copyFile;

   it('is exported as an object', () => {
      const actual =   { type: typeof module };
      const expected = { type: 'object' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has the correct properties', () => {
      const actual = Object.keys(module).sort().map(key => [key, typeof module[key]]);
      const expected = [
         ['assertOk', 'function'],
         ['cli',      'function'],
         ['cp',       'function'],
         ['reporter', 'function'],
         ['version' , 'string'],
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });
