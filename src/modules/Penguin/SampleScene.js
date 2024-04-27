// @ts-check
import Phaser from 'phaser';
import { Penguin } from './Penguin.js';
import { loadAssets } from './utils/index.js';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export class SampleScene extends Phaser.Scene {
    /** @type {Penguin[]} */
    penguins = [];

    /** @type {Phaser.GameObjects.Arc} */
    target;

    angle = 0;
    speed = 0.005;
    radius = 100;

    constructor() {
        super('PenguinSampleScene');
    }

    preload() {
        loadAssets(this);
    }

    create() {
        this.target = this.add.circle(0, this.radius, 5, 0xff0000);

        this.penguins.push(
            new Penguin(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, {
                bodyKey: '2c',
                gunKey: '2g',
                target: this.target,
                faceToTarget: true,
            }),
            new Penguin(this, 100, 100, {
                bodyKey: '1c',
                gunKey: '1g',
                target: this.target,
                faceToTarget: true,
            }),
            new Penguin(this, GAME_WIDTH - 100, 100, {
                bodyKey: '3c',
                gunKey: '3g',
                target: this.target,
                faceToTarget: true,
            }),
            new Penguin(this, 100, GAME_HEIGHT - 100, {
                bodyKey: '4c',
                gunKey: '4g',
                target: this.target,
                faceToTarget: true,
            }),
            new Penguin(this, GAME_WIDTH - 100, GAME_HEIGHT - 100, {
                bodyKey: '5c',
                gunKey: '5g',
                target: this.target,
                faceToTarget: true,
            })
        );
    }

    /**
   * @param {number} time
   * @param {number} delta
   */
    update(time, delta) {
    // Обновляем угол
        this.angle += this.speed * delta;

        // Вычисляем новые координаты
        const x = GAME_WIDTH / 2 + Math.cos(this.angle) * (GAME_WIDTH / 2);
        const y = GAME_HEIGHT / 2 + (Math.sin(this.angle) * GAME_HEIGHT) / 2;

        // Обновляем позицию спрайта
        this.target.x = x;
        this.target.y = y;

        this.penguins.forEach((penguin) => penguin.update(time, delta));
    }
}
