import shopBackground from '../../assets/sprites/pack/UI/Shopping Screen/Artboard 1 copy.png'
import closeIcon from '../../assets/sprites/pack/UI/Shopping Screen/Artboard 18.png';
import windowBackground from '../../assets/sprites/pack/UI/Shopping Screen/Artboard 12.png';
import rightActiveArrowButton from '../../assets/sprites/pack/UI/Shopping Screen/Artboard 13 copy 2.png';
import rightDisabledArrowButton from '../../assets/sprites/pack/UI/Shopping Screen/Artboard 13 copy 3.png';
import leftActiveArrowButton from '../../assets/sprites/pack/UI/Shopping Screen/Artboard 13.png';
import leftDisabledArrowButton from '../../assets/sprites/pack/UI/Shopping Screen/Artboard 13 copy.png';
import coinIcon from '../../assets/sprites/pack/UI/Shopping Screen/Artboard 8.png';

import ShopItem from './shop-item.js';
import Inventory from '../inventory.js';
import BuyItem from '../buy-item.js';
import { Scene } from 'phaser';

export default class ShopWindow {
    static /** @type {string} */ prefix;
    static /** @type {boolean} */ isWindowOpen;

    /** @type {Inventory} */ inventory;

    /**
     * @param {Inventory} inventory 
     * @param {Array<BuyItem>} buyItems
     */
    constructor(scene, openButton, buyItems, inventory, inventoryItemContainer) {
        ShopWindow.isWindowOpen = false;

        this.openButton = openButton;
        this.openButton.on('pointerdown', () => {
            if(!ShopWindow.isWindowOpen){
                this.showWindow();
            }
        });

        this.buttonSize = 80;
        this.inventory = inventory;
        this.inventoryItemContainer = inventoryItemContainer;
        this.buyItems = buyItems;
        this.create(scene);
    }

    /**
     * @param {Scene} scene 
     * @param {string} prefix 
     */
    static preload(scene, prefix) {
        ShopWindow.prefix = prefix;

        scene.load.image(ShopWindow.prefix + 'shopBackground', shopBackground);
        scene.load.image(ShopWindow.prefix + 'windowBackground', windowBackground);
        scene.load.image(ShopWindow.prefix + 'closeIcon', closeIcon);
        scene.load.image(ShopWindow.prefix + 'coinIcon', coinIcon);

        scene.load.image(ShopWindow.prefix + 'rightActiveArrowButton', rightActiveArrowButton);
        scene.load.image(ShopWindow.prefix + 'rightDisabledArrowButton', rightDisabledArrowButton);
        scene.load.image(ShopWindow.prefix + 'leftActiveArrowButton', leftActiveArrowButton);
        scene.load.image(ShopWindow.prefix + 'leftDisabledArrowButton', leftDisabledArrowButton);

        ShopItem.preload(scene, prefix);
    }

