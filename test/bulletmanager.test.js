// test/bulletsManager.test.js

import { expect } from "chai";
import sinon from "sinon";
// import Phaser from "phaser";
import { Bullet } from "../src/objects/Bullet.js";
import { BulletsManager } from "../src/systems/BulletsManager.js"
import { JSDOM } from "jsdom";
import globalJsdom from "global-jsdom";

describe("BulletsManager", () => {
  let cleanup;
  let scene;
  let addSpriteStub;
  let loadImageStub;

  before(() => {
    cleanup = globalJsdom();
  });

  after(() => {
    cleanup();
  });

  beforeEach(() => {
    scene = {
      load: {
        image: sinon.stub(),
      },
      add: {
        sprite: sinon.stub().returns({
          setDepth: sinon.stub(),
          setOrigin: sinon.stub(),
          destroy: sinon.stub(),
          width: 10,
          height: 10,
        }),
      },
      physics: {
        add: {
          existing: sinon.stub(),
          collider: sinon.stub(),
        },
      },
    };

    loadImageStub = scene.load.image;
    addSpriteStub = scene.add.sprite;

    BulletsManager.bullets = [];
    BulletsManager.blockedLayers = [];
    BulletsManager.depth = 0;
  });

  describe("preload", () => {
    it("should preload bullet assets", () => {
      BulletsManager.preload(scene);

      expect(loadImageStub.calledWith('bullet1', 'sprites/pack/Bullets/Bullets1.png')).to.be.true;
      expect(loadImageStub.calledWith('bullet2', 'sprites/pack/Bullets/Bullets2.png')).to.be.true;
      expect(loadImageStub.calledWith('bullet3', 'sprites/pack/Bullets/Bullets3.png')).to.be.true;
    });
  });

  describe("create", () => {
    it("should initialize bullets manager with empty bullets array and given parameters", () => {
      const blockedLayers = [{}];
      const depth = 1;

      BulletsManager.create(scene, blockedLayers, depth);

      expect(BulletsManager.bullets).to.be.an('array').that.is.empty;
      expect(BulletsManager.blockedLayers).to.equal(blockedLayers);
      expect(BulletsManager.depth).to.equal(depth);
    });
  });

  describe("update", () => {
    it("should update all bullets and remove destroyed ones", () => {
      const bullet1 = {
        update: sinon.stub(),
        destroyed: false,
      };
      const bullet2 = {
        update: sinon.stub(),
        destroyed: true,
      };

      BulletsManager.bullets = [bullet1, bullet2];

      BulletsManager.update(0.016);

      expect(bullet1.update.calledOnce).to.be.true;
      expect(bullet2.update.calledOnce).to.be.true;
      expect(BulletsManager.bullets).to.include(bullet1);
      expect(BulletsManager.bullets).to.not.include(bullet2);
    });
  });

//   describe("spawnBullet", () => {
//     it("should spawn a new bullet and add it to the bullets array", () => {
//       sinon.stub(Bullet.prototype, 'constructor').callsFake(function () {
//         this.scene = scene;
//         this.sprite = {
//           setDepth: sinon.stub(),
//           setOrigin: sinon.stub(),
//           destroy: sinon.stub(),
//           width: 10,
//           height: 10,
//         };
//         this.update = sinon.stub();
//         this.destroyed = false;
//       });

//       BulletsManager.create(scene);
//       BulletsManager.spawnBullet(scene);

//       expect(BulletsManager.bullets).to.have.lengthOf(1);
//       expect(BulletsManager.bullets[0]).to.be.an.instanceof(Bullet);

//       Bullet.prototype.constructor.restore();
//     });
//   });
});
