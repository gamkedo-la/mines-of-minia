import { Fmt } from '../base/fmt.js';
import { MiniaModel } from './miniaModel.js';

export { Dummy };

class Dummy extends MiniaModel {
    static flammable = true;

    cpre(spec) {
    }
    cpost(spec) {
        super.cpost(spec);
        // hackety hack hack: bounds checking is wrong in the depths of the grid checking... so that an object 
        // with zero dimensions is not added to the grid, and therefore not searchable when looking at level data
        // give dummy an artifical width/height to work around this...
        this.xform.width = 1;
        this.xform.height = 1;
        // -- charms (buffs/debuffs)
        this.charms = [];
        this.blockedBy = spec.hasOwnProperty('blockedBy') ? spec.blockedBy : 0;
        this.blocks = spec.hasOwnProperty('blocks') ? spec.blocks : 0;
        if (spec.charms) spec.charms.forEach(() => this.addCharm.bind(this));
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