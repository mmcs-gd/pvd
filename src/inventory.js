import Gun from "./UI/shop-gun.js";
import Penguin from "./UI/shop-penguin.js";

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

    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {Phaser.Math.Vector2} position 
     * @returns 
     */
    spawn(scene, position, gameObjects) {
        if (this.penguins.length == 0) {
            return null;
        }

        // let unitToSpawn = spawnPenguin(scene, position, this.penguins[this.penguins.length - 1].spriteName, gameObjects);

        //this.penguins.pop();
        return null;
        //return unitToSpawn;
    }
}