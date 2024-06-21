export class Blackboard {
    constructor(penguins, dogs) {
        this.penguins = penguins;
        this.dogs = dogs;
        this.targetsForDogs = new Map();
        this.pickedPenguins = new Map();
    }

    pickTargetForDog(dog, penguin) {
        this.targetsForDogs[dog.name] = penguin;
    }

    tryPickBestTargetForDog(dog, filter) {
        const filtered = this.penguins.filter((dog) => filter(dog));
        const notPicked = filtered.filter((penguin) => this.targetsForDogs.values())
    }
}