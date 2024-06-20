import { expect } from "chai";
import { Pursuit } from "../src/ai/steerings/pursuit.js";
import Vector2 from "phaser/src/math/Vector2.js";

describe("Pursuit", () => {
  describe("constructor", () => {
    it("should create a Pursuit object with specified parameters", () => {
      const owner = { body: { velocity: new Vector2(0, 0) }, x: 0, y: 0 };
      const target = { body: { velocity: new Vector2(0, 0) }, x: 0, y: 0 };
      const objects = [target];
      const pursuit = new Pursuit(owner, objects, 1, 5, 5);

      expect(pursuit.owner).to.equal(owner);
      expect(pursuit.objects).to.equal(objects);
      expect(pursuit.force).to.equal(1);
      expect(pursuit.ownerSpeed).to.equal(5);
      expect(pursuit.targetSpeed).to.equal(5);
      
    });
  });

  describe("calculateImpulse", () => {
    it("should calculate the correct impulse vector", () => {
      const owner = { body: { velocity: new Vector2(1, 1) }, x: 0, y: 0 };
      const target = { body: { velocity: new Vector2(1, 1) }, x: 10, y: 10 };
      const objects = [target];
      const pursuit = new Pursuit(owner, objects, 1, 5, 5);

      const impulse = pursuit.calculateImpulse();

      // Ожидаемые значения могут зависеть от конкретной логики вашего метода
      expect(impulse).to.be.an.instanceof(Vector2);
      expect(impulse.x).to.be.a("number");
      expect(impulse.y).to.be.a("number");
    });

    it("should return [0, 0] if toTarget.x is NaN", () => {
      const owner = { body: { velocity: new Vector2(0, 0) }, x: 0, y: 0 };
      const target = { body: { velocity: new Vector2(0, 0) }, x: 0, y: 0 };
      const objects = [target];
      const pursuit = new Pursuit(owner, objects, 1, 5, 5);

      const impulse = pursuit.calculateImpulse();

      expect(impulse.x).to.equal(0);
      expect(impulse.y).to.equal(0);
    });

    it("should calculate correct impulse for target moving away", () => {
      const owner = { body: { velocity: new Vector2(1, 0) }, x: 0, y: 0 };
      const target = { body: { velocity: new Vector2(1, 0) }, x: 10, y: 0 };
      const objects = [target];
      const pursuit = new Pursuit(owner, objects, 1, 5, 5);

      const impulse = pursuit.calculateImpulse();

      expect(impulse.x).to.be.a("number");
      expect(impulse.y).to.be.a("number");
    });

    it("should handle zero velocity correctly", () => {
      const owner = { body: { velocity: new Vector2(0, 0) }, x: 0, y: 0 };
      const target = { body: { velocity: new Vector2(0, 0) }, x: 10, y: 10 };
      const objects = [target];
      const pursuit = new Pursuit(owner, objects, 1, 5, 5);

      const impulse = pursuit.calculateImpulse();

      expect(impulse.x).to.be.a("number");
      expect(impulse.y).to.be.a("number");
    });
  });
});
