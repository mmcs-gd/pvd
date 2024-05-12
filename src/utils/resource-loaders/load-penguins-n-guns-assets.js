
import { gunsMap } from 'src/modules/Gun/constants/assetMap.js';
import { bodiesMap } from 'src/modules/Penguin/constants/assetMap.js';

/**
 * @param {Phaser.Scene} scene
 * @param {Object} [options]
 * @param {Record<string, string>} [options.bodies = bodiesMap]
 * @param {Record<string, string>} [options.guns = gunsMap]
 */
export const loadPenguinsNGunsAssets = (
    scene,
    { bodies = bodiesMap, guns = gunsMap } = {}
) => { 
    Object.entries({ ...bodies, ...guns }).forEach(([key, value]) => {
        scene.load.image(key, value);
    });
};
