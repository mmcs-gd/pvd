import {assetToPathMap} from "../resources/asset-keys";

const LOADING_TEXT_BASE = 'Loading';
const RAINBOW_COLORS: Array<Phaser.Display.Color> = [
    Phaser.Display.Color.ValueToColor('FA5643'), // red
    Phaser.Display.Color.ValueToColor('FA742D'), // orange
    Phaser.Display.Color.ValueToColor('FAB317'), // yellow
    Phaser.Display.Color.ValueToColor('008000'), // green
    Phaser.Display.Color.ValueToColor('0000ff'), // blue
    Phaser.Display.Color.ValueToColor('4b0082'), // indigo
    Phaser.Display.Color.ValueToColor('ee82ee')  // violet
];

class PreloaderScene extends Phaser.Scene {

    #preloaderImage: Phaser.GameObjects.Image;
    #loadingText: Phaser.GameObjects.Text;
    #captionDotsCounter = 0;
    #updateCounter = 0;

    #currentBgColorIdx = 0;
    #bgColorLerpValue = 0;

    constructor() {
        super('PreloaderScene');
    }

    preload() {
        this.load.image('logo', assetToPathMap.clownEmoji);

        // Display loading text or a loading bar here
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.#loadingText = this.make.text({
            x: 80,
            y: 40,
            text: LOADING_TEXT_BASE,
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        this.#loadingText.setOrigin(0, 0);

        /*// Optional: Create a progress bar or other indicators
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
            console.log(file.src);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            this.loadingText.destroy();
        });*/
    }

    create() {
        // After loading, you can start a new scene or do something else
        this.#preloaderImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'logo');
        this.#preloaderImage.setOrigin(0.5, 0.5);

        // Set the initial rotation to 0
        this.#preloaderImage.rotation = 0;

        this.#currentBgColorIdx = 0;
        this.#bgColorLerpValue = 0;

        this.cameras.main.setBackgroundColor(RAINBOW_COLORS[this.#currentBgColorIdx].color);

        this.time.addEvent({
            delay: 1000,
            callback: this.spawnImage,
            callbackScope: this,
            loop: true
        });
    }

    spawnImage() {
        const x = Phaser.Math.Between(0, Number(this.sys.game.config.width));
        const y = Phaser.Math.Between(0, Number(this.sys.game.config.height));

        // Create an image at a random position
        const image = this.add.image(x, y, 'logo');
        image.setOrigin(0.5, 0.5); // Set origin to center for proper rotation

        // Set the rotation and destroy timer
        this.tweens.add({
            targets: image,
            angle: 360,  // Complete one full rotation (360 degrees)
            duration: 2000, // Rotate for 2000 milliseconds (2 seconds)
            ease: 'Linear', // Linear rotation speed
            onComplete: () => {
                image.destroy(); // Destroy the image after rotation completes
            }
        });
    }

    update(time, delta) {
        // Increase the rotation of the image by a small amount each frame
        this.#preloaderImage.rotation += 0.04;

        // update captions

        this.#loadingText.text = `${LOADING_TEXT_BASE}${ '.'.repeat(this.#captionDotsCounter)}`;

        // update number of dots every 512 frames
        if ((this.#updateCounter >> 4 << 4 ) === this.#updateCounter) {
            this.#captionDotsCounter = (this.#captionDotsCounter + 1) % 4;
        }
        this.#updateCounter +=1 ;

       // ============== scene bg color

        // Update the lerp value by a small amount each frame, adjust the 0.002 to speed up/slow down
        this.#bgColorLerpValue += 0.01;

        if (this.#bgColorLerpValue > 1) {
            this.#bgColorLerpValue = 0;
            this.#currentBgColorIdx++;

            if (this.#currentBgColorIdx >= RAINBOW_COLORS.length - 1) {
                this.#currentBgColorIdx = 0;
            }
        }

        // Get the interpolated color
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
            RAINBOW_COLORS[this.#currentBgColorIdx],
            RAINBOW_COLORS[(this.#currentBgColorIdx + 1) % RAINBOW_COLORS.length],
            100,
            this.#bgColorLerpValue * 100
        );

        let newColor = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
        this.cameras.main.setBackgroundColor(newColor);
    }
}

export {
    PreloaderScene
}
