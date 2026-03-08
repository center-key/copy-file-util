// copy-file-util
// Error Handling Specification Suite

// Imports
import assert from 'assert';

// Setup
import { copyFile } from '../dist/copy-file.js';

////////////////////////////////////////////////////////////////////////////////
describe('Correct error is thrown', () => {

   it('when the "source" file is missing', () => {
      const makeBogusCall = () => copyFile.cp();
      const exception =     { message: '[copy-file-util] Must specify the source file.' };
      assert.throws(makeBogusCall, exception);
      });

   it('when the "target" is missing', () => {
      const source =        'spec/fixtures/mock.html';
      const makeBogusCall = () => copyFile.cp(source);
      const exception =     { message: '[copy-file-util] Must specify a target file or folder.' };
      assert.throws(makeBogusCall, exception);
      });

   });
