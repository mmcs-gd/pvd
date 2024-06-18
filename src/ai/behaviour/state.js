class StateTableRow {
    constructor(initialState, condition, finalState, onStateChanged = null) {
        this.initialState = initialState;
        this.condition = condition;
        this.finalState = finalState;
        this.onStateChanged = onStateChanged;
    }
}
class StateTable {
    constructor(initialState, context = null) {
        this.states = [initialState];
        this.initialState = initialState;
        this.context = context;
    }

    addState(state)
    {
        this.states.push(state);
    }

    getNextState(current)
    {
        const row = this.states
            .filter(x => x.initialState === current)
            .find(x=>x.condition.call(this.context));
        if (row)
        {
            if (row.onStateChanged)
            {
                row.onStateChanged.call(this.context);
            }
            return row.finalState;
        }
        return current;
    }
}
export {StateTableRow, StateTable};