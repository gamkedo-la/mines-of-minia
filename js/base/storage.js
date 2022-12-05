// This file is designed to not crash if access to window.localstorage is not allowed.
// See the end of this file for the exports (they need to be after the definitons)

class LocalStorage {
    static setItem(key, value) {
        let str = JSON.stringify(value);
        localStorage.setItem(key, str);
    }

    static getItem(key) {
        let str = localStorage.getItem(key);
        if (str) {
            let value = JSON.parse(str);
            return value;
        }
        return null;
    }

    static removeItem(key) {
        localStorage.removeItem(key);
    }

}

class TemporaryStorage {

    storage = {};

    getItem(name){
        try{
            const item_str = storage[name];
            if(typeof item_str === 'string'){
                return JSON.parse(item_str);
            }
        } catch(error) {
            console.warn(`failed to get value in storage: ${error}`);
        }
    }

    setItem(name, item){
        try{
            const item_str = JSON.stringify(item);
            storage[name] = item_str;
        } catch(error){
            console.warn(`failed to set value in storage: ${error}`);
        }

    }

    removeItem(name){
        delete storage[name];
    }

};

function is_local_storage_available() {
    try {
        window.localStorage.setItem("check", { something: "ok" });
        window.localStorage.removeItem("check");
        return true;
    } catch(error) {
        return false;
    }
}

export const isLocalstorageAllowed = is_local_storage_available();
const Storage = isLocalstorageAllowed ? LocalStorage : TemporaryStorage;
export { Storage };