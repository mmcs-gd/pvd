export class DebugWindow {

  /** @type {Phaser.Scene} */ scene;
  /** @type {Phaser.GameObjects.Container | null} */ container;

  /**
   * @param {Phaser.Scene} scene 
   */
  constructor(scene) {
    this.scene = scene;
    this.container = null;
  }

  create() {
    const size = {
      x: this.scene.cameras.main.width,
      y: this.scene.cameras.main.height
    }
    this.container = this.scene.add.container(0, 0).setSize(size.x, size.y).setDepth(1001);
    const background = this.scene.add.rectangle(size.x / 2, size.y / 2, size.x, size.y, 0x000000, 0.5).setDepth(-1);
    const title = this.scene.add.text(0, 0, "Debug Menu");
    const leftMenu = this.scene.add.container(this.container.width  * 0.1, this.container.height * 0.25).setSize(size.x * 0.3, size.y * 0.5);
    const rightMenu = this.scene.add.container(this.container.width  * 0.6, this.container.height * 0.25).setSize(size.x * 0.3, size.y * 0.5);
    const changeSceneButton = this.scene.add.container(0, 0).setSize(200, 40);
    const changeSceneBackground = this.scene.add.rectangle(changeSceneButton.width / 2, changeSceneButton.height / 2, changeSceneButton.width, changeSceneButton.height, 0x000000);
    const changeSceneText = this.scene.add.text(0, 0, 'Change scene', { color: '#0f0' });
    const spawnUnitButton = this.scene.add.container();
    const moreMoneyButton = this.scene.add.container();

    background.setInteractive();
    
    title.setFontSize(64).setScale(0.5);
    title.setStyle({ strokeThickness: 2, stroke: "#fff" })
    title.setX((size.x * 0.5  - title.width  / 2 * title.scaleX));
    title.setY((size.y * 0.1  - title.height / 2 * title.scaleY));
    
    changeSceneText.setStyle({ strokeThickness: 1, stroke: '#0f0' })
    changeSceneText.setX((changeSceneButton.width  * 0.5  - changeSceneText.width  / 2 * changeSceneText.scaleX));
    changeSceneText.setY((changeSceneButton.height * 0.5  - changeSceneText.height / 2 * changeSceneText.scaleY));
    changeSceneText.setInteractive();
    changeSceneText.on('pointerdown', () => {
      rightMenu.removeAll(true);
      changeSceneText.setColor('#ff0');
      let Y = 0;
      for (const scene of rightMenu.scene.scene.manager.scenes) {
        const sceneButton = rightMenu.scene.add.container(0, Y).setSize(200, 30);
        const sceneButtonText = rightMenu.scene.add.text(0, 0, scene.sys.settings.key, { color: '#0f0' });
        const sceneButtonBackground = rightMenu.scene.add.rectangle(sceneButton.width / 2, sceneButton.height / 2, sceneButton.width, sceneButton.height, 0x000000);
        sceneButtonText.setStyle({ strokeThickness: 1, stroke: '#0f0' })
        sceneButtonText.setX((sceneButton.width  * 0.5  - sceneButtonText.width  / 2 * sceneButtonText.scaleX));
        sceneButtonText.setY((sceneButton.height * 0.5  - sceneButtonText.height / 2 * sceneButtonText.scaleY));
        sceneButtonText.setInteractive();
        sceneButtonText.on('pointerdown', () => {
          const activeScenes = rightMenu.scene.scene.manager.getScenes();
          activeScenes.forEach((scene) => rightMenu.scene.scene.stop(scene));
          rightMenu.scene.scene.start(scene);
        });
        sceneButtonText.on('pointerup', () => sceneButtonText.setColor('#0ff'));
        sceneButtonText.on('pointerover', () => sceneButtonText.setColor('#0ff'));
        sceneButtonText.on('pointerout', () => sceneButtonText.setColor('#0f0'));
        sceneButton.add([sceneButtonBackground, sceneButtonText]);
        rightMenu.add([sceneButton]);
        Y += sceneButton.height + 10;
      }
    });
    changeSceneText.on('pointerup', () => changeSceneText.setColor('#0ff'));
    changeSceneText.on('pointerover', () => changeSceneText.setColor('#0ff'));
    changeSceneText.on('pointerout', () => changeSceneText.setColor('#0f0'));
    

    changeSceneButton.add([changeSceneBackground, changeSceneText])

    leftMenu.add([changeSceneButton, spawnUnitButton, moreMoneyButton]);

    this.container.add([background, title, leftMenu, rightMenu]);
    const container = this.container;
    this.container.update = function(...args) {
      container.x = container.scene.cameras.main.scrollX;
      container.y = container.scene.cameras.main.scrollY;
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
