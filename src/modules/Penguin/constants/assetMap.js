import { importsToMap } from 'src/utils/resource-loaders/importsToMap.js';

const bodiesPath = '/assets/sprites/pack/Characters/chickens/';

/** @type {Record<string, string>} */
const bodiesImports = import.meta.glob('/assets/sprites/pack/Characters/chickens/*.png', {
    eager: true,
    query: '?url',
    import: 'default',
});

/**
 * @param {Record<string, string>} imports
 * @param {string} baseUrl
 * @returns {Record<string, string>}
 */

export const bodiesMap = importsToMap(bodiesImports, bodiesPath);