     /**
     * @param {Scene} scene 
     */
    create(scene) {
        let totalWidth = scene.cameras.main.width;
        let totalHeight = scene.cameras.main.height;
        let windowCenterX = totalWidth * 0.5;
        let windowCenterY = totalHeight * 0.5;

        this.background = scene.add.image(0, 0, ShopWindow.prefix + 'shopBackground').setOrigin(0);

        let windowBackgroundWidth = 700;
        let windowBackgroundHeight = 400;
        let windowBackgroundPosX = windowCenterX - windowBackgroundWidth * 0.5;
        let windowBackgroundPosY = windowCenterY - windowBackgroundHeight * 0.5;
        this.windowBackground = scene.add.image(windowBackgroundPosX, windowBackgroundPosY,
            ShopWindow.prefix + 'windowBackground').setOrigin(0);
        this.windowBackground.setDisplaySize(windowBackgroundWidth, windowBackgroundHeight);
        this.windowBackground.setDepth(1);

        let arrowButtonSize = 75;
        let leftArrowX = windowBackgroundPosX - arrowButtonSize * 0.5;
        let arrowY = windowCenterY - arrowButtonSize * 0.5;
        this.leftArrow = scene.add.image(leftArrowX, arrowY, ShopWindow.prefix + 'leftDisabledArrowButton').setOrigin(0);
        this.leftArrow.setInteractive();
        this.leftArrow.setDisplaySize(arrowButtonSize, arrowButtonSize);
        this.leftArrow.setDepth(2);
        this.leftArrow.on('pointerdown', () => {
            this.startShopItemInd -= this.shopItemLen;
            this.startShopItemInd = Math.max(this.startShopItemInd, 0);
            this.#updateShopItemsDisplay();
        });

        let rightArrowX = leftArrowX + windowBackgroundWidth;
        this.rightArrow = scene.add.image(rightArrowX, arrowY, ShopWindow.prefix + 'rightActiveArrowButton').setOrigin(0);
        this.rightArrow.setInteractive();
        this.rightArrow.setDisplaySize(arrowButtonSize, arrowButtonSize);
        this.rightArrow.setDepth(2);
        this.rightArrow.on('pointerdown', () => {
            if(this.startShopItemInd + this.shopItemLen > this.buyItems.length - 1){
                return;
            }
            this.startShopItemInd += this.shopItemLen;
            this.#updateShopItemsDisplay();
        });

        let closeButtonSize = 50;
        let closeButtonX = windowCenterX + windowBackgroundWidth * 0.15;
        let closeButtonY = windowCenterY - windowBackgroundHeight * 0.33;
        let closeButton = scene.add.image(closeButtonX, closeButtonY, ShopWindow.prefix + 'closeIcon');
        closeButton.setInteractive();
        closeButton.setDisplaySize(closeButtonSize, closeButtonSize);
        closeButton.setDepth(2);
        closeButton.on('pointerdown', () => {
            this.hideWindow();
        });

        let shopItemOffset = 10;
        let shopItemWidth = 200;
        let shopItemHeight = 250;
        let shopItemPositionX = leftArrowX + shopItemWidth * 0.5 + arrowButtonSize + shopItemOffset;
        let shopItemPositionY = windowCenterY + 25;
        this.shopItems = [];
        let shopPhaserItems = [];
        this.startShopItemInd = 0;
        this.shopItemLen = 3;
        for (let i = 0; i < this.shopItemLen; i++) {
            let shopItem = new ShopItem(
                scene,
                /**
                 * @param {BuyItem} item 
                 */
                (item) => {
                    if(this.inventory.money < item.price){
                        return;
                    }
                    this.inventoryItemContainer.push(item);
                    this.inventory.money -= item.price;
                    this.coinText.text = this.inventory.money.toString();
                    this.#updateShopItemsDisplay();
                },
                shopItemPositionX, shopItemPositionY, shopItemWidth, shopItemHeight);
            shopItem.fillWith(this.buyItems[i], this.inventory.money);
            let shopPhaserItem = shopItem.container;
            shopPhaserItem.setDepth(2);
            this.shopItems.push(shopItem);
            shopPhaserItems.push(shopPhaserItem);
            shopItemPositionX += shopItemWidth + shopItemOffset;
        }

        let coinContainer = scene.add.container(0, 0);

        let coinIconSize = 30;
        let coinIcon = scene.add.image(0,0, ShopWindow.prefix + 'coinIcon').setOrigin(0.5, 0.5);
        coinIcon.setDisplaySize(coinIconSize, coinIconSize);
        this.coinText = scene.add.text(-coinIconSize * 0.5, 0, this.inventory.money.toString(), {
            fontSize: '16px',
            color: '#000000',
        }).setOrigin(1, 0.5);
        coinContainer.add(coinIcon);
        coinContainer.add(this.coinText);
        coinContainer.setDepth(2);
        coinContainer.setPosition(windowCenterX, closeButtonY);

        this.windowContainer = scene.add.container(0, 0);
        this.windowContainer.add(this.background);
        this.windowContainer.add(this.windowBackground);
        this.windowContainer.add(this.leftArrow);
        this.windowContainer.add(this.rightArrow);
        this.windowContainer.add(closeButton);
        this.windowContainer.add(coinContainer);
        for (let i = 0; i < shopPhaserItems.length; i++) {
            this.windowContainer.add(shopPhaserItems[i]);
        }

        this.windowContainer.setPosition(0, 0);
        this.windowContainer.setDepth(20);
        this.windowContainer.setVisible(false);

        scene.cameras.main.on('cameramove', (camera, progress, oldPosition, newPosition) => {
            this.windowContainer.setPosition(0, 0);
        });

        this.#updateShopItemsDisplay();
    }

    #updateShopItemsDisplay() {
        let itemInd = this.startShopItemInd; 
        for (let i = 0; i < this.shopItemLen; i++, itemInd++) {
            if (itemInd >= this.buyItems.length) {
                this.shopItems[i].hide();
                continue;
            }
            this.shopItems[i].show();
            this.shopItems[i].fillWith(this.buyItems[itemInd], this.inventory.money);
        }
        if (this.startShopItemInd == 0) {
            this.leftArrow.setTexture(ShopWindow.prefix + 'leftDisabledArrowButton');
        } else {
            this.leftArrow.setTexture(ShopWindow.prefix + 'leftActiveArrowButton');
        }
        if (this.startShopItemInd + this.shopItemLen < this.buyItems.length) {
            this.rightArrow.setTexture(ShopWindow.prefix + 'rightActiveArrowButton');
        } else {
            this.rightArrow.setTexture(ShopWindow.prefix + 'rightDisabledArrowButton');
        }
    }

    /**
     * @param {Array<BuyItem>} items 
     */
    updateShopItems(items){
        this.items = items;
        this.#updateShopItemsDisplay();
    }

    hideWindow() {
        ShopWindow.isWindowOpen = false;
        this.windowContainer.setVisible(false);
    }

    showWindow() {
        ShopWindow.isWindowOpen = true;
        this.startShopItemInd = 0;
        this.#updateShopItemsDisplay();
        this.coinText.text = this.inventory.money.toString();
        this.windowContainer.setVisible(true);
    }
}