import Unit from "src/objects/Unit.js";
import { StateTable } from "./state-table.js";

export class State {
    /** @type {function} */ onStateEnter;
    /** @type {function} */ onStateExit;
    /** @type {Unit} */ owner;

    constructor(owner) {
        this.owner = owner
    }

    update() {}
}

export class FiniteStateMachine {
    /** @type {StateTable} */ stateTable;
    /** @type {State} */ currentState;

    /** @param {StateTable} stateTable */
    constructor(stateTable) {
        this.stateTable = stateTable;
        this.currentState = stateTable.initialState;
    }

    update() {
        this.currentState.update();
        this.currentState = this.stateTable.getNextState(this.currentState);
    }
}