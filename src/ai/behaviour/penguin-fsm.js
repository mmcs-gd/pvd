import Unit from "src/objects/Unit.js";
import { StateTable, StateTableRow } from "./state-table.js";
import { FiniteStateMachine, State } from "./state.js";
import { SteeringUntilAggroState } from "./states/steering-until-aggro.js";
import { PursuitAndAttackState } from "./states/pursuit-and-attack.js";
import Vector2 from 'phaser/src/math/Vector2.js'

export class PenguinStateTable extends StateTable {
    /** @type {Unit} */ owner;
    /** @type {SteeringUntilAggroState} */ #goToTargetState;
    /** @type {PursuitAndAttackState} */ #pursuitAndAttackState;

    constructor(owner, context) {
        super(context);
        this.owner = owner;
        this.#goToTargetState = null;
        this.#pursuitAndAttackState = null;
        this.initialState = this.goToTargetState;
        const stateTableRow1 = new StateTableRow(this.goToTargetState, 
                                           this.goToTargetState.conditionToTransform, 
                                           this.pursuitAndAttackState)
        this.addStateRow(stateTableRow1);

        const stateTableRow2 = new StateTableRow(this.pursuitAndAttackState, 
                                           this.pursuitAndAttackState.shouldLoseTarget, 
                                           this.goToTargetState)
        this.addStateRow(stateTableRow1);
        this.addStateRow(stateTableRow2);
    }

    get goToTargetState() {
        if (this.#goToTargetState == null)
            this.#goToTargetState = new SteeringUntilAggroState(this.owner, 400, "go_to_target");

        return this.#goToTargetState
    }

    get pursuitAndAttackState() {
        if (this.#pursuitAndAttackState == null) 
            this.#pursuitAndAttackState = new PursuitAndAttackState(this.owner, 400, 300);

        return this.#pursuitAndAttackState;
    }
}