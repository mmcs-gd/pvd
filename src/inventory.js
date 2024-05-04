import Gun from "./gun.js";
import Penguin from "./penguin.js";

export default class Inventory {
    /**@type {Array<Penguin>} */ penguins;
    /**@type {Array<Gun>} */ guns;
    /**@type {Number} */ money;

    /**
     * @param {Number} money
     */
    constructor(money) {
        this.money = money;
        this.penguins = [];
        this.guns = [];
    }
}