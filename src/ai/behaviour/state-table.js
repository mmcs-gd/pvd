import { State } from "./state.js";

class StateTableRow {
    /** @param {State} inState */
    /** @param {function} condition */
    /** @param {State} outState */
    constructor(inState, condition, outState) {
        this.inState = inState;
        this.condition = condition;
        this.outState = outState;
    }
}
class StateTable {
    /** @type {State} */ #initialState;

    constructor(context = null) {
        this.stateRows = [];
        this.context = context;
        this.#initialState = null;
    }

    get initialState() {
        return this.#initialState;
    }

    /** @param {State} state  */
    set initialState(state) {
        this.#initialState = state;
        this.#initialState.onStateEnter(null);
    }

    /** @param {StateTableRow} stateRow */
    addStateRow(stateRow)
    {
        this.stateRows.push(stateRow);
        if (this.#initialState == null) {
            this.#initialState = stateRow.inState;
            this.#initialState.onStateEnter(null);
        }
    }

    /** @param {State} current */
    getNextState(current)
    {
        const row = this.stateRows
            .filter(x => x.inState === current)
            .find((x)=>x.condition(this.context));
        if (row)
        {
            if (current.onStateExit)
            {
                current.onStateExit(this.context);
            }
            if (row.outState.onStateEnter) {
                row.outState.onStateEnter(this.context);
            }
            return row.outState;
        }
        return current;
    }
}
export {StateTableRow, StateTable};