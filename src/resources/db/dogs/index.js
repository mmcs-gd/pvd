import data from './data.json';
import { jsonToMap } from 'src/resources/db/utils/json-to-map.js';

const dogsDB = jsonToMap(data);


export {
    dogsDB
};