
/**
 * Enum for audio types (mainly for adjusting volume).
 * @readonly
 * @enum {Symbol}
 */
const AudioType = Object.freeze({
    SFX: Symbol("sfx"),
    Music: Symbol("music"),
});

class AudioTrack {
    /** @type {string} */ id;
    /** @type {AudioType} */ type;
    /** @type {number} */ base_volume;
    /** @type {Phaser.Sound.BaseSound | null} */ handle;
}

class AudioManager {
    /** @type {Phaser.Game} */ #game;
}