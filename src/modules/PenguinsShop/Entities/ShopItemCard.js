import Phaser from 'phaser';
import { GameObjects } from 'phaser';
import {
    CARD_BACKGROUND_COLOR,
    CARD_BORDER_COLOR,
} from '../constants/colors.js';

/**
 * Base class for shop item card
 * Supports hover and disabled states
 */
export class ShopItemCard extends GameObjects.Container { 
    /** @type {Phaser.GameObjects.Rectangle} */
    #background;
    /** @type {Phaser.GameObjects.Rectangle} */
    #card;
    /** @type {Phaser.GameObjects.Rectangle} */
    #disabledBackdrop;
    /** @type {Phaser.GameObjects.Rectangle} */
    #hoverBackdrop;
    /** @type {Phaser.GameObjects.GameObject[]} */
    #children;

    #isHoverable = true;
    #isDisabled = false;

    /**
   * @param {Phaser.Scene} scene
   * @param {number} x - Position of the card center
   * @param {number} y - Position of the card center
   * @param {Object} [options]
   * @param {Phaser.GameObjects.GameObject[]} [options.children]
   * @param {number} [options.width]
   * @param {number} [options.height]
   * @param {boolean} [options.isHoverable]
   * @param {boolean} [options.isDisabled]
   */
    constructor(
        scene,
        x,
        y,
        {
            children = [],
            height = 200,
            width = 160,
            isHoverable = true,
            isDisabled = false,
        } = {}
    ) {
        super(scene, x, y);

        this.#children = Array.isArray(children) ? children : [children];

        this.#background = scene.add.rectangle(
            0,
            0,
            width,
            height,
            CARD_BORDER_COLOR
        );

        this.#card = scene.add.rectangle(
            0,
            0,
            width * 0.9,
            height * 0.9,
            CARD_BACKGROUND_COLOR
        );

        this.#disabledBackdrop = scene.add.rectangle(0, 0, width, height, 0x000000);
        this.#hoverBackdrop = scene.add.rectangle(0, 0, width, height, 0xffffff);

        this.#hoverBackdrop.setAlpha(0);
        this.#disabledBackdrop.setAlpha(0);

        this.add(this.#background);
        this.add(this.#card);
        this.add(children);
        this.add(this.#hoverBackdrop);
        this.add(this.#disabledBackdrop);

        this.setSize(width, height);

        this.#isHoverable = isHoverable;
        this.#isDisabled = isDisabled;

        if (isHoverable) this.setHoverable();
        if (isDisabled) this.setDisabled();

        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, this.width, this.height),
            Phaser.Geom.Rectangle.Contains
        );
    }

    onPointerOver = () => {
        this.#hoverBackdrop.setAlpha(0.3);
    };

    onPointerOut = () => {
        this.#hoverBackdrop.setAlpha(0);
    };

    onClick = () => {
        this.setScale(0.9);

        setTimeout(() => {
            this.setScale(1);
        }, 100);
    };

    setHoverable = (isHoverable = true) => {
        this.#isHoverable = isHoverable;

        if (!isHoverable) this.onPointerOver();

        const method = isHoverable ? 'on' : 'off';

        this[method]('pointerover', this.onPointerOver);
        this[method]('pointerout', this.onPointerOut);
        this[method]('pointerdown', this.onClick);
    };

    setDisabled = (isDisabled = true) => {
        this.#isDisabled = isDisabled;

        this.#disabledBackdrop.setAlpha(isDisabled ? 0.5 : 0);
        this.setHoverable(!isDisabled && this.#isHoverable);
    };
}
