import { MiniaModel } from './miniaModel.js';

export { Dummy };

class Dummy extends MiniaModel {
    static flammable = true;

    cpost(spec) {
        super.cpost(spec);
        // -- charms (buffs/debuffs)
        this.charms = [];
        if (spec.charms) spec.charms.map((this.addCharm.bind(this)));
    };

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            x_charms: this.charms.map((v) => v.as_kv()),
        });
    }

    addCharm(charm) {
        charm.link(this);
    }
    removeCharm(charm) {
        charm.unlink();
    }

}