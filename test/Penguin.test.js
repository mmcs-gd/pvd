// import "module-alias/register.js";
// import { expect } from "chai";
// import sinon from "sinon";
// import Phaser from "phaser";
// import { Penguin } from "src/modules/Penguin/Penguin.js";

// import { gunsMap } from "src/modules/Gun/constants/assetMap.js";
// import { bodiesMap } from "src/modules/Penguin/constants/assetMap.js";
// import { Gun } from "src/modules/Gun/Gun.js";

// describe("Penguin", () => {
//   let scene;
//   let gunConfig;
//   let bodyKey;
//   let gunKey;
//   let stats;

//   beforeEach(() => {
//     scene = {
//       add: {
//         image: sinon.stub().returns({
//           setOrigin: sinon.spy(),
//           setTexture: sinon.spy(),
//           setScale: sinon.spy(),
//           getBounds: sinon.stub().returns({ centerX: 0 }),
//         }),
//         existing: sinon.spy(),
//       },
//     };

//     bodyKey = "defaultBody";
//     gunKey = "defaultGun";
//     stats = {}; 

//     bodiesMap[bodyKey] = "bodyTexture";
//     gunsMap[gunKey] = "gunTexture";

//     gunConfig = new Gun({
//       id: "gun1",
//       name: "Basic Gun",
//       assetKey: gunKey,
//       weaponType: "ranged",
//       damage: 10,
//       cost: 100,
//       range: 200,
//     });
//   });

//   it("should instantiate correctly with valid arguments", () => {
//     const penguin = new Penguin(scene, 0, 0, { bodyKey, gunConfig, stats });

//     expect(scene.add.image.calledTwice).to.be.true;
//     expect(scene.add.existing.calledWith(penguin)).to.be.true;
//   });

//   //   it("should throw an error if bodyKey is missing", () => {
//   //     expect(() => new Penguin(scene, 0, 0, { gunConfig, stats })).to.throw(
//   //       "Body key is required"
//   //     );
//   //   });

//   it("should throw an error if bodyKey is invalid", () => {
//     expect(
//       () => new Penguin(scene, 0, 0, { bodyKey: "invalid", gunConfig, stats })
//     ).to.throw("Body key invalid not found");
//   });

//   it("should update orientation based on target position", () => {
//     const penguin = new Penguin(scene, 0, 0, { bodyKey, gunConfig, stats });
//     const target = { x: 100, y: 100 };

//     penguin.setTarget(target);
//     penguin.update(0, 0);

//     expect(penguin.isForwardOrientation).to.be.true;
//   });

//   it("should set the gun rotation based on target position", () => {
//     const penguin = new Penguin(scene, 0, 0, { bodyKey, gunConfig, stats });
//     const target = { x: 100, y: 100 };

//     penguin.setTarget(target);
//     penguin.update(0, 0);

//     const rotation = Phaser.Math.Angle.Between(0, 0, target.x, target.y);
//     expect(scene.add.image().rotation).to.equal(rotation);
//   });

//   it("should change body texture when setBody is called", () => {
//     const penguin = new Penguin(scene, 0, 0, { bodyKey, gunConfig, stats });
//     const newBodyKey = "newBody";
//     bodiesMap[newBodyKey] = "newBodyTexture";

//     penguin.setBody(newBodyKey);

//     expect(scene.add.image().setTexture.calledWith(newBodyKey)).to.be.true;
//   });

//   it("should throw an error if setBody is called with an invalid key", () => {
//     const penguin = new Penguin(scene, 0, 0, { bodyKey, gunConfig, stats });

//     expect(() => penguin.setBody("invalid")).to.throw(
//       "Body key invalid not found"
//     );
//   });

//   it("should change gun texture when setGun is called", () => {
//     const penguin = new Penguin(scene, 0, 0, { bodyKey, gunConfig, stats });
//     const newGunKey = "newGun";
//     gunsMap[newGunKey] = "newGunTexture";

//     penguin.setGun(newGunKey);

//     expect(scene.add.image().setTexture.calledWith(newGunKey)).to.be.true;
//   });

//   it("should throw an error if setGun is called with an invalid key", () => {
//     const penguin = new Penguin(scene, 0, 0, { bodyKey, gunConfig, stats });

//     expect(() => penguin.setGun("invalid")).to.throw(
//       "Gun key invalid not found"
//     );
//   });
// });
