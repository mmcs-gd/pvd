import { ParticleAsset } from './particleAsset.js';

export class ParticleGunFire extends ParticleAsset {
    
    constructor() {
        super();
        // Frames for the animation
        this.frames = [];
    }

    /**
     * Preload assets required for the particle
     * @param {Phaser.Scene} scene 
     */
    preload(scene) {
        for (let i = 0; i <= 24; i++) {
            const frame_name = `Fx02_${('0' + i).slice(-2)}`;
            this.frames.push({ key: frame_name });
            scene.load.image(frame_name, `sprites/pack/Effect/02/Fx02_${('0' + i).slice(-2)}.png`);
        }
        scene.load.audio('gun_shot', 'sfx/gunshot.mp3');
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
        // Creating the animation after ensuring that all frames are loaded
        scene.anims.create({
            key: 'Fx02',
            frames: this.frames.map(frame => ({ key: frame.key })),
            frameRate: 60,
            repeat: 0,
            hideOnComplete: true
        });

        const sprite = scene.add.sprite(x, y, 'Fx02_00');
        sprite.scale = scale;
        sprite.rotation = rotation;
        sprite.setOrigin(0, 0.5);
        sprite.setDepth(100);
        sprite.play('Fx02');
        scene.sound.play('gun_shot');
    }

    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        // Update logic if necessary
    }
}
