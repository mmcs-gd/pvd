import { expect } from "chai";
import BuyItem from "../src/buy-item.js";

describe("BuyItem", () => {
  describe("constructor", () => {
    it("should create a BuyItem object with specified price", () => {
      const item = new BuyItem(50, "A cool item", "itemSprite");
      expect(item.price).to.equal(50);
    });

    it("should create a BuyItem object with specified description", () => {
      const item = new BuyItem(50, "A cool item", "itemSprite");
      expect(item.description).to.equal("A cool item");
    });

    it("should create a BuyItem object with specified spriteName", () => {
      const item = new BuyItem(50, "A cool item", "itemSprite");
      expect(item.spriteName).to.equal("itemSprite");
    });

    it("should create a BuyItem object with price of type number", () => {
      const item = new BuyItem(50, "A cool item", "itemSprite");
      expect(item.price).to.be.a("number");
    });

    it("should create a BuyItem object with description of type string", () => {
      const item = new BuyItem(50, "A cool item", "itemSprite");
      expect(item.description).to.be.a("string");
    });

    it("should create a BuyItem object with spriteName of type string", () => {
      const item = new BuyItem(50, "A cool item", "itemSprite");
      expect(item.spriteName).to.be.a("string");
    });
  });
});
