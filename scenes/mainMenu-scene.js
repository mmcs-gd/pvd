
import buttonPngDefault from '../assets/sprites/pack/UI/Free Upgrade Screen/Artboard 3_1.png'
import buttonPngHover from '../assets/sprites/pack/UI/Free Upgrade Screen/Artboard 3 copy.png'
import backgroundImage from '../assets/sprites/pack/UI/Free Upgrade Screen/Artboard 2.png'

let MainMenuScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function MainMenuScene() {
        Phaser.Scene.call(this, {key: 'MainMenuScene'});
    },
    preload: function () {
        this.load.image('playButtonDefault', buttonPngDefault);
        this.load.image('playButtonHover', buttonPngHover);
        this.load.image('backgroundImage', backgroundImage);
    },

    create: function () {
        let mainMenuText = this.add.text(this.cameras.main.width/2, 150, 'Главное меню', {
            font: "64px impact",
            fill: "#FFFFFF",
            align: "center",
            stroke: "#8B4513",
            strokeThickness: 5,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000',
                blur: 0,
                stroke: false,
                fill: true
            }
        }).setOrigin(0.5, 0);

        mainMenuText.setOrigin(0.5, 0.5);
        let backgroundImage = this.add.image(0, 0, 'backgroundImage');
        
        backgroundImage.setOrigin(0,0);
        backgroundImage.setDepth(-1);

        let container = this.add.container(this.game.renderer.width/2,this.game.renderer.height /2);

        let playButton = this.add.sprite(0, 0, 'playButtonDefault')
            .setInteractive()
            .on('pointerdown', () => this.loadSceneClickButton('StartingScene'))
            .on('pointerover', () => this.replacementButtonSprite(playButton, 'playButtonHover'))
            .on('pointerout', () => this.replacementButtonSprite(playButton, 'playButtonDefault'));
        
        let text = this.add.text( playButton.x, playButton.y,'Играть',{
            font: "32px impact",
            fill: "#FFD700",
            align: "center",
            stroke: "#8B4513",
            strokeThickness: 3
        });
        
        text.setOrigin(0.5);
        
        container.add(playButton);
        container.add(text);
    },
    replacementButtonSprite(button, stringPng) {
        button.setTexture(stringPng);
    },
    
    loadSceneClickButton(stringNameScene) {
        this.scene.start(stringNameScene);
    }
});

export default MainMenuScene;