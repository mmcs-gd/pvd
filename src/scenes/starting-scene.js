import tilemapPng from '/src/assets/tileset/Dungeon_Tileset.png'
import dungeonRoomJson from '/src/assets/dungeon_room.json'
import {DogAnimationLoader} from "/src/utils/DogAnimationLoader.js"

let StartingScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function StartingScene() {
        Phaser.Scene.call(this, {key: 'StartingScene'});
    },
    preload: function () {

        //loading map tiles and json with positions
        this.load.image("tiles", tilemapPng);
        this.load.tilemapTiledJSON("map", dungeonRoomJson);

        //loading sprite-sheets
        // Load dog animations
        DogAnimationLoader.preload("/src/assets/sprites/pack/Characters/Dogs", this);

    },
    create: function () {
        DogAnimationLoader.create(this);
        this.gameObjects = [];
        const map = this.make.tilemap({key: "map"});

        console.log(map);
        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("Dungeon_Tileset", "tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        // createStaticLayer is deprecated!
        const belowLayer = map.createLayer("Floor", tileset, 0, 0);
        const worldLayer = map.createLayer("Walls", tileset, 0, 0);
        const aboveLayer = map.createLayer("Upper", tileset, 0, 0);
        this.tileSize = 32;


        worldLayer.setCollisionBetween(1, 500);
        aboveLayer.setDepth(10);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        DogAnimationLoader.spawnDog(this, 'Dog01', 'Attack', 200, 200);
        DogAnimationLoader.spawnDog(this, 'Dog02', 'Walk', 400, 200);
        DogAnimationLoader.spawnDog(this, 'Dog05', 'Idle', 600, 200);


        // Setup debug boundaries
        this.input.keyboard.on("keydown-D", event => {
            // Turn on physics debugging to show player's hitbox
            this.physics.world.createDebugGraphic();

            this.add
                .graphics()
                .setAlpha(0.75)
                .setDepth(20);
        });
    },
    update: function () {
        if (this.gameObjects) {
            this.gameObjects.forEach(function (element) {
                element.update();
            });
        }

    },

    tilesToPixels(tileX, tileY) {
        return [tileX * this.tileSize, tileY * this.tileSize];
    }
});

export default StartingScene