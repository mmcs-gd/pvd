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

const CAPTIONS = [
    "Пес, пес, будешь майонез, пес?",
    "Вуф-вуф!",
    "Я не люблю майонез!",
];

const LOADING_CAPTION_ORIGIN ={
    x: 80,
    y: 40,
}

const CAPTION_STYLE = {
    font: '20px monospace',
    fill: '#ffffff'
};

class PreloaderScene extends Phaser.Scene {

    #preloaderImage: Phaser.GameObjects.Image;
    #loadingText: Phaser.GameObjects.Text;
    #captionDotsCounter = 0;
    #updateCounter = 0;

    #currentBgColorIdx = 0;
    #bgColorLerpValue = 0;
    #captionsSpawned = 0;
    constructor() {
        super('PreloaderScene');
    }

    preload() {
        this.load.image('logo', assetToPathMap.clownEmoji);

        // Display loading text or a loading bar here
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.#loadingText = this.make.text({
            ...LOADING_CAPTION_ORIGIN,
            text: LOADING_TEXT_BASE,
            style: CAPTION_STYLE
        });
        this.#loadingText.setOrigin(0, 0);
        this.#loadingText.setDepth(Number.MAX_SAFE_INTEGER);
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

        // Time event to start the caption loop
        this.time.addEvent({
            delay: 1000, // Start after 1 second
            callback: this.startCaptionLoop,
            callbackScope: this,
            loop: false
        });
    }

    spawnImage() {
        const x = Phaser.Math.Between(0, Number(this.sys.game.config.width));
        const y = Phaser.Math.Between(0, Number(this.sys.game.config.height));

        // Create an image at a random position
        const image = this.add.image(x, y, 'logo');
        image.setOrigin(0.5, 0.5); // Set origin to center for proper rotation
        image.setScale(0.7);
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
    #isCaptionLoopRunning = false;
    #captionLoop:  Phaser.Time.TimerEvent;

    startCaptionLoop() {
        if (this.#isCaptionLoopRunning) return;
        this.#isCaptionLoopRunning = true;

        // Time event to spawn captions in sequence
        this.#captionLoop = this.time.addEvent({
            delay: 1000, // Spawn a new caption every second
            callback: this.spawnNextCaption,
            callbackScope: this,
            loop: true
        });

        // Time event to clear all captions after a delay
        this.time.addEvent({
            delay: 4000, // Wait for 10 seconds before clearing
            callback: this.clearCaptions,
            callbackScope: this,
            loop: false
        });
    }

    spawnNextCaption() {
        // Calculate the y position based on the index and the height of each caption
        const captionY = Number(this.sys.game.config.height) / 3; // Adjust as needed for font size and line spacing
        const y = captionY * ((this.#captionsSpawned  % 3) + 0.5) % this.sys.game.config.height;

        // Get a random caption from the array
        const captionText = CAPTIONS[this.#captionsSpawned  % 3 % CAPTIONS.length];

        // Create a text object at a random position
        const text = this.add.text(LOADING_CAPTION_ORIGIN.x,y, captionText, CAPTION_STYLE);
        text.setOrigin(0, 0); // Set origin to center for proper rotation
        text.setDepth(Number.MAX_SAFE_INTEGER);

        // Set the rotation and destroy timer
        this.tweens.add({
            targets: text,
            // angle: 360,  // Complete one full rotation (360 degrees)
            angle: 0,
            duration: 2000, // Rotate for 2000 milliseconds (2 seconds)
            ease: 'Linear', // Linear rotation speed
        });

        this.#captionsSpawned += 1;
    }

    clearCaptions() {
        // Stop the caption loop
        this.#captionLoop.destroy();

        // Clear all existing captions
        this.children.each((child) => {
            if (child instanceof Phaser.GameObjects.Text && child !== this.#loadingText) {
                child.destroy();
            }
        });

        this.#isCaptionLoopRunning = false;

        // Restart the caption loop after a delay
        this.time.delayedCall(0, this.startCaptionLoop, [], this);
    }

    update(time, delta) {
        // Increase the rotation of the image by a small amount each frame
        this.#preloaderImage.rotation += 0.04;

        // update captions

        this.children.each((child) => {
            if (child instanceof Phaser.GameObjects.Text) {
                if (child === this.#loadingText) {
                    child.text = `${LOADING_TEXT_BASE}${ '.'.repeat(this.#captionDotsCounter)}`;
                } else {
                    child.text = `${child.text}.`;
                }
            }
        });

        // this.#loadingText.text = `${LOADING_TEXT_BASE}${ '.'.repeat(this.#captionDotsCounter)}`;

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
