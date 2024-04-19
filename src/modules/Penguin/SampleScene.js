// @ts-check
import Phaser from "phaser";
import { Penguin } from "./Penguin";
import { loadAssets } from "./utils";

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
    super("PenguinSampleScene");
  }

  preload() {
    loadAssets(this);
  }

  create() {
    this.target = this.add.circle(0, this.radius, 5, 0xff0000);

    this.penguins.push(
      new Penguin(
        this,
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        "2c",
        "2g",
        this.target
      ),
      new Penguin(this, 100, 100, "1c", "1g", this.target),
      new Penguin(this, GAME_WIDTH - 100, 100, "3c", "3g", this.target),
      new Penguin(this, 100, GAME_HEIGHT - 100, "4c", "4g", this.target),
      new Penguin(
        this,
        GAME_WIDTH - 100,
        GAME_HEIGHT - 100,
        "5c",
        "5g",
        this.target
      )
    );

    this.penguins.forEach((penguin) => penguin.setFaceToTarget(true));
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
