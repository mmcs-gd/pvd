import Phaser from 'phaser';
import dungeonRoomJson from '../assets/dungeon_room.json';
import { DogAnimationLoader } from 'src/utils/resource-loaders/DogAnimationLoader.js';
import ShopWindow from '../src/UI/shop-window.js';
import shopIcon from '../assets/sprites/pack/UI/Gameplay Screen/Artboard 10.png';
import Inventory from '../src/inventory.js';
import Penguin from '../src/penguin.js';
import Gun from '../src/gun.js';

//! TEST IMPORTS
import penguinSpriteTest1 from '../assets/sprites/pack/UI/Shopping Screen/Artboard 29.png';
import penguinSpriteTest2 from '../assets/sprites/pack/UI/Shopping Screen/Artboard 27.png';
//! TEST IMPORTS END

export default class StartingScene extends Phaser.Scene {
    /** @type {object[]} */ gameObjects;

    constructor() {
        super({ key: 'StartingScene' });
    }

    preload() {
        // loading map tiles and json with positions
        this.load.image('tiles', 'tileset/Dungeon_Tileset.png');
        this.load.tilemapTiledJSON('map', dungeonRoomJson);

        //! TEST LOADS
        this.load.image('penguinSpriteTest1', penguinSpriteTest1);
        this.load.image('penguinSpriteTest2', penguinSpriteTest2);
        this.load.image('gunSpriteTest1', '/sprites/pack/Characters/guns/4g.png?url');
        this.load.image('gunSpriteTest2', '/sprites/pack/Characters/guns/6g.png?url');
        //! TEST LOADS END
        
        this.load.image('shopIcon', shopIcon);
        ShopWindow.preload(this, 'shop-window');

        //loading sprite-sheets
        // Load dog animations
        DogAnimationLoader.preload('sprites/pack/Characters/Dogs', this);

    }

    create() {
        DogAnimationLoader.create(this);


        this.inventory = new Inventory(200);

        let penguins = [];
        penguins.push(new Penguin(10, 'Super penguin omg', 'penguinSpriteTest1'));
        penguins.push(new Penguin(20, 'Super super penguin omg', 'penguinSpriteTest1'));
        penguins.push(new Penguin(5, 'Default penguin', 'penguinSpriteTest2'));
        penguins.push(new Penguin(300, 'Mega ultra penguin', 'penguinSpriteTest2'));
        penguins.push(new Penguin(150, 'Super half mega ultra penguin', 'penguinSpriteTest2'));

        let guns = [];
        guns.push(new Gun(50, 'Mega gun', 'gunSpriteTest1'));
        guns.push(new Gun(100, 'Ultra mega gun', 'gunSpriteTest2'));

        let shopButtonSize = 80;
        this.openPenguinShopButton = this.add.image(shopButtonSize * 0.5, shopButtonSize * 0.5, 'shopIcon').setInteractive();
        this.openPenguinShopButton.setDisplaySize(shopButtonSize, shopButtonSize);
        this.openPenguinShopButton.setDepth(19);

        this.openGunShopButton = this.add.image(shopButtonSize * 0.5, shopButtonSize * 1.5, 'shopIcon').setInteractive();
        this.openGunShopButton.setDisplaySize(shopButtonSize, shopButtonSize);
        this.openGunShopButton.setDepth(19);

        // Create function called inside constructor
        this.penguinShopWindow = new ShopWindow(this, this.openPenguinShopButton, penguins, this.inventory, this.inventory.penguins);
        this.gunShopWindow = new ShopWindow(this, this.openGunShopButton, guns, this.inventory, this.inventory.guns);

        this.cameras.main.on('cameramove', (camera, progress, oldPosition, newPosition) => {
            this.openPenguinShopButton.setPosition(0, 0);
            this.openGunShopButton.setPosition(0, 0);
        });
        
        this.gameObjects = [];

        const map = this.make.tilemap({ key: 'map' });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage('Dungeon_Tileset', 'tiles');


        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createLayer('Floor', tileset, 0, 0);
        const worldLayer = map.createLayer('Walls', tileset, 0, 0);
        const aboveLayer = map.createLayer('Upper', tileset, 0, 0);
        this.tileSize = 32;


        worldLayer.setCollisionBetween(1, 500);
        aboveLayer.setDepth(10);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        DogAnimationLoader.spawnDog(this, 'Dog01', 'Attack', 200, 200);
        DogAnimationLoader.spawnDog(this, 'Dog02', 'Walk', 400, 200);
        DogAnimationLoader.spawnDog(this, 'Dog05', 'Idle', 600, 200);


        // Setup debug boundaries
        this.input.keyboard.on('keydown-D', event => {
            // Turn on physics debugging to show player's hitbox
            this.physics.world.createDebugGraphic();

            this.add
                .graphics()
                .setAlpha(0.75)
                .setDepth(20);
        });
    }

    update() {
        if (this.gameObjects) {
            this.gameObjects.forEach(function (element) {
                element.update();
            });
        }

    }

    /**
     * @param {number} tileX
     * @param {number} tileY
     */
    tilesToPixels(tileX, tileY) {
        return [tileX * this.tileSize, tileY * this.tileSize];
    }
}
