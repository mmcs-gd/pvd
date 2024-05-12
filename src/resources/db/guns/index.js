import data from './data.json';
import { jsonToMap } from 'src/resources/db/utils/json-to-map.js';

const gunsDB = jsonToMap(data);

export {
    gunsDB
};