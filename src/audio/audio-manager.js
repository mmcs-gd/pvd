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
    /** @type {boolean} */ loop;
    /** @type {number} */ base_volume;
    /** @type {Phaser.Sound.BaseSound | null} */ handle;

    constructor(id, assets, loop, type, base_volume) {
        this.id = id;
        this.assets = assets;
        this.loop = loop;
        this.type = type;
        this.base_volume = base_volume;
        this.handle = null;
    }
}

class AudioManager {
    /** @type {string} */ #assetsPath;
    /** @type {{[soundId: string]: Sound}} */ #soundLibrary;
    /** @type {Phaser.Scene} */ #scene;

    /*
     * Creates a new AudioManager instance.
     * @param {string} assetsPath
     * @param {Phaser.Scene} scene The scene to manage.
     */
    constructor(assetsPath, scene) {
        this.#assetsPath = assetsPath;
        this.#scene = scene;
        this.#soundLibrary = {};
        this.#init_builtin_sounds();
    }

    // TODO: move this into a config
    #init_builtin_sounds() {
        this.addSound("gunshot", [`sfx/gunshot.mp3`, `sfx/gunshot.ogg`], false, AudioType.SFX);
        this.addSound("bullet_impact", [`sfx/bullet_impact.mp3`, `sfx/bullet_impact.ogg`], false, AudioType.SFX);
    }

    /*
     * Adds a new sound to the library, which can later be played.
     * @param {string} id The sound ID which you'll use later.
     * @param {string[]} assets The list of .mp3/.ogg/other versions of the same file sound.
     * @param {boolean} loop Whether to loop the sound on play.
     * @param {AudioType} type Type (SFX/Music).
     * @param {number} base_volume Base sound attenuation (if sounds are not initially balanced against each other).
     */
    addSound(id, assets, loop = false, type = AudioType.SFX, base_volume = 1.) {
        assets = assets.map(path => `${this.#assetsPath}/${path}`);
        this.#soundLibrary[id] = new Sound(
            id = id,
            assets = assets,
            loop = loop,
            type = type,
            base_volume = base_volume
        );
    }

    /*
     * Should be called on scene's preload to load all sounds.
     */
    on_preload() {
        for (const [key, value] of Object.entries(this.#soundLibrary)) {
            this.#scene.load.audio(key, value.assets);
        }
    }

    on_create() {
        for (const [key, value] of Object.entries(this.#soundLibrary)) {
            value.handle = this.#scene.sound.add(key, { loop: value.loop, volume: value.base_volume });
        }
    }

    /*
     * Play the sound with the given key.
     * @param {string} key
     */
    play(key) {
        this.#soundLibrary[key].handle.play();
    }
}

export { AudioType, Sound, AudioManager }