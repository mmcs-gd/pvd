import { StateTable } from "./state.js";
import { RunToTargetState } from "./states/run-to-target.js";

export class DogStateTable extends StateTable{
    constructor(dog) {
        const initialState = new RunToTargetState()
    }
}