export { Gem };

import { Assets } from '../base/assets.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { Prng } from '../base/prng.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { DazedCharm } from '../charms/dazed.js';
import { OverlaySystem } from '../systems/overlaySystem.js';
import { Item } from './item.js';

class Gem extends Item {
    // STATIC VARIABLES ----------------------------------------------------
    static slot = 'belt';
    static stackable = true;
    static discoverable = true;
    static usable = true;
    static breakable = true;

    static dfltKind = 'health';
    // -- note: kinds, kindTags, secretNames need to be kept in sync (same length)
    static kinds = [
        'test',
        'health',
        'daze',
    ];
    static dfltSecret = 'blue';
    static secretKinds = [
        'blue',
        'red',
        'purple',
    ];
    static dfltDescription = 'a shiny gem';
    static descriptionMap = {
        'test': 'a test gem',
        'health': 'a gem that restores a small amount of the player\'s health',
        'daze': 'a gem that causes target to be dazed for a short time',
    }

    // -- maps kind->secretKind
    static kindSecretMap = {}
    static discoveredKinds = new Set();

    // STATIC METHODS ------------------------------------------------------
    static init(spec={}) {
        if (spec.kindSecretMap) {
            this.kindSecretMap = Object.assign({}, spec.kindSecretMap);
        }
        if (spec.discoveredKinds) {
            this.discoveredKinds = new Set(spec.discoveredKinds);
        }
    }

    static initFromPrng() {
        let tags = Array.from(this.secretKinds);
        for (let i=0; i<this.kinds.length; i++) {
            let pick = Prng.rangeInt(0, tags.length-1);
            let tag = tags[pick];
            tags.splice(pick, 1);
            console.log(`-- discovery: gem ${this.kinds[i]} gets tag: ${tag}}`);
            this.kindSecretMap[this.kinds[i]] = tag;
        }
    }

    static as_kv() {
        return {
            cls: this.name,
            kindSecretMap: Object.assign({}, this.kindSecretMap),
            discoveredKinds: Array.from(this.discoveredKinds),
        }
    }
    static nameForKind(kind) {
        if (this.discoveredKinds.has(kind)) {
            return `${kind} gem`;
        } else {
            let secret = this.kindSecretMap[kind] || this.dfltSecret;
            return `${secret} gem?`;
        }
    }

    static descriptionForKind(kind) {
        if (this.discoveredKinds.has(kind)) {
            let description = this.descriptionMap[kind] || this.dfltDescription;
            return description;
        } else {
            let secret = this.kindSecretMap[kind] || this.dfltSecret;
            return `a mysterious ${secret} gem.  use to identify.`;
        }
    }

    static sketchForKind(kind) {
        let secret = this.kindSecretMap[kind] || this.dfltSecret;
        let tag = `gem.${secret}`;
        let sketch = Assets.get(tag, true);
        if (!sketch) sketch = this.dfltSketch;
        return sketch;
    }

    static isDiscovered(kind) {
        return this.discoveredKinds.has(kind);
    }

    static discover(kind) {
        this.discoveredKinds.add(kind);
        Events.trigger(OverlaySystem.evtNotify, {which: 'info', msg: `discovered ${kind} gem`});
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        if (!spec.sketch) spec.sketch = this.constructor.sketchForKind(spec.kind);
    }
    cpost(spec) {
        super.cpost(spec);
        this.kind = spec.kind || this.constructor.dfltKind;
        // -- override properties for discovery
        Object.defineProperty(this, 'name', {
            enumerable: false,
            configurable: true,
            get: (v) => this.constructor.nameForKind(this.kind),
        });
        Object.defineProperty(this, 'description', {
            enumerable: false,
            configurable: true,
            get: (v) => this.constructor.descriptionForKind(this.kind),
        });
    } 

    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        return Object.assign({}, super.as_kv(), {
            kind: this.kind,
        });
    }

    // METHODS -------------------------------------------------------------
    use(actor) {
        switch (this.kind) {
            case 'health': {
                let health = Math.min(actor.healthMax, actor.health+10);
                if (health !== actor.health) {
                    UpdateSystem.eUpdate(actor, {health: health });
                }
                break;
            }
            case 'daze': {
                let dazed = new DazedCharm();
                console.log(`applied ${dazed} to ${actor}`);
                actor.addCharm(dazed);
                break;
            }
        }

        // update discovery
        if (!this.constructor.isDiscovered(this.kind)) this.constructor.discover(this.kind);

        // trigger used event
        this.evt.trigger(this.constructor.evtUse, {actor: this}, true);

    }

    break(target, idx) {
        console.log(`break item: ${this} target: ${target} idx: ${idx}`);
        switch (this.kind) {
            case 'daze': {
                if (target) {
                    let dazed = new DazedCharm();
                    console.log(`applied ${dazed} to ${target}`);
                    target.addCharm(dazed);
                    if (!this.constructor.isDiscovered(this.kind)) this.constructor.discover(this.kind);
                }
                break;
            }
        }

        // broken gem gets destroyed
        this.destroy();
    }

}