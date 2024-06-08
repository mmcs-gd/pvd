import { ParticleAsset } from './particleAsset.js';

export class ParticleExplosion extends ParticleAsset {
    constructor() {
        super();
        this.frames = [];
    }

    /**
     * Preload assets required for the particle if required
     * @param {Phaser.Scene} scene 
     */
    preload(scene) {
        for (let i = 0; i <= 19; i++) {
            const frame_name = `Fx01_${('0' + i).slice(-2)}`;
            this.frames.push({ key: frame_name });
            scene.load.image(frame_name, `sprites/pack/Effect/01/Fx01_${('0' + i).slice(-2)}.png`);
        }
    }

    /**
     * Init animation for the particle
     * @param {Phaser.Scene} scene 
     */
    init(scene) {
        // Creating the animation after ensuring that all frames are loaded
        scene.anims.create({
            key: 'Fx01',
            frames: this.frames.map(frame => ({ key: frame.key })),
            frameRate: 44,
            repeat: 0,
            hideOnComplete: true
        });
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
        const sprite = scene.add.sprite(x, y, 'Fx01_00');
        sprite.scale = scale;
        sprite.rotation = rotation;
        sprite.setOrigin(0.5, 0.5);
        sprite.setDepth(100);
        sprite.play('Fx01');
    }

    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        // Update logic if necessary
    }
}
