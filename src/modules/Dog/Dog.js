import Phaser from 'phaser';
import { StateTable } from 'src/ai/behaviour/state.js';

export class Dog {
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x
     * @param {number} y
     * @param {string} spriteName
     * @param {StateTable} stateTable
    */
    constructor(scene, name, x, y, spriteName, stateTable) {
        this.x = x;
        this.y = x;
        this.name = name;
        this.sprite = scene.add.sprite(x, y, spriteName);
        this.stateTable = stateTable;
        this.state = stateTable.initialState;
    }

    update(delta) {
        this.sprite.update(delta);
        this.state.update(delta);
        this.state = this.stateTable.getNextState(this.state);
    }
}