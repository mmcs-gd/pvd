// @ts-check
import Phaser from 'phaser';
import { Penguin } from './Penguin.js';
import { loadPenguinsNGunsAssets } from 'src/utils/resource-loaders/load-penguins-n-guns-assets.js';
import { Gun } from 'src/modules/Gun/Gun.js';

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
        loadPenguinsNGunsAssets(this);
    }

    create() {
        this.target = this.add.circle(0, this.radius, 5, 0xff0000);

        // todo: add repo method for pulling configs from db by id
        const gunConfig = new Gun({
            'id': '7b90d51a-13e6-4d5b-b1e6-af19a6c2e8d1',
            'name': 'Red Banner Grandma\'s Machine Gun',
            'assetKey': '9g',
            'weaponType': 'Machine Gun',
            'damage': 200,
            'cost': 3000,
            'range': 300
        });
        this.penguins.push(
            new Penguin(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, {
                bodyKey: '2c',
                gunConfig,
                stats: {},
                target: this.target,
                faceToTarget: true,
            }),
            new Penguin(this, 100, 100, {
                bodyKey: '1c',
                gunConfig,
                stats: {},
                target: this.target,
                faceToTarget: true,
            }),
            new Penguin(this, GAME_WIDTH - 100, 100, {
                bodyKey: '3c',
                gunConfig,
                stats: {},
                target: this.target,
                faceToTarget: true,
            }),
            new Penguin(this, 100, GAME_HEIGHT - 100, {
                bodyKey: '4c',
                gunConfig,
                stats: {},
                target: this.target,
                faceToTarget: true,
            }),
            new Penguin(this, GAME_WIDTH - 100, GAME_HEIGHT - 100, {
                bodyKey: '5c',
                gunConfig,
                stats: {},
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

        this.input.keyboard.on('keydown-SPACE', event => {
            this.scene.start('MainMenuScene');
        });
    }
}
