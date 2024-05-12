/**
 * @param {Array<string>} array
 * @param {RegExp} pattern
 * @returns {Record<string, string>}
 */
const pathsToImportMap = (array, pattern) => {
    const result = {};

    array.forEach(str => {
        const match = str.match(pattern);
        if (match) {
            const key = match[0];
            result[key] = str;
        }
    });

    return result;
};

export {
    pathsToImportMap
};