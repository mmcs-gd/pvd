// @ts-check
import { GameObjects } from "phaser";
import { ShopItemCard } from "./Entities/ShopItemCard.js";

/**
 * @typedef {Object} PenguinsShopItem
 * @property {string} spriteKey
 * @property {number} price
 * @property {boolean} [isDisabled]
 */

/**
 * @typedef {'center' | 'topLeft' | 'bottomLeft'} OriginPosition
 */

/**
 * Subscribe to "itemSelect" event to get selected item
 * You can set width and height, columnsCount or itemWidth and itemHeight.
 * Any of this options will be calculated if not provided.
 */
export class PenguinsShop extends GameObjects.Container {
  /** @type {PenguinsShopItem[]} */
  #items = [];

  /** @type {Phaser.GameObjects.GameObject[]} */
  #cards = [];

  #cardWidth = 160;
  #cardHeight = 200;

  /** @type {number} */
  #width = 0;
  /** @type {number} */
  #height = 0;

  /** @type {number} */
  #columnsCount = 0;
  /** @type {number} */
  #rowsCount = 0;

  /** @type {OriginPosition} */
  #origin = "center";

  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {Object} [options]
   * @param {number} [options.columnsCount] - Number of columns, will be ignored if width provided
   * @param {number} [options.width] - Width of the shop
   * @param {number} [options.height] - Height of the shop
   * @param {number} [options.itemWidth=160] - Will be calculated if width and columnsCount provided
   * @param {number} [options.itemHeight=200]
   * @param {PenguinsShopItem[]} [options.items]
   * @param {OriginPosition} [options.origin='center'] - Origin of the shop
   */
  constructor(
    scene,
    x,
    y,
    {
      columnsCount: rawColumnsCount,
      width: rawWidth,
      height: rawHeight,
      itemHeight = 200,
      itemWidth = 160,
      items,
      origin = "center",
    } = {}
  ) {
    const cardWidth =
      rawWidth && rawColumnsCount ? rawWidth / rawColumnsCount : itemWidth;

    const columnsCount = rawColumnsCount || Math.floor(rawWidth / cardWidth);
    const rowsCount = Math.ceil(items.length / columnsCount);

    const cardHeight =
      rawHeight && rowsCount ? rawHeight / rowsCount : itemHeight;

    const height = rowsCount * cardHeight;
    const width = columnsCount * cardWidth;

    const getXShift = () => {
      if (origin === "center") {
        return -width / 2 + cardWidth / 2;
      }

      return cardWidth / 2;
    };

    const getYShift = () => {
      if (origin === "center") {
        return -height / 2 + cardHeight / 2;
      }

      if (origin === "topLeft") {
        return cardHeight / 2;
      }

      return -height + cardHeight / 2;
    };

    const shiftX = getXShift();
    const shiftY = getYShift();

    super(scene, x + shiftX, y + shiftY);

    this.#cardWidth = cardWidth;
    this.#cardHeight = cardHeight;

    this.#width = width;
    this.#height = height;

    this.#columnsCount = columnsCount;
    this.#rowsCount = rowsCount;

    this.#origin = origin;

    this.setItems(items);

    scene.add.existing(this);
  }

  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {PenguinsShopItem} item
   */
  createCard = (scene, x, y, item) => {
    const image = scene.add.image(0, 0, item.spriteKey);

    const imageScale = Math.min(
      this.#cardWidth / image.width,
      this.#cardHeight / image.height
    );

    image.setScale(imageScale).setOrigin(0.5, 0.5);

    const text = scene.add.text(
      this.#cardWidth / 2,
      -this.#cardHeight / 2,
      `${item.price}`,
      {
        color: "#000000",
        fontSize: "32px",
        fontStyle: "bold",
        backgroundColor: "#ffffff",
      }
    );

    const textScale = Math.min(1, this.#cardWidth / text.width);

    text.setScale(textScale).setOrigin(1, 0);

    const card = new ShopItemCard(scene, x, y, {
      children: [image, text],
      width: this.#cardWidth,
      height: this.#cardHeight,
      isDisabled: item.isDisabled,
    });

    card.on("pointerdown", () => {
      this.emit("itemSelect", item);
    });

    return card;
  };

  /**
   * @param {PenguinsShopItem[]} items
   */
  setItems = (items) => {
    this.#items = items;

    this.#cards.forEach((card) => card.destroy());

    const isLastRowFull = items.length % this.#columnsCount === 0;
    const lastRowItemsCount = items.length % this.#columnsCount;
    const lasRowShift = isLastRowFull
      ? 0
      : ((this.#columnsCount - lastRowItemsCount) * this.#cardWidth) / 2;

    this.#cards = this.#items.map((item, index) => {
      const columnIndex = index % this.#columnsCount;
      const rowIndex = Math.floor(index / this.#columnsCount);

      const xShift = rowIndex === this.#rowsCount - 1 ? lasRowShift : 0;
      const cardX = xShift + columnIndex * this.#cardWidth;
      const cardY = rowIndex * this.#cardHeight;

      return this.createCard(this.scene, cardX, cardY, item);
    });

    this.add(this.#cards);
  };
}
