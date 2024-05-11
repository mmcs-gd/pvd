import Phaser from 'phaser';
const LOADING_TEXT_BASE = 'Loading';
const RAINBOW_COLORS = [
    Phaser.Display.Color.ValueToColor('FA5643'), // red
    Phaser.Display.Color.ValueToColor('FA742D'), // orange
    Phaser.Display.Color.ValueToColor('FAB317'), // yellow
    Phaser.Display.Color.ValueToColor('008000'), // green
    Phaser.Display.Color.ValueToColor('0000ff'), // blue
    Phaser.Display.Color.ValueToColor('4b0082'), // indigo
    Phaser.Display.Color.ValueToColor('ee82ee')  // violet
];

const CAPTIONS = [
    'Пес, пес, будешь майонез, пес?',
    'Вуф-вуф',
    'Я не люблю майонез!',
];

const LOADING_CAPTION_ORIGIN ={
    x: 80,
    y: 40,
};

const CAPTION_STYLE = {
    font: '20px monospace',
    fill: '#ffffff'
};

// in two's exponent
const CAPTION_DOTS_UPDATE_FRAMESPAWN = 4;
const BG_COLOR_UPDATE_FRAMESPAWN = 6;
const BG_LERP_DELTA = 1 / Math.pow(2, BG_COLOR_UPDATE_FRAMESPAWN);

class PreloaderScene extends Phaser.Scene {

    // @ts-ignore
    #preloaderImage;
    // @ts-ignore
    #loadingText;
    #captionDotsCounter = 0;
    #updateCounter = 0;

    #currentBgColorIdx = 0;
    #bgColorLerpValue = 0;

    #captions = [];

    constructor() {
        super('PreloaderScene');
    }

    preload() {
        this.load.image('logo', 'clown-emoji.png');

        // Display loading text or a loading bar here
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

        this.time.addEvent({
            delay: 1000, // Spawn a new caption every second
            callback: this.spawnNextCaption,
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

    get #captionsSpacing() {
        return  Number(this.sys.game.config.height) / 3;
    }

    spawnNextCaption() {
        const captionsCnt = this.#captions.length;
        if (captionsCnt === 3) return;

        // @ts-ignore
        const y = (this.#captionsSpacing * (captionsCnt + 0.5)) % this.sys.game.config.height;
        const captionText = CAPTIONS[captionsCnt];

        const text = this.add.text(LOADING_CAPTION_ORIGIN.x, y, captionText, CAPTION_STYLE);
        text.setOrigin(0, 0);
        text.setDepth(Number.MAX_SAFE_INTEGER);
        this.#captions.push(text);

        if (this.#captions.length === 3) {
            this.time.delayedCall(2000, this.next, [], this);
        }
    }

    clearCaptions() {
        this.#captions.forEach((child) => {
            child.destroy();
        });
        this.#captions.length = 0;
    }

    next() {
        this.scene.start('LoaderTestScene');
    }

    get #nextBgColorIdx() {
        return (this.#currentBgColorIdx + 1) % RAINBOW_COLORS.length;
    }

    updateBgColor() {
        this.#bgColorLerpValue += BG_LERP_DELTA;

        if ((this.#updateCounter >> BG_COLOR_UPDATE_FRAMESPAWN << BG_COLOR_UPDATE_FRAMESPAWN ) === this.#updateCounter) {
            this.#bgColorLerpValue %= 1;
            this.#currentBgColorIdx = this.#nextBgColorIdx;
        }

        // Get the interpolated color
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
            RAINBOW_COLORS[this.#currentBgColorIdx],
            RAINBOW_COLORS[this.#nextBgColorIdx],
            1,
            this.#bgColorLerpValue
        );

        const newColor = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
        this.cameras.main.setBackgroundColor(newColor);
    }

    updateCaptions () {
        this.children.each((child) => {
            if (child instanceof Phaser.GameObjects.Text) {
                if (child === this.#loadingText) {
                    child.text = `${LOADING_TEXT_BASE}${ '.'.repeat(this.#captionDotsCounter)}`;
                } else {
                    child.text = `${child.text}.`;
                }
            }
        });

        // update number of dots every 512 frames
        if ((this.#updateCounter >> CAPTION_DOTS_UPDATE_FRAMESPAWN << CAPTION_DOTS_UPDATE_FRAMESPAWN ) === this.#updateCounter) {
            this.#captionDotsCounter = (this.#captionDotsCounter + 1) % 4;
        }
    }

    updatePreloaderImage() {
        this.#preloaderImage.rotation += 0.04;
    }

    update() {
        this.updatePreloaderImage();

        this.updateCaptions();

        this.updateBgColor();

        this.#updateCounter +=1 ;
    }
}

export { PreloaderScene };
