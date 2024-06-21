import { Dog } from "src/modules/Dog/Dog.js";
import { Gun } from "src/modules/Gun/Gun.js";
import { Penguin } from "src/modules/Penguin/Penguin.js";
import { loadDogsAssets } from "src/utils/resource-loaders/load-dogs-assets.js";

export class DebugWindow {

  /** @type {Phaser.Scene} */ scene;
  /** @type {Phaser.GameObjects.Container | null} */ container;
  /** @type {Function | null} */ action;

  /**
   * @param {Phaser.Scene} scene 
   */
  constructor(scene) {
    this.scene = scene;
    this.container = null;
  }

  create() {
    const debugWindow = this;
    const size = {
      x: this.scene.cameras.main.width,
      y: this.scene.cameras.main.height
    }
    this.container = this.scene.add.container(0, 0).setSize(size.x, size.y).setDepth(666666); // Ни слова о Number.MAX_SAFE_INTEGER
    const background = this.scene.add.rectangle(size.x / 2, size.y / 2, size.x, size.y, 0x000000, 0.5);
    const title = this.scene.add.text(0, 0, "Debug Menu");
    const leftMenu = this.scene.add.container(this.container.width  * 0.1, this.container.height * 0.25).setSize(size.x * 0.3, size.y * 0.5);
    const rightMenu = this.scene.add.container(this.container.width  * 0.6, this.container.height * 0.25).setSize(size.x * 0.3, size.y * 0.5);
    const changeSceneButton = this.scene.add.container(0, 0).setSize(200, 40);
    const changeSceneBackground = this.scene.add.rectangle(changeSceneButton.width / 2, changeSceneButton.height / 2, changeSceneButton.width, changeSceneButton.height, 0x000000);
    const changeSceneText = this.scene.add.text(0, 0, 'Change scene', { color: '#0f0' });

    background.setInteractive();
    
    title.setFontSize(64).setScale(0.5);
    title.setStyle({ strokeThickness: 2, stroke: "#fff" })
    title.setX((size.x * 0.5  - title.width  / 2 * title.scaleX));
    title.setY((size.y * 0.1  - title.height / 2 * title.scaleY));

    function addButton(x, y, text, action) {
      const sceneButton = rightMenu.scene.add.container(x, y).setSize(200, 40);
      const sceneButtonText = rightMenu.scene.add.text(0, 0, text, { color: '#0f0' });
      const sceneButtonBackground = rightMenu.scene.add.rectangle(sceneButton.width / 2, sceneButton.height / 2, sceneButton.width, sceneButton.height, 0x000000);
      sceneButtonText.setStyle({ strokeThickness: 1, stroke: '#0f0' })
      sceneButtonText.setX((sceneButton.width  * 0.5  - sceneButtonText.width  / 2 * sceneButtonText.scaleX));
      sceneButtonText.setY((sceneButton.height * 0.5  - sceneButtonText.height / 2 * sceneButtonText.scaleY));
      sceneButtonText.setInteractive();
      sceneButtonText.on('pointerdown', action);
      sceneButtonText.on('pointerup', () => sceneButtonText.setColor('#0ff'));
      sceneButtonText.on('pointerover', () => sceneButtonText.setColor('#0ff'));
      sceneButtonText.on('pointerout', () => sceneButtonText.setColor('#0f0'));
      sceneButton.add([sceneButtonBackground, sceneButtonText]);
      return sceneButton;
    }
    
    changeSceneText.setStyle({ strokeThickness: 1, stroke: '#0f0' })
    changeSceneText.setX((changeSceneButton.width  * 0.5  - changeSceneText.width  / 2 * changeSceneText.scaleX));
    changeSceneText.setY((changeSceneButton.height * 0.5  - changeSceneText.height / 2 * changeSceneText.scaleY));
    changeSceneText.setInteractive();
    changeSceneText.on('pointerdown', () => {
      rightMenu.removeAll(true);
      changeSceneText.setColor('#ff0');
      const button2 = debugWindow.scene.add.text(0, 0, "", { color: '#0f0' }).setStyle({ strokeThickness: 1, stroke: '#0f0' }).setY(40);
      {
        const allScenes = debugWindow.scene.scene.manager.scenes;
        button2.setData("scene", debugWindow.scene);
        button2.setText(`[${allScenes.indexOf(debugWindow.scene)+1}/${allScenes.length}]${debugWindow.scene.sys.settings.key}`)
        button2.setX((100 - button2.width  / 2 * button2.scaleX));
        button2.setY((70 - button2.height  / 2 * button2.scaleY));
      }
      const button1 = addButton(0, 0, "Previous scene", () => {
        const allScenes = debugWindow.scene.scene.manager.scenes;
        const nextIndex = (allScenes.length + allScenes.indexOf(button2.getData("scene")) - 1) % allScenes.length;
        const newScene = allScenes[nextIndex];
        button2.setData("scene", newScene);
        button2.setText(`[${nextIndex+1}/${allScenes.length}]${newScene.sys.settings.key}`)
        button2.setX((100 - button2.width  / 2 * button2.scaleX));
      });
      const button3 = addButton(0, 100, "Next scene", () => {
        const allScenes = debugWindow.scene.scene.manager.scenes;
        const nextIndex = (allScenes.length + allScenes.indexOf(button2.getData("scene")) + 1) % allScenes.length;
        const newScene = allScenes[nextIndex];
        button2.setData("scene", newScene);
        button2.setText(`[${nextIndex+1}/${allScenes.length}]${newScene.sys.settings.key}`)
        button2.setX((100 - button2.width  / 2 * button2.scaleX));
      });
      const button4 = addButton(0, 150, "Change scene", () => {
        const activeScenes = debugWindow.scene.scene.manager.getScenes();
        activeScenes.forEach((scene) => debugWindow.scene.scene.stop(scene));
        debugWindow.scene.scene.start(button2.getData("scene"));
      });
      rightMenu.add([button1, button2, button3, button4]);
    });
    changeSceneText.on('pointerup', () => changeSceneText.setColor('#0ff'));
    changeSceneText.on('pointerover', () => changeSceneText.setColor('#0ff'));
    changeSceneText.on('pointerout', () => changeSceneText.setColor('#0f0'));
    changeSceneButton.add([changeSceneBackground, changeSceneText])
    
    const restartSceneButton = addButton(changeSceneButton.x, changeSceneButton.y + changeSceneButton.height + 10, "Restart scene", () => {
      debugWindow.scene.scene.restart();
    });

    const addMoneyButton = addButton(restartSceneButton.x, restartSceneButton.y + restartSceneButton.height + 10, "+100 money", () => {
      // !!!! КАКАЯ СОБАКА СЮДА ТИПОСКРИПТ ДОБАВИЛА!??!?!?!??!?!
      if (debugWindow.scene.inventory) {
        debugWindow.scene.inventory.money += 100;
      }
    });

    const spawnDogButton = addButton(addMoneyButton.x, addMoneyButton.y + addMoneyButton.height + 10, "Spawn dog [Alpha1]", () => {
      this.action = this.spawnDog;
    });

    const spawnPenguinButton = addButton(spawnDogButton.x, spawnDogButton.y + spawnDogButton.height + 10, "Spawn ПИНГВИН [Alpha1]", () => {
      this.action = this.spawnPenguin;
    });


    leftMenu.add([changeSceneButton, restartSceneButton, addMoneyButton, spawnDogButton, spawnPenguinButton]);

    this.container.add([background, title, leftMenu, rightMenu]);
    this.container.update = function(...args) {
      const mainCamera = debugWindow.scene.cameras.main;
      debugWindow.container.x = mainCamera.centerX + (0 - mainCamera.centerX) / mainCamera.zoomX + mainCamera.scrollX;
      debugWindow.container.y = mainCamera.centerY + (0 - mainCamera.centerY) / mainCamera.zoomY + mainCamera.scrollY;
      debugWindow.container.scale = 1 / debugWindow.container.scene.cameras.main.zoom;
    }

    this.scene.input.keyboard.on("keydown-ONE", () => {
      const mainCamera = debugWindow.scene.cameras.main;
      const mousePointer = this.scene.input.mousePointer;
      const x = mainCamera.centerX + (mousePointer.x - mainCamera.centerX) / mainCamera.zoomX + mainCamera.scrollX;
      const y = mainCamera.centerY + (mousePointer.y - mainCamera.centerY) / mainCamera.zoomY + mainCamera.scrollY;
      debugWindow.action?.call(this, x, y);
    });
  }

