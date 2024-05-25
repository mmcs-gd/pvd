// import { importsToMap } from 'src/utils/resource-loaders/importsToMap.js';
import { pathsToImportMap } from 'src/utils/adapters/paths-to-import-map.js';

/*const bodiesPath = '/assets/sprites/pack/Characters/chickens/';

/!** @type {Record<string, string>} *!/
const bodiesImports = import.meta.glob('/assets/sprites/pack/Characters/chickens/!*.png', {
    eager: true,
    query: '?url',
    import: 'default',
});*/

const bodiesPath = 'sprites/pack/Characters/chickens';

export const bodiesMap = pathsToImportMap(
    Array.from({length: 10}, (_, i) => i + 1)
        .map(i => `${bodiesPath}/${i}c.png?url`),
    /(\d+)c/
);

// export const bodiesMap = importsToMap(bodiesImports, bodiesPath);
