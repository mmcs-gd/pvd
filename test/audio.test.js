import { expect } from "chai";
import { AudioType, Sound, AudioManager } from "../src/audio/audio-manager.js";
import sinon from "sinon";

describe("AudioType", () => {
  it("should have SFX and Music symbols", () => {
    expect(AudioType.SFX).to.be.a("symbol");
    expect(AudioType.Music).to.be.a("symbol");
    expect(AudioType.SFX.description).to.equal("sfx");
    expect(AudioType.Music.description).to.equal("music");
  });
});

describe("Sound", () => {
  it("should create a Sound object with specified parameters", () => {
    const id = "testSound";
    const assets = ["test.mp3"];
    const loop = true;
    const type = AudioType.Music;
    const base_volume = 0.5;
    const sound = new Sound(id, assets, loop, type, base_volume);

    expect(sound.id).to.equal(id);
    expect(sound.assets).to.equal(assets);
    expect(sound.loop).to.equal(loop);
    expect(sound.type).to.equal(type);
    expect(sound.base_volume).to.equal(base_volume);
    expect(sound.handle).to.be.null;
  });
});

// describe("AudioManager", () => {
//   let sceneMock;
//   let audioManager;

//   beforeEach(() => {
//     sceneMock = {
//       load: { audio: sinon.spy() },
//       sound: { add: sinon.stub().returns({ play: sinon.spy() }) },
//     };
//     audioManager = new AudioManager("assets", sceneMock);
//   });

//   it("should create an AudioManager instance with specified parameters", () => {
//     expect(audioManager).to.be.an.instanceof(AudioManager);
//   });

//   it("should add sounds to the library", () => {
//     audioManager.addSound("testSound", ["test.mp3"], false, AudioType.SFX, 1.0);

//     const sound = audioManager.#soundLibrary["testSound"];
//     expect(sound).to.be.an.instanceof(Sound);
//     expect(sound.id).to.equal("testSound");
//     expect(sound.assets).to.deep.equal(["assets/test.mp3"]);
//     expect(sound.loop).to.be.false;
//     expect(sound.type).to.equal(AudioType.SFX);
//     expect(sound.base_volume).to.equal(1.0);
//   });

//   it("should load all sounds on preload", () => {
//     audioManager.addSound("testSound", ["test.mp3"], false, AudioType.SFX, 1.0);
//     audioManager.on_preload();

//     expect(sceneMock.load.audio.calledOnce).to.be.true;
//     expect(sceneMock.load.audio.calledWith("testSound", ["assets/test.mp3"])).to
//       .be.true;
//   });

//   it("should add all sounds to the scene on create", () => {
//     audioManager.addSound("testSound", ["test.mp3"], false, AudioType.SFX, 1.0);
//     audioManager.on_create();

//     const sound = audioManager.#soundLibrary["testSound"];
//     expect(sceneMock.sound.add.calledOnce).to.be.true;
//     expect(
//       sceneMock.sound.add.calledWith("testSound", {
//         loop: sound.loop,
//         volume: sound.base_volume,
//       })
//     ).to.be.true;
//     expect(sound.handle).to.have.property("play");
//   });

//   it("should play a sound", () => {
//     audioManager.addSound("testSound", ["test.mp3"], false, AudioType.SFX, 1.0);
//     audioManager.on_create();
//     audioManager.play("testSound");

//     const sound = audioManager.#soundLibrary["testSound"];
//     expect(sound.handle.play.calledOnce).to.be.true;
//   });
// });
