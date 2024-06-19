import { pathsToImportMap } from 'src/utils/adapters/paths-to-import-map.js';

const basePath = 'sprites/pack/Characters/Dogs';

export const dogsMap = pathsToImportMap(
    Array.from({ length: 10 }, (_, i) => `Dog0${i + 1}/Idle/Idle_00.png?url`)
        .map(path => `${basePath}/${path}`),
    /Dog0(\d+)/
);
