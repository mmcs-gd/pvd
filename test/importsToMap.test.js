// test/importsToMap.test.js

import { expect } from 'chai';
import { importsToMap } from '../src/utils/resource-loaders/importsToMap.js';

describe('importsToMap', () => {
    it('should convert imports to a map with relative paths', () => {
      const imports = {
        'http://example.com/assets/image1.png': '/assets/image1.png',
        'http://example.com/assets/image2.png': '/assets/image2.png',
        'http://example.com/assets/spritesheet.json': '/assets/spritesheet.json',
      };
      const baseUrl = 'http://example.com/assets/';
  
      const result = importsToMap(imports, baseUrl);
  
      expect(result).to.deep.equal({
        'image1': '/image1.png',
        'image2': '/image2.png',
        'spritesheet': '/spritesheet.json',
      });
    });
  
    it('should handle different base URLs', () => {
      const imports = {
        'http://example.com/assets/image1.png': '/assets/image1.png',
        'http://example.com/assets/image2.png': '/assets/image2.png',
      };
      const baseUrl = 'http://example.com/assets/';
  
      const result = importsToMap(imports, baseUrl);
  
      expect(result).to.deep.equal({
        'image1': '/image1.png',
        'image2': '/image2.png',
      });
    });
  
    it('should handle different file extensions', () => {
      const imports = {
        'http://example.com/assets/image1.png': '/assets/image1.png',
        'http://example.com/assets/image2.jpg': '/assets/image2.jpg',
        'http://example.com/assets/spritesheet.json': '/assets/spritesheet.json',
      };
      const baseUrl = 'http://example.com/assets/';
  
      const result = importsToMap(imports, baseUrl);
  
      expect(result).to.deep.equal({
        'image1': '/image1.png',
        'image2': '/image2.jpg',
        'spritesheet': '/spritesheet.json',
      });
    });
  });
