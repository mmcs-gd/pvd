const jsonToMap = (data) => Object.fromEntries(
    data.map((entry) => ([entry.id, entry]))
);

export {
    jsonToMap
};