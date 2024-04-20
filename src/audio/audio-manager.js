/**
 * Enum for audio types (mainly for adjusting volume).
 * @readonly
 * @enum {Symbol}
 */
const AudioType = Object.freeze({
    SFX: Symbol("sfx"),
    Music: Symbol("music"),
});

class Sound {
    /** @type {string} */ id;
    /** @type {string[]} */ assets;
    /** @type {AudioType} */ type;
    /** @type {number} */ base_volume;
    /** @type {Phaser.Sound.BaseSound | null} */ handle;

    constructor(id, assets, type, base_volume) {
        this.id = id;
        this.assets = assets;
        this.type = type;
        this.base_volume = base_volume;
        this.handle = null;
    }
}

class AudioManager {
    /** @type {{[soundId: string]: Sound}} */ #soundLibrary;
    /** @type {Phaser.Scene} */ #scene;

    /*
     * Creates a new AudioManager instance.
     * @param {Phaser.Scene} scene The scene to manage.
     */
    constructor(scene) {
        this.#scene = scene;
        this.#soundLibrary = {};
        this.#init_builtin_sounds();
    }

    // TODO: move this into a config
    #init_builtin_sounds() {
        this.addSound("gunshot", [""])
    }

    /*
     * Adds a new sound to the library, which can later be played.
     * @param {string} id The sound ID which you'll use later.
     * @param {string[]} assets The list of .mp3/.ogg/other versions of the same file sound.
     * @param {AudioType} type Type (SFX/Music).
     * @param {number} base_volume Base sound attenuation (if sounds are not initially balanced against each other).
     */
    addSound(id, assets, type = AudioType.SFX, base_volume = 1.) {
        this.#soundLibrary[id] = new Sound(
            id = id,
            assets = assets,
            type = type,
            base_volume = base_volume
        );
    }

    /*
     * Should be called on scene's preload to load all sounds.
     */
    on_preload() {
        for (const [key, value] of Object.entries(this.#soundLibrary)) {
            console.log(key, value);
        }
    }
}

export { AudioType, Sound, AudioManager }