import { Flag } from '../objects/Flag.js';

export class FlagManager 
{
	/**
     * Preload bullet assets
     * @param {Phaser.Scene} scene
     */

	static preload(scene) {
        scene.load.image('flag1', 'sprites/pack/UI/Shopping Screen/Artboard 26.png');
    }

	
	static create(scene) {
        /**
		 * @type {Flag[]}
		 */
        this.flags = [];
    }

	
	/**
	 * @param {Phaser.Scene} scene
	 */
	static spawnFlag(scene, sprite = 'flag1', location = [400, 300])
	{
		this.flags.push(new Flag(scene, sprite, location));
	}
}