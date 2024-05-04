import shopItemBackground from '../../assets/sprites/pack/UI/Shopping Screen/Artboard 3.png';;
import activeBuyButton from '../../assets/sprites/pack/UI/Shopping Screen/Artboard 3 copy.png';
import disabledBuyButton from '../../assets/sprites/pack/UI/Shopping Screen/Artboard 3 copy 4.png';
import goldIcon from '../../assets/sprites/pack/UI/Shopping Screen/Artboard 8.png';
import BuyItem from '../buy-item.js';

export default class ShopItem {
    static /** @type {string} */ prefix;

    constructor(scene, onBuyCallback, positionX, positionY, width, height) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = height;
        this.onBuyCallback = onBuyCallback;
        this.item = null;
        this.create(scene);
    }

    static preload(scene, prefix) {
        ShopItem.prefix = prefix;
        scene.load.image(ShopItem.prefix + 'shopItemBackground', shopItemBackground);
        scene.load.image(ShopItem.prefix + 'activeBuyButton', activeBuyButton);
        scene.load.image(ShopItem.prefix + 'disabledBuyButton', disabledBuyButton);
        scene.load.image(ShopItem.prefix + 'goldIcon', goldIcon);
    }

    create(scene) {
        this.container = scene.add.container(0.5, 0.5);

        let background = scene.add.image(0, 0, ShopItem.prefix + 'shopItemBackground').setOrigin(0.5,0.5);
        background.setDisplaySize(this.width, this.height);

        let imageSize = this.width * 0.1;
        let imagePosY = -40;
        this.itemImage = scene.add.image(0, imagePosY);
        this.itemImage.setDisplaySize(imageSize, imageSize);
        this.itemImage.setDepth(1);

        let descriptionPosY = 10;
        let textPadding = 40;
        this.description = scene.add.text(-this.width * 0.5 + textPadding, descriptionPosY, 'Empty Description', {
            fontSize: '16px',
            fill: '#ffffff',
            wordWrap: { width: this.width - textPadding * 2 },
        })
        this.description.setDepth(1);

        let buyButtonContainer = scene.add.container(0,0);
        let buyButtonWidth = this.width * 0.7;
        let buyButtonHeight = 40;
        this.buyButton = scene.add.image(0, 0, ShopItem.prefix + 'activeBuyButton').setOrigin(0.5).setInteractive();
        this.buyButton.setDisplaySize(buyButtonWidth, buyButtonHeight);
        this.buyButton.on('pointerdown', () => {
            this.onBuyCallback(this.item);
        });
        this.buyCostText = scene.add.text(0, 0, '1000', {
            fontSize: '16px',
            fill: '#ffffff',
            wordWrap: { width: buyButtonWidth - 10 },
        }).setOrigin(0.5);
        this.buyCostText.setDepth(1);

        buyButtonContainer.add(this.buyButton);
        buyButtonContainer.add(this.buyCostText);
        buyButtonContainer.setPosition(0, this.height *0.5 -buyButtonHeight);
        buyButtonContainer.setDepth(1);

        this.container.add(background);
        this.container.add(this.itemImage);
        this.container.add(this.description);
        this.container.add(buyButtonContainer);

        this.container.setPosition(this.positionX, this.positionY);
    }

    /**
     * @param {BuyItem} item 
     * @param {Number} money 
     * @returns 
     */
    fillWith(item, money) {
        this.item = item;
        
        if(item == null){
            this.itemImage.setTexture(null);    
            this.description.setText('');
            this.buyCostText.setText('');
            this.buyButton.setTexture(ShopItem.prefix + 'disabledBuyButton');
            this.buyButton.setInteractive(false);
            return;
        }
        this.itemImage.setTexture(item.spriteName);
        this.description.setText(item.description);
        this.buyCostText.setText(item.price);
        if(money < item.price) {
            this.buyButton.setTexture(ShopItem.prefix + 'disabledBuyButton');
            this.buyButton.setInteractive(false);
        } else {
            this.buyButton.setTexture(ShopItem.prefix + 'activeBuyButton');
            this.buyButton.setInteractive(true);
        }
    }
    hide() {
        this.container.setVisible(false);
    }
    show() {
        this.container.setVisible(true);
    }
}