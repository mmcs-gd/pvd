/**
 * @param {Record<string, string>} imports
 * @param {string} baseUrl
 * @returns {Record<string, string>}
 */
export const importsToMap = (imports, baseUrl) =>
    Object.fromEntries(  
        Object.entries(imports).map(([key, value]) => [
            key.replace(baseUrl, '').replace(/\.\w+$/, ''),
            value.replace('/assets', ''),
        ])
    );
