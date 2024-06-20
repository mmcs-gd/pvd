import { dogsMap } from 'src/modules/Dog/constants/assetMap.js';

/**
 * @param {Phaser.Scene} scene
 * @param {Object} [options]
 * @param {Record<string, string>} [options.dogs = dogsMap]
 */
export const loadDogsAssets = (
    scene,
    { dogs = dogsMap } = {}
) => { 
    Object.entries(dogs).forEach(([key, value]) => {
        scene.load.image(key, value);
    });
};
