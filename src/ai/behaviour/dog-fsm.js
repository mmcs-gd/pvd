import Unit from "src/objects/Unit.js";
import { StateTable, StateTableRow } from "./state-table.js";
import { FiniteStateMachine, State } from "./state.js";
import { PatrolState } from "./states/patrol.js";
import { PursuitAndAttackState } from "./states/pursuit-and-attack.js";
import Vector2 from 'phaser/src/math/Vector2.js'

export class DogStateTable extends StateTable {
    /** @type {Unit} */ owner;
    /** @type {PatrolState} */ #patrolState;
    /** @type {PursuitAndAttackState} */ #pursuitAndAttackState;

    constructor(owner, context) {
        super(context);
        this.owner = owner;
        this.#patrolState = null;
        this.#pursuitAndAttackState = null;
        this.initialState = this.patrolState;
        const stateTableRow1 = new StateTableRow(this.patrolState, 
                                           this.patrolState.conditionToTransform, 
                                           this.pursuitAndAttackState)
        this.addStateRow(stateTableRow1);

        const stateTableRow2 = new StateTableRow(this.pursuitAndAttackState, 
                                           this.pursuitAndAttackState.shouldLoseTarget, 
                                           this.patrolState)
        this.addStateRow(stateTableRow1);
        this.addStateRow(stateTableRow2);
    }

    get patrolState() {
        if (this.#patrolState == null)
            this.#patrolState = new PatrolState(this.owner, 300);

        return this.#patrolState
    }

    get pursuitAndAttackState() {
        if (this.#pursuitAndAttackState == null) 
            this.#pursuitAndAttackState = new PursuitAndAttackState(this.owner, 300, 100);

        return this.#pursuitAndAttackState;
    }
}