  spawnDog(x, y) {
    if (!this.scene.gameObjects) {
      console.log("there is no Scene.gameObjects among us")
      return;
    }
    const dog = new Dog(this.scene, x, y, { health: 1, reward: 1, assetKey: 'dog01' });
    const angle = Math.random() * Math.PI * 2;
    dog.dogStateTable.patrolState.patrolSteering.addPatrolPoint(new Phaser.Math.Vector2(x, y));
    dog.dogStateTable.patrolState.patrolSteering.addPatrolPoint(new Phaser.Math.Vector2(x + Math.cos(angle) * 200, y + Math.sin(angle) * 200));
    this.scene.gameObjects.push(dog);
  }

  spawnPenguin(x, y) {
    if (!this.scene.gameObjects) {
      console.log("there is no Scene.gameObjects among us")
      return;
    }
    const gunConfig = new Gun({
      'id': '7b90d51a-13e6-4d5b-b1e6-af19a6c2e8d1',
      'name': 'Red Banner Grandma\'s Machine Gun',
      'assetKey': '9g',
      'weaponType': 'Machine Gun',
      'damage': 200,
      'cost': 3000,
      'range': 400,
      'bullets': 4,
      'bulletType': 'bullet2',
      'cooldownTime': 0.2,
      'muzzlePosition': {
        x: 55,
        y: 20
      }
    });

    const penguin = new Penguin(this.scene, x, y, this.scene.gameObjects, {
      bodyKey: '2c',
      gunConfig,
      stats: {},
      target: null,
      faceToTarget: true,
    });
    if (!this.scene.penguins) {
      console.log("there is no Scene.penguins among us")
    } else {
      this.scene.penguins.push(penguin);
    }
  }

  toggle() {
    if (this.container === null || !this.container.visible) {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    if (this.container === null) {
      this.create();
    }
    this.container.active = true;
    this.container.visible = true;
  }

  hide() {
    if (this.container === null) return;
    this.container.active = false;
    this.container.visible = false;
  }

}
