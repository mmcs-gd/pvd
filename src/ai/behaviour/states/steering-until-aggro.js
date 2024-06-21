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
        this.steering = null;
    }

    choseSteering = (steeringName) => {
        switch (steeringName) {
            case "patrol":{
                if (this.steering === null) {
                    this.steering = new PatrolSteering(this.owner, [], 40);
                }
                return this.steering;
            }
            case "go_to_target": {
                if (this.steering === null) {
                    this.steering = new GoToTargetSteering(this.owner, [], 40);
                }

                return this.steering;
            }
        }
    }

    onStateEnter = (context) => {
        console.log("Enter steering until aggro");
        this.steering = this.choseSteering(this.steeringName);
        this.steeringManager.addSteering(this.steering);
        // this.steeringManager.addMoveForce();
        if (this.steeringName == "go_to_target") {
            // @ts-ignore
            console.log(this.steering.targetPoint);
            console.log(this.owner.bodyPosition);
        }
    }

    onStateExit = (context) => {
        console.log("Enter steering until aggro");
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