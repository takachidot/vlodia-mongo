import set from "lodash.set";
import get from "lodash.get";
import has from "lodash.has";
import unset from "lodash.unset";
import remove from "lodash.remove"

function cloneDeep(obj: any): any {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => cloneDeep(item));
    }
    const copy: { [key: string]: any } = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = cloneDeep(obj[key]);
        }
    }
    return copy;
}


export { set, get, has, unset, remove, cloneDeep };