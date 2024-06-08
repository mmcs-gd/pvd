import { ParticleAsset } from './particleAsset.js';

export class ParticleSmokeWhisp extends ParticleAsset {
    constructor() {
        super();
        this.frames = [];
    }

    /**
     * Preload assets required for the particle
     * @param {Phaser.Scene} scene 
     */
    preload(scene) {
        for (let i = 0; i <= 26; i++) {
            const frame_name = `Fx03_${('00' + i).slice(-3)}`;
            this.frames.push({ key: frame_name });
            scene.load.image(frame_name, `sprites/pack/Effect/03/tile${('00' + i).slice(-3)}.png`);
        }
    }

     /**
     * Create a particle
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {number} rotation 
     * @param {number} scale 
     */
    create(scene, x, y, rotation, scale) {
        for (let i = 0; i <= 26; i++) {
            const frame_name = `Fx03_${('00' + i).slice(-3)}`;
            this.frames.push({ key: frame_name });
        }

        // Creating the animation after ensuring that all frames are loaded
        scene.anims.create({
            key: 'Fx03',
            frames: this.frames.map(frame => ({ key: frame.key })),
            frameRate: 30,
            repeat: -1,
            hideOnComplete: true
        });

        const sprite = scene.add.sprite(x, y, 'Fx03_000');
        sprite.scale = scale;
        sprite.rotation = rotation;
        sprite.setOrigin(0.5, 1.0);
        sprite.setDepth(100);
        sprite.play('Fx03');
    }

    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        // Update logic if necessary
    }
}
