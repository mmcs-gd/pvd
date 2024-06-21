import endGameBackground from '/sprites/pack/UI/Level Cleared Screen/Artboard 2.png?url'
import buttonImage from '/sprites/pack/UI/Level Cleared Screen/Artboard 3.png?url'
import hoverButtonImage from '/sprites/pack/UI/Level Cleared Screen/Artboard 3 copy.png?url'
import { Scene } from 'phaser';

export default class EndGameWindow
{
    static /** @type {string} */ prefix;
    static /** @type {boolean} */ isWindowOpen;
    static /** @type {string} */ windowNameText;
    static /** @param {Phaser.Scene}*/ loadNameScene;
    /**
    * @param {Scene} scene 
    */
    constructor(scene,windowNameText,loadNameScene) {
        EndGameWindow.isWindowOpen = false;
        EndGameWindow.windowNameText = windowNameText;
        EndGameWindow.loadNameScene = loadNameScene;
        this.create(scene);
        this.showWindow();
    }

    /**
    * @param {Scene} scene 
    * @param {string} prefix 
    */
    static preload(scene, prefix) 
    {
        EndGameWindow.prefix = prefix;
        scene.load.image(EndGameWindow.prefix + 'loseBackground', endGameBackground);
        scene.load.image(EndGameWindow.prefix + 'buttonImage', buttonImage);
        scene.load.image(EndGameWindow.prefix + 'hoverButtonImage', hoverButtonImage);
    }

    /**
    * @param {Scene} scene 
    */
    create(scene)
    {
        
        this.background = scene.add.image(scene.cameras.main.width / 2, scene.cameras.main.height / 2, EndGameWindow.prefix + 'loseBackground');
       
        // Масштабирование изображения в зависимости от размера экрана
        const scaleX = scene.cameras.main.width / this.background.width;
        const scaleY = scene.cameras.main.height / this.background.height;
        const scale = Math.max(scaleX, scaleY);
       
        this.background.setScale(scale);
        
        this.text = scene.add.text(scene.cameras.main.width / 2, this.background.y - this.background.displayHeight / 2 + 80, EndGameWindow.windowNameText, 
        { 
            fontFamily: 'impact', 
            fontSize: '48px', 
            color: '#ffffff', 
                            shadow: {
                    offsetX: 3,
                    offsetY: 3,
                    color: '#000',
                    blur: 0,
                    stroke: false,
                    fill: true
                }
        });
        
        this.text.setOrigin(0.5, 0);
        this.button = scene.add.image(scene.cameras.main.width / 2, this.background.y + this.background.displayHeight / 2 - 150, EndGameWindow.prefix + 'buttonImage');
        
        this.button.setInteractive()
        .on('pointerdown', () => { console.log('Кнопка нажата'); })
        .on('pointerover', () => { this.button.setTexture(EndGameWindow.prefix + 'hoverButtonImage'); })
        .on('pointerout', () => { this.button.setTexture(EndGameWindow.prefix + 'buttonImage'); });

        this.buttonText = scene.add.text(this.button.x, this.button.y, 'Продолжить', {
            fontFamily: 'impact',
            fontSize: '24px',
            color: '#ffffff'
        });
        
        this.buttonText.setOrigin(0.5);

        this.windowContainer = scene.add.container(0, 0);
        this.windowContainer.add(this.background);
        this.windowContainer.add(this.text);
        this.windowContainer.add(this.button);
        this.windowContainer.add(this.buttonText);
    }

    hideWindow() 
    {
        EndGameWindow.isWindowOpen = false;
        this.windowContainer.setVisible(false);
    }

    showWindow()
    {
        EndGameWindow.isWindowOpen = true;
        this.windowContainer.setVisible(true);
    }

}