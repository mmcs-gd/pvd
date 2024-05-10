import { importsToMap } from 'src/utils/resource-loaders/importsToMap.js';

const gunsPath = '/assets/sprites/pack/Characters/guns/';

/** @type {Record<string, string>} */
const gunsImports = import.meta.glob('/assets/sprites/pack/Characters/guns/*.png', {
    eager: true,
    query: '?url',
    import: 'default',
});

/**
 * @param {Record<string, string>} imports
 * @param {string} baseUrl
 * @returns {Record<string, string>}
 */

export const gunsMap = importsToMap(gunsImports, gunsPath);
