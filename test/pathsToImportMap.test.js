// test/pathsToImportMap.test.js

import { expect } from 'chai';
import { pathsToImportMap } from '../src/utils/adapters/paths-to-import-map.js';

describe('pathsToImportMap', () => {
  it('should return an empty object when the array is empty', () => {
    const result = pathsToImportMap([], /pattern/);
    expect(result).to.deep.equal({});
  });

  it('should return an empty object when no strings match the pattern', () => {
    const array = ['foo', 'bar', 'baz'];
    const pattern = /qux/;
    const result = pathsToImportMap(array, pattern);
    expect(result).to.deep.equal({});
  });

  it('return an object with matched strings as keys and original strings as values', () => {
    const array = ['src/module1.js', 'src/module2.js', 'src/utils/helper.js'];
    const pattern = /src\/(module[0-9]+)\.js/;
    const result = pathsToImportMap(array, pattern);

    const expected = {
      'src/module1.js': 'src/module1.js',
      'src/module2.js': 'src/module2.js',
    };

    expect(result).to.deep.equal(expected);
  });

  it('handle multiple matches correctly', () => {
    const array = ['src/module1.js', 'src/module1.js', 'src/utils/helper.js'];
    const pattern = /src\/(module[0-9]+)\.js/;
    const result = pathsToImportMap(array, pattern);

    const expected = {
      'src/module1.js': 'src/module1.js',
    };

    expect(result).to.deep.equal(expected);
  });

  it('handle different patterns correctly', () => {
    const array = ['assets/img1.png', 'assets/img2.jpg', 'assets/img3.gif'];
    const pattern = /assets\/(img[0-9]+\.(png|jpg))/;
    const result = pathsToImportMap(array, pattern);

    const expected = {
      'assets/img1.png': 'assets/img1.png',
      'assets/img2.jpg': 'assets/img2.jpg',
    };

    expect(result).to.deep.equal(expected);
  });
});
