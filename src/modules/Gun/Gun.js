// @ts-check
import { gunsMap } from 'src/modules/Gun/constants/assetMap.js';

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

    constructor({
        id,
        name,
        assetKey,
        weaponType,
        damage,
        cost,
        range
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
}

export {
    Gun
};