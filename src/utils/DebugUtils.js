import { DebugWindow } from "../UI/debug-window.js";

/**
 * @param {{scene: Function[]}} config
 */
export function applyDebugMiddleware(config) {
    config.scene.forEach((scene) => {
        const preload = scene.prototype.preload;
        scene.prototype.preload = function () {
            this.load.image('dog01', 'sprites/pack/Characters/Dogs/Dog01/Idle/Idle_00.png');
            preload.call(this);
        }
        const create = scene.prototype.create;
        /** @type {DebugWindow} */ let debugWindow;
        scene.prototype.create = function () {
            debugWindow = new DebugWindow(this);
            this.input.keyboard.on("keydown-BACKTICK", () => {
                debugWindow.toggle();
            });
            create.call(this);
        }
        const update = scene.prototype.update;
        scene.prototype.update = function (time, delta) {
            update.call(this, time, delta);
            if (debugWindow.container !== null) debugWindow.container.update();
        }
    });
}