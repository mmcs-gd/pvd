class Flag 
{
	/**
	 * @param {Phaser.Scene} scene
	 */
    constructor(scene, sprite = "flag1", location = [400, 300]) {
        this.scene = scene;
		console.log(scene);
        this.sprite = this.scene.add.sprite(location[0], location[1], sprite);
	}
}

export { Flag }