import data from './data.json';
import { jsonToMap } from 'src/resources/db/utils/json-to-map.js';

const penguinsDB = jsonToMap(data);

export {
    penguinsDB
};