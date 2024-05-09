export default class BuyItem {
    /**@type {Number} */ price;
    /**@type {string} */ description;
    /**@type {string} */ spriteName;
    
    /**
     * @param {Number} price 
     * @param {string} description
     * @param {string} spriteName
     */
    constructor(price, description, spriteName) {
        this.price = price;
        this.description = description;
        this.spriteName = spriteName;
    }
}