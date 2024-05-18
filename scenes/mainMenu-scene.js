import Phaser from 'phaser';

import { ButtonMethods } from '../src/utils/ButtonMethods.js';

export default class MainMenuScene extends Phaser.Scene {

    constructor() {
        super({ key: 'MainMenuScene'});
    }


    preload(){
        console.log('hello');
        this.load.image('playButtonDefault', 'sprites/pack/UI/Free Upgrade Screen/Artboard 3_1.png');
        this.load.image('playButtonHover', 'sprites/pack/UI/Free Upgrade Screen/Artboard 3 copy.png');
        this.load.image('backgroundImage', 'sprites/pack/UI/Free Upgrade Screen/Artboard 2.png');
    }

    create() {
        let mainMenuText = this.add.text(this.cameras.main.width/2, 150, 'Главное меню',
            {
                font: '64px impact',
                // @ts-ignore
                fill: '#FFFFFF',
                align: 'center',
                stroke: '#8B4513',
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

        let buttonTextStyle = {
            font: '32px impact',
            fill: '#FFD700',
            align: 'center',
            stroke: '#8B4513',
            strokeThickness: 3
        };

        let playButton = ButtonMethods.createLoadSceneButton(0, 0, 'playButtonDefault', 'playButtonHover', this);
        let text = ButtonMethods.createButtonLabel(playButton, 'Играть', buttonTextStyle, this);

        let container = this.add.container(this.game.renderer.width/2,this.game.renderer.height /2);
        container.add(playButton);
        container.add(text);
    }
}
