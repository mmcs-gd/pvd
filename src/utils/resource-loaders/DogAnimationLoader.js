import config from 'src/assets/animations/dogs.json';

class DogAnimationLoader {
    // frame names loaded as dog_XX_attack_frame_YY without leading zeroes!
    /**
     * Loads all dogs from config to the scene
     * @param {string} assetsPath
     * @param {Phaser.Scene} scene
     */
    static preload(assetsPath, scene) {
        for (const [dogName, dogAnimations] of Object.entries(config)) {
            for (const [name, frameCount] of Object.entries(dogAnimations)) {

                const animationName = `${dogName}_${name}`;

                // You know, just a simple for loop with counter, like it's 2005
                for (let i = 0; i <= frameCount; i++) {
                    const frame_name = `${animationName}_${i}`;
                    scene.load.image(frame_name,
                        `${assetsPath}/${dogName}/${name}/${name}_${('0' + i).slice(-2)}.png`);
                }

            }
        }
    }
    static create(scene) {
        const defaultFrameRate = 30;
        const repeat = -1;

        for (const [dogName, dogAnimations] of Object.entries(config)) {
            for (const [name, frameCount] of Object.entries(dogAnimations)) {
                const animationName = `${dogName}_${name}`;

                // Yay, unreadable 1-liner, like it's  2016
                const frames = Array.from({ length: frameCount + 1 }, (_, i) => ({ key: `${animationName}_${i}` }));

                scene.anims.create({
                    key: animationName,
                    frames: frames,
                    frameRate: defaultFrameRate,
                    repeat: repeat
                });
            }
        }
    }
    /**
     * Loads all dogs from config to the scene
     * @param {Phaser.Scene} scene
     * @param {string} dogName
     * @param {string} actionName
     * @param {number} x
     * @param {number} y
     */
    static spawnDog(scene, dogName, actionName, x, y) {
        const prefix = `${dogName}_${actionName}`;
        scene.add.sprite(x, y, `${prefix}_0`)
            .play(prefix);
    }

}

export {DogAnimationLoader};
