import { AudioManager } from 'src/audio/audio-manager.js';
import { assets } from 'src/utils/resource-loaders/AssetImporter.js';
import { ParticleAsset } from 'src/vfx/particleAsset.js';

export class ParticlesSystem {
    /**
     * Preload particle for all particles that need to be preloaded
     * @param {Phaser.Scene} scene
     * @param {Object.<string, ParticleAsset>} assets 
     */
    static preload(scene, assets = {}) {
        this.scene = scene;
        this.assets = assets;

        Object.keys(assets).forEach(asset => {
            assets[asset].preload(this.scene);
        });
    }

    /**
     * Init animations for all particles that need to be created
     */
    static init() {
        Object.keys(this.assets).forEach(asset => {
            this.assets[asset].init(this.scene);
        });
    }

    /**
     * Ultimate create method for particles
     * @param {string} particleKey 
     * @param {number} x 
     * @param {number} y 
     * @param {number} rotation 
     * @param {number} scale 
     */
    static create(particleKey, x = 0, y = 0, rotation = 0, scale = 1) {
        this.assets[particleKey].create(this.scene, x, y, rotation, scale);
    }

    /**
     * @param {number} deltaTime 
     */
    static update(deltaTime) {

    }
}