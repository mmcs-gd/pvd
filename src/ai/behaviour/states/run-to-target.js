import Vector2 from 'phaser/src/math/Vector2.js';
import SteeringManager from 'src/ai/steerings/steering-manager.js';
import Unit from 'src/objects/Unit.js';
import { State } from '../state.js';

export class RunToTargetState extends State {
    /** @type {Unit} */ owner;
    /** @type {SteeringManager} */ steeringManager;
    
    constructor(owner, acceptableRange) {
        super(owner);
        this.steeringManager = owner.steeringManager;
        this.acceptableRange = acceptableRange;
    }

    onStateEnter = (context) => {
        console.log("Run to target state enter!");
    }

    onStateExit = (context) => {
        console.log("Run to target state exit!");
    }

    update() {
    }
}