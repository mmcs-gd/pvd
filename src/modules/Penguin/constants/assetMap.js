import { importsToMap } from 'src/utils/resource-loaders/importsToMap.js';

const bodiesPath = 'assets/bodies/';
const gunsPath = 'assets/guns/';

/** @type {Record<string, string>} */
const bodiesImports = import.meta.glob('assets/bodies/*.png', {
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