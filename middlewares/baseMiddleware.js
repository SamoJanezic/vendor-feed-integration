export function separateKeysAndValues(req, res) {
    if (req.body && typeof req.body === 'object') {
        const { id, ...rest } = req.body;
        req.keys = Object.keys(rest);
        req.values = Object.values(rest);
    }
}

export function formatAndUpdate(obj) {
    let arr = [];
    let id = null;
    for (let key in obj) {
        if (key === "id") {
            id = obj.id;
        } else {
            arr.push(`"${key}" = "${obj[key]}"`);
        }
    }
    return { id, arr };
}


export function readId(data) {
    let id = null;
    Object.keys(data).forEach(key => {
        id = data[key];
    });
    return id;
}