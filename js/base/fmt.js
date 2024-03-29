export { Fmt };

// =========================================================================
class Fmt {
    // STATIC VARIABLES ----------------------------------------------------
    static openBrace = "{";
    static closeBrace = "}";
    static fmtToken = "$";
    static nameDelim = ":";
    static fieldDelim = "|";

    // STATIC METHODS ------------------------------------------------------
    static toString(name, ...args) {
        return Fmt.openBrace + name + Fmt.nameDelim + args.join(Fmt.fieldDelim) + Fmt.closeBrace;
    }

    static sprintf(fmt, ...args) {
        if (!args.length) return fmt;
        let str = fmt;
        while (args.length) {
            str = str.replace(Fmt.fmtToken, args.shift());
        }
        return str;
    }

    static ofmt(obj, name, fmtRules={}) {
        if (!obj) return "";
        let kvs = [];
        if (obj instanceof Map) {
            for (const [key, value] of obj) {
                let rule = fmtRules[key];
                if (!rule && value && value.constructor.name === "Object") rule = Fmt.ofmt;
                if (!rule && value instanceof Map) rule = Fmt.ofmt;
                kvs.push(key + Fmt.nameDelim + ((rule) ? rule(value) : value));
            }
        } else {
            let keys = Object.keys(obj);
            for (const key of keys) {
                let rule = fmtRules[key];
                if (!rule && obj[key] && obj[key].constructor.name === "Object") rule = Fmt.ofmt;
                if (!rule && obj[key] instanceof Map) rule = Fmt.ofmt;
                if (!rule && obj[key] instanceof Array) rule = Fmt.ofmt;
                kvs.push(key + Fmt.nameDelim + ((rule) ? rule(obj[key]) : obj[key]));
            }
        }
        if (name) {
            return Fmt.openBrace + name + Fmt.nameDelim + kvs.join(Fmt.fieldDelim) + Fmt.closeBrace;
        } else {
            return Fmt.openBrace + kvs.join(Fmt.fieldDelim) + Fmt.closeBrace;
        }
    }

}