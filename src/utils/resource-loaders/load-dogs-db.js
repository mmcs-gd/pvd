import { Dog } from 'src/modules/Dog/Dog.js';
import { dogsDB } from 'src/resources/db/dogs/index.js';

const loadDogsFromDB = (
    dogs,
    {
        scene
    }
) => {
    const dogsNames = dogs.map((dogs) => dogs.name);
    const dogsConfigs = Object.fromEntries(
        dogsNames.map(id => [id, dogsDB[id]])
    );

    return dogsNames.map(
        (id, idx) => new Dog(scene, 0, 0, {
            health: dogsConfigs[id].health,
            reward: dogsConfigs[id].reward,
            assetKey: dogsConfigs[id].assetKey,
        })
    );
};



export {
    loadDogsFromDB
};