/**
 * Enum for audio types (mainly for adjusting volume).
 * @readonly
 * @enum {Symbol}
 */
const AudioType = Object.freeze({
    SFX: Symbol('sfx'),
    Music: Symbol('music'),
});

class Sound {
    /** @type {string} */ id;
    /** @type {string[]} */ assets;
    /** @type {AudioType} */ type;
    /** @type {boolean} */ loop;
    /** @type {number} */ base_volume;
    /** @type {Phaser.Sound.BaseSound | null} */ handle;

    /**
     * @param {string} id
     * @param {string[]} assets
     * @param {boolean} loop
     * @param {symbol | Symbol} type
     * @param {number} base_volume
     */
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
    /** @type {Map<AudioType, number>} */ #volumeLevels;

    /**
     * Creates a new AudioManager instance.
     * @param {string} assetsPath
     * @param {Phaser.Scene} scene The scene to manage.
     */
    constructor(assetsPath, scene) {
        this.#assetsPath = assetsPath;
        this.#scene = scene;
        this.#soundLibrary = {};
        this.#volumeLevels = new Map();
        this.#volumeLevels.set(AudioType.SFX, 1.);
        this.#volumeLevels.set(AudioType.Music, 1.);
        this.#init_builtin_sounds();
    }

    // TODO: move this into a config
    #init_builtin_sounds() {
        this.addSound('gunshot', ['sfx/gunshot.mp3', 'sfx/gunshot.ogg'], false, AudioType.SFX);
        this.addSound('bullet_impact', ['sfx/bullet_impact.mp3', 'sfx/bullet_impact.ogg'], false, AudioType.SFX);
    }

    #update_volume(sound) {
        sound.handle.setVolume(this.#volumeLevels.get(sound.type) * sound.base_volume);
    }

    /**
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
            id,
            assets,
            loop,
            type,
            base_volume
        );
    }

    /**
     * Sets the volume for a given audio type.
     * @param {AudioType} audio_type - The audio type as an enum of class AudioType.
     * @param {number} volume_level - The volume level, must be a number between 0 and 1.
     */
    setVolume(audio_type, volume_level) {
        this.#volumeLevels.set(audio_type, volume_level);

        for (const [key, value] of Object.entries(this.#soundLibrary)) {
            this.#update_volume(value);
        }
    }

    /**
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

    /**
     * Play the sound with the given key.
     * @param {string} key
     */
    play(key) {
        let sound = this.#soundLibrary[key];
        this.#update_volume(sound);
        sound.handle.play();
    }
}

export { AudioType, Sound, AudioManager };
