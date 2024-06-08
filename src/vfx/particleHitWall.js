import { ParticleAsset } from './particleAsset.js';

export class ParticleHitWall extends ParticleAsset {
    
    constructor() {
        super();
        this.frames = [];
    }

    /**
     * Preload assets required for the particle
     * @param {Phaser.Scene} scene 
     */
    preload(scene) {
        scene.load.audio('hit_wall', 'sfx/wall-hit.mp3');
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
        scene.sound.play('hit_wall');
    }

    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        // Update logic if necessary
    }
}
