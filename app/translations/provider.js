import tr from "./tr";

let provider = {
    activeLang : "tr",
    get : (keyName) => {
        return tr[keyName];
    }
}

export {provider};