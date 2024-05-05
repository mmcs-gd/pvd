// @ts-check
import Phaser from "phaser";
import { bodiesMap, gunsMap, loadAssets } from "../Penguin/index.js";
import { PenguinsShop } from "./PenguinsShop.js";

export class SampleScene extends Phaser.Scene {
  constructor() {
    super("PenguinsShopSampleScene");
  }

  preload() {
    loadAssets(this);
  }

  create() {
    const bodyShopTop = new PenguinsShop(this, 0, 0, {
      items: Object.keys(bodiesMap).map((key) => ({
        spriteKey: key,
        price: 100,
        isDisabled: Math.random() > 0.5,
      })),
      width: 800,
      origin: "topLeft",
      itemHeight: 90,
      itemWidth: 80,
    });

    const bodyShopCenter = new PenguinsShop(this, 400, 300, {
      items: Object.keys(bodiesMap).map((key) => ({
        spriteKey: key,
        price: 100,
        isDisabled: Math.random() > 0.5,
      })),
      width: 500,
      height: 200,
      origin: "center",
    });

    const gunsShop = new PenguinsShop(this, 0, 600, {
      items: Object.keys(gunsMap)
        .slice(1)
        .map((key) => ({
          spriteKey: key,
          price: 100,
          isDisabled: Math.random() > 0.5,
        })),
      columnsCount: 5,
      origin: "bottomLeft",
      itemHeight: 90,
      itemWidth: 80,
    });

    bodyShopTop.on("itemSelect", (item) => console.log(item));
    bodyShopCenter.on("itemSelect", (item) => console.log(item));
    gunsShop.on("itemSelect", (item) => console.log(item));

    this.add.existing(bodyShopTop);
    this.add.existing(bodyShopCenter);
    this.add.existing(gunsShop);
  }
}
