// import { importsToMap } from 'src/utils/resource-loaders/importsToMap.js';
import { pathsToImportMap } from 'src/utils/adapters/paths-to-import-map.js';

/*const gunsPath = '/assets/sprites/pack/Characters/guns/';

/!** @type {Record<string, string>} *!/
const gunsImports = import.meta.glob('/assets/sprites/pack/Characters/guns/!*.png', {
    eager: true,
    query: '?url',
    import: 'default',
});*/

/**
 * @param {Record<string, string>} imports
 * @param {string} baseUrl
 * @returns {Record<string, string>}
 */

const basePath = 'sprites/pack/Characters/guns';

export const gunsMap = pathsToImportMap(
    Array.from({length: 10}, (_, i) => i + 1)
        .map(i => `${basePath}/${i}g.png?url`),
    /(\d+)g/
);

// export const gunsMap = importsToMap(gunsImports, gunsPath);
