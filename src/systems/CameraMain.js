export class CameraMain {
    /**
     * Preload bullet assets
     * @param {Phaser.Scene} scene
     */
    static preload(scene) {

    }

    static cameraScene;

    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene, maxwidtht, maxheight) {
        const cursors = scene.input.keyboard.createCursorKeys();
        const controlConfig = {
            camera: scene.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: {x: 0.7, y: 0.7},
        };
        //const cameraConfig = this.load.json("configs", 'configs/baseCameraConfig.json');
        CameraMain.cameraScene = scene;
        scene.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
        const camera = scene.cameras.main;
        camera.setBounds(0, 0, maxwidtht, maxheight).setZoom(1);

        
        // Добавляем обработчик события колесика мыши
        scene.input.on('wheel', CameraMain.handleMouseWheel, scene);
    }

    static handleMouseWheel(pointer, gameObject, deltaX, deltaY, deltaZ) {
        // Изменяем значение свойства zoom камеры в зависимости от направления прокрутки
        if (deltaY < 0) {
            CameraMain.cameraScene.cameras.main.zoom += 0.1;
        } else if (deltaY > 0) {
            CameraMain.cameraScene.cameras.main.zoom -= 0.1;
        }

        if (pointer.event.buttons === 4) { // Проверяем, что зажато колесико мыши
            
        }
    };



}
