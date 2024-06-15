// test/animationLoader.test.js

import { expect } from 'chai';
import sinon from 'sinon';
import AnimationLoader from '../src/utils/resource-loaders/animation-loader.js';

describe('AnimationLoader', () => {
  let scene;
  let animsCreateStub;
  let generateFrameNumbersStub;
  let loader;
  const spritesheet = 'testSpritesheet';
  const config = {
    run: { start: [0, 1, 2], end: [3, 4, 5] },
    jump: { up: [6, 7, 8], down: [9, 10, 11] },
  };

  beforeEach(() => {
    scene = {
      anims: {
        create: sinon.stub(),
        generateFrameNumbers: sinon.stub().returns([])
      }
    };

    animsCreateStub = scene.anims.create;
    generateFrameNumbersStub = scene.anims.generateFrameNumbers;

    loader = new AnimationLoader(scene, spritesheet, config);
  });

  describe('constructor', () => {
    it('should initialize with given parameters', () => {
      expect(loader.scene).to.equal(scene);
      expect(loader.spritesheet).to.equal(spritesheet);
      expect(loader.config).to.deep.equal(config);
      expect(loader.prefix).to.equal('');
      expect(loader.frameRate).to.equal(5);
      expect(loader.repeat).to.equal(-1);
    });
  });

  describe('createAnimations', () => {
    it('should create animation groups and return a map', () => {
      const animationGroups = loader.createAnimations();
      expect(animationGroups).to.be.instanceof(Map);
      expect(animationGroups.size).to.equal(2);
      expect(animationGroups.get('run')).to.deep.equal(['runstart', 'runend']);
      expect(animationGroups.get('jump')).to.deep.equal(['jumpup', 'jumpdown']);
    });
  });

  describe('parseAnimationsGroup', () => {
    it('should create animations and return their names', () => {
      const animationNames = loader.parseAnimationsGroup('', 'run', config.run);
      expect(animationNames).to.deep.equal(['runstart', 'runend']);
      expect(animsCreateStub.calledTwice).to.be.true;
      expect(animsCreateStub.firstCall.args[0]).to.deep.include({
        key: 'runstart',
        frameRate: 5,
        repeat: -1,
      });
      expect(animsCreateStub.secondCall.args[0]).to.deep.include({
        key: 'runend',
        frameRate: 5,
        repeat: -1,
      });
    });
  });

  describe('createAnimation', () => {
    it('should create a single animation', () => {
      loader.createAnimation('runstart', [0, 1, 2], 10, 0);
      expect(animsCreateStub.calledOnce).to.be.true;
      expect(animsCreateStub.firstCall.args[0]).to.deep.include({
        key: 'runstart',
        frameRate: 10,
        repeat: 0,
      });
    });
  });
});
