import { bodiesMap, gunsMap } from "../constants";

/**
 * @param {Phaser.Scene} scene
 * @param {Object} [options]
 * @param {Record<string, string>} [options.bodies = bodiesMap]
 * @param {Record<string, string>} [options.guns = gunsMap]
 */
export const loadAssets = (
  scene,
  { bodies = bodiesMap, guns = gunsMap } = {}
) => {
  Object.entries({ ...bodies, ...guns }).forEach(([key, value]) => {
    scene.load.image(key, value);
  });
};
