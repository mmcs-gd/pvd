// Импортируем необходимые зависимости
import { expect } from "chai";
import { MapGenManager2 } from "../src/systems/MapGenManager2.js";

  describe('MapGenManager2 class', () => {
    it('create an instance with specified width and height', () => {
      const width = 10;
      const height = 15;
      const manager = new MapGenManager2(width, height);
      expect(manager.width).to.equal(width);
      expect(manager.height).to.equal(height);
    });
  
    it('create an instance with minimum width and height if specified values are too small', () => {
      const manager = new MapGenManager2(2, 3);
      expect(manager.width).to.equal(5);
      expect(manager.height).to.equal(6);
    });
  
    it('initialize ground, floor, walls, decals, upper, and leaves arrays', () => {
      const manager = new MapGenManager2(5, 6);
      expect(manager.ground).to.be.an('array').that.has.lengthOf(6);
      expect(manager.floor).to.be.an('array').that.has.lengthOf(6);
      expect(manager.walls).to.be.an('array').that.has.lengthOf(6);
      expect(manager.decals).to.be.an('array').that.has.lengthOf(6);
      expect(manager.upper).to.be.an('array').that.has.lengthOf(6);
      expect(manager.leaves).to.be.an('array').that.has.lengthOf(6);
    });
  
    it(' generate ground with correct values', () => {
      const manager = new MapGenManager2(5, 6);
      for (let i = 0; i < manager.height; i++) {
        for (let j = 0; j < manager.width; j++) {
          expect(manager.ground[i][j]).to.equal(MapGenManager2.codes.ground);
        }
      }
    });
  
    it('generate floor with random values', () => {
      const manager = new MapGenManager2(5, 6);
      for (let i = 0; i < manager.height; i++) {
        for (let j = 0; j < manager.width; j++) {
          expect(MapGenManager2.codes.floor.fulls).to.include(manager.floor[i][j]);
        }
      }
    });
  });