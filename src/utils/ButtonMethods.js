class ButtonMethods 
{
    static replacementButtonSprite(button, stringPng) 
    {
        button.setTexture(stringPng);
    }
    
    static loadSceneClickButton = (stringNameScene, context) => 
    {
        context.scene.start(stringNameScene);
    }

    static createLoadSceneButton(x, y, defaultSprite, scene)
    {
        let button = scene.add.sprite(x, y, defaultSprite)
            .setInteractive()
            .on('pointerdown', () => { ButtonMethods.loadSceneClickButton('StartingScene', scene);})

        return button;
    }

    static createLoadSceneButton(x, y, defaultSprite, hoverSprite, scene)
    {
        let button = scene.add.sprite(x, y, defaultSprite)
            .setInteractive()
            .on('pointerdown', () => { ButtonMethods.loadSceneClickButton('StartingScene', scene);})
            .on('pointerover', () => ButtonMethods.replacementButtonSprite(button, hoverSprite))
            .on('pointerout', () => ButtonMethods.replacementButtonSprite(button, defaultSprite));
        
        return button;
    }

    static createButtonLabel(button, buttonText, buttonTextStyle, scene)
    {
        let text = scene.add.text( button.x, button.y,buttonText,buttonTextStyle);
        text.setOrigin(0.5);
        
        return text;
    }
}
export{ButtonMethods}