import { ParticleAsset } from './particleAsset.js';

export class ParticleGunCocking extends ParticleAsset {
    
    constructor() {
        super();
        this.frames = [];
    }

    /**
     * Preload assets required for the particle
     * @param {Phaser.Scene} scene 
     */
    preload(scene) {
        scene.load.audio('gun_cocking', 'sfx/gun-cocking.mp3');
    }

    /**
     * Preload assets required for the particle if required
     * @param {Phaser.Scene} scene 
     */
    init(scene) {
        
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
        scene.sound.play('gun_cocking');
    }

    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        // Update logic if necessary
    }
}
