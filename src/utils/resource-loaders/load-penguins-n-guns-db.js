import { Gun } from 'src/modules/Gun/Gun.js';
import { gunsDB } from 'src/resources/db/guns/index.js';
import { Penguin } from 'src/modules/Penguin/Penguin.js';
import { penguinsDB } from 'src/resources/db/penguins/index.js';

const loadPenguinsNGunsFromDB = (
    pairs,
    {
        scene,
        target,
        sceneCenter
    }
) => {
    const gunsIds = [...new Set(pairs.map((pair) => pair.gunId))];
    const gunsConfigs = Object.fromEntries(
        gunsIds.map(id => [id, new Gun(gunsDB[id])])
    );

    const penguinsIds = pairs.map((pair) => pair.penguinId);
    const penguinsConfigs = Object.fromEntries(
        penguinsIds.map(id => [id, penguinsDB[id]])
    );

    const penIdToGunId = Object.fromEntries(pairs.map(
        ({penguinId, gunId}) => [penguinId, gunId]
    ));


    return penguinsIds.map(
        (id, idx) => new Penguin(scene, 0, 0, {
            bodyKey: penguinsConfigs[id].assetKey,
            gunConfig: gunsConfigs[penIdToGunId[id]],
            target,
            faceToTarget: true,
            stats: Object.fromEntries(
                Object.entries(penguinsConfigs[id]).filter(
                    ([key, val]) => key !== 'id' && key !== 'assetKey'
                )
            ),
        })
    );
};

export {
    loadPenguinsNGunsFromDB
};