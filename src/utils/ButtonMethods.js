export class ButtonMethods
{
    /**
     * @param {Phaser.GameObjects.Sprite} button
     * @param {string} stringPng
     */
    static replacementButtonSprite(button, stringPng) {
        button.setTexture(stringPng);
    }

    /**
     * @param {string} stringNameScene
     * @param {Phaser.Scene} context
     */
    static loadSceneClickButton(stringNameScene, context) {
        context.scene.start(stringNameScene);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {string} defaultSprite
     * @param {string} hoverSprite
     * @param {Phaser.Scene} scene
     */
    static createLoadSceneButton(x, y, defaultSprite, hoverSprite, scene) {
        let button = scene.add.sprite(x, y, defaultSprite)
            .setInteractive()
            .on('pointerdown', () => { ButtonMethods.loadSceneClickButton('BulletsDemoScene', scene);})
            .on('pointerover', () => ButtonMethods.replacementButtonSprite(button, hoverSprite))
            .on('pointerout', () => ButtonMethods.replacementButtonSprite(button, defaultSprite));

        return button;
    }

    /**
     * @param {Phaser.GameObjects.Sprite} button
     * @param {string} buttonText
     * @param {{ font: string; fill: string; align: string; stroke: string; strokeThickness: number; }} buttonTextStyle
     * @param {Phaser.Scene} scene
     */
    static createButtonLabel(button, buttonText, buttonTextStyle, scene) {
        let text = scene.add.text( button.x, button.y,buttonText,buttonTextStyle);
        text.setOrigin(0.5);

        return text;
    }
}
