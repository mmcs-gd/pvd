import Vector2 from 'phaser/src/math/Vector2.js';
import { PatrolSteering } from 'src/ai/steerings/patrol-steering.js';
import SteeringManager from 'src/ai/steerings/steering-manager.js';
import Unit from 'src/objects/Unit.js';
import { State } from '../state.js';

export class PatrolState extends State {
    /** @type {SteeringManager} */ steeringManager;

    constructor(owner, aggroDistance) {
        super(owner);
        this.steeringManager = owner.steeringManager;
        const force = 40;
        this.aggroDistance = aggroDistance;
    }

    onStateEnter = (context) => {
        console.log("Patrol enter!");
        this.patrolSteering = new PatrolSteering(this.owner, [], 40);
        this.steeringManager.addSteering(this.patrolSteering);
        this.steeringManager.addMoveForce();
    }

    onStateExit = (context) => {
        console.log("OnExit");
        this.steeringManager.removeLastSteering();
        this.steeringManager.removeMoveForce();
    }

    update(time, delta) {
        this.steeringManager.update();
    }

    conditionToTransform = (context) => {
        return context.enemies.some(enemy => this.owner.bodyPosition.distance(enemy.bodyPosition) < this.aggroDistance);
    }
}