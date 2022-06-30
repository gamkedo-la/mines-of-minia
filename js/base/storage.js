export { Storage };

class Storage {
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