import Unit from "src/objects/Unit.js";
import { StateTable, StateTableRow } from "./state-table.js";
import { FiniteStateMachine, State } from "./state.js";
import { PatrolState } from "./states/patrol.js";
import { RunToTargetState } from "./states/run-to-target.js";
import Vector2 from 'phaser/src/math/Vector2.js'

export class DogStateTable extends StateTable {
    /** @type {Unit} */ owner;
    /** @type {PatrolState} */ #patrolState;
    /** @type {RunToTargetState} */ #runToTargetState;

    constructor(owner, context) {
        super(context);
        this.owner = owner;
        this.#patrolState = null;
        this.#runToTargetState = null;
        this.initialState = this.patrolState;
        const stateTableRow = new StateTableRow(this.patrolState, 
                                           this.patrolState.conditionToTransform, 
                                           this.runToTargetState)
        this.addStateRow(stateTableRow);
    }

    get patrolState() {
        if (this.#patrolState == null)
            this.#patrolState = new PatrolState(this.owner, 30);

        return this.#patrolState
    }

    get runToTargetState() {
        return new RunToTargetState(this.owner, 5);
    }
}

export class DogStateMachine extends FiniteStateMachine {
    /** @type {Unit} */ owner;

    constructor(owner, context) {
        const table = new DogStateTable(owner, context);
        super(table);
    }
}