// test/inventory.test.js

import { expect } from "chai";
import Inventory from "../src/inventory.js";

describe("Inventory", () => {
  describe("constructor", () => {
    it("should create an Inventory object with specified initial money", () => {
      const inventory = new Inventory(100);
      expect(inventory.money).to.equal(100);
    });

    it("should initialize an empty array of penguins", () => {
      const inventory = new Inventory(100);
      expect(inventory.penguins).to.be.an("array").that.is.empty;
    });

    it("should initialize an empty array of guns", () => {
      const inventory = new Inventory(100);
      expect(inventory.guns).to.be.an("array").that.is.empty;
    });
  });

  describe("adding penguins and guns", () => {
    let inventory;

    beforeEach(() => {
      inventory = new Inventory(100);
    });
  });
});
