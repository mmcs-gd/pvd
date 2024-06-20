import { expect } from "chai";
import Vector2 from "phaser/src/math/Vector2.js";
import Steering from "../src/ai/steerings/steering.js";

describe("Steering", () => {
  describe("constructor", () => {
    it("should create a Steering object with specified parameters", () => {
      const owner = { name: "owner" };
      const objects = [{ name: "object1" }, { name: "object2" }];
      const force = 1.5;
      const steering = new Steering(owner, objects, force);

      expect(steering.owner).to.equal(owner);
      expect(steering.objects).to.equal(objects);
      expect(steering.force).to.equal(force);
    });

    it("should create a Steering object with default force when not specified", () => {
      const owner = { name: "owner" };
      const objects = [{ name: "object1" }, { name: "object2" }];
      const steering = new Steering(owner, objects);

      expect(steering.owner).to.equal(owner);
      expect(steering.objects).to.equal(objects);
      expect(steering.force).to.equal(1); // Значение по умолчанию
    });
  });

  describe("calculateImpulse", () => {
    it("return a Vector2 object with (0, 0)", () => {
      const owner = { name: "owner" };
      const objects = [{ name: "object1" }, { name: "object2" }];
      const steering = new Steering(owner, objects);

      const impulse = steering.calculateImpulse();

      expect(impulse).to.be.an.instanceof(Vector2);
      expect(impulse.x).to.equal(0);
      expect(impulse.y).to.equal(0);
    });
  });
});
