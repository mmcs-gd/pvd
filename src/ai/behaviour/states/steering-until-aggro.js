import Vector2 from 'phaser/src/math/Vector2.js';
import { PatrolSteering } from 'src/ai/steerings/patrol-steering.js';
import SteeringManager from 'src/ai/steerings/steering-manager.js';
import Unit from 'src/objects/Unit.js';
import { State } from '../state.js';
import { GoToTargetSteering } from 'src/ai/steerings/go-to-target-steering.js';

export class SteeringUntilAggroState extends State {
    /** @type {SteeringManager} */ steeringManager;
    /** @type {PatrolSteering | GoToTargetSteering} */ steering;

    /** @param {"patrol" | "go_to_target"} steeringName */
    constructor(owner, aggroDistance, steeringName = "patrol") {
        super(owner);
        this.steeringManager = owner.steeringManager;
        this.aggroDistance = aggroDistance;
        this.steeringName = steeringName;
    }

    choseSteering = (steeringName) => {
        switch (steeringName) {
            case "patrol":
                return new PatrolSteering(this.owner, [], 40);
            case "go_to_target":
                return new GoToTargetSteering(this.owner, [], 40);
        }
    }

    onStateEnter = (context) => {
        this.steering = this.choseSteering(this.steeringName);
        this.steeringManager.addSteering(this.steering);
        // this.steeringManager.addMoveForce();
    }

    onStateExit = (context) => {
        this.steeringManager.removeLastSteering();
        // this.steeringManager.removeMoveForce();
    }

    update(time, delta) {
        this.steeringManager.update();
    }

    conditionToTransform = (context) => {
        return context.enemies.some(enemy => this.owner.bodyPosition.distance(enemy.bodyPosition) < this.aggroDistance);
    }
}