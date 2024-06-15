// @ts-check
import { gunsMap } from 'src/modules/Gun/constants/assetMap.js';
import { BulletsManager } from 'src/systems/BulletsManager.js';
import { ParticlesSystem } from 'src/systems/ParticleSystem.js';

class Gun {
    /** @type {string} */
    #id;
    /** @type {string} */
    #assetKey;
    /** @type {string} */
    #name;
    /** @type {string} */
    #weaponType;
    /** @type {number} */
    #damage;
    /** @type {number} */
    #cost;
    /** @type {number} */
    #range;
    /** @type {number} */
    #cooldownTime
    /** @type {{x: number, y: number}} */
    #muzzlePosition;
    /** @type {number} */
    #bullets
    /** @type {string} */
    #bulletType
    /** @type {number} */
    #currentCooldownTime;
    /** @type {number} */
    #currentBullets;


    constructor({
        id,
        name,
        assetKey,
        weaponType,
        damage,
        cost,
        range,
        cooldownTime = 1,
        bullets = 1,
        bulletType = "bullet1",
        muzzlePosition = {
            x: 0,
            y: 0,
        }
    }) {
        if (!assetKey || !gunsMap[assetKey]) {
            throw new Error(
                assetKey ? `Gun key ${assetKey} not found` : 'Gun key is required'
            );
        }
        this.#id = id;
        this.#assetKey = assetKey;
        this.#name = name;
        this.#weaponType = weaponType;
        this.#damage = damage;
        this.#cost = cost;
        this.#range = range;
        this.#cooldownTime = cooldownTime;
        this.#muzzlePosition = muzzlePosition;
        this.#currentCooldownTime = 0;
        this.#bullets = bullets;
        this.#bulletType = bulletType;
        this.#currentBullets = bullets;
    }

    /**
     * Shoot
     * @param {number[]} location 
     * @param {number} rotation 
     */
    shoot = (location, rotation) => {
        if (this.#currentCooldownTime > 0 || this.#currentBullets <= 0) return;
        this.#currentBullets--;
        this.#currentCooldownTime = this.#cooldownTime;

        let randType = Math.random();
        BulletsManager.spawnBullet(this.#bulletType, location, 1, rotation, 200, this.#range, 0.5);
        ParticlesSystem.create('GunFire', location[0], location[1], rotation, 0.15);
    }

    /**
     * Reload the gun.
     */
    reload = () => {
        if (this.#bullets == this.#currentBullets) return;
        ParticlesSystem.create('GunCocking', location[0], location[1]);
        this.#currentBullets = this.#bullets;
    }

    /**
     * Update cooldown time.
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        this.#currentCooldownTime -= deltaTime;
    }

    // sorry!
    get assetKey() {
        return this.#assetKey;
    }
    get id() {
        return this.#id;
    }
    get name() {
        return this.#name;
    }
    get weaponType() {
        return this.#weaponType;
    }
    get damage() {
        return this.#damage;
    }
    get cost() {
        return this.#cost;
    }
    get range() {
        return this.#range;
    }
    get muzzlePosition() {
        return this.#muzzlePosition;
    }
}

export {
    Gun
};