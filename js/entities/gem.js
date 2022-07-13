export { Gem };

    import { Assets } from '../base/assets.js';
import { Fmt } from '../base/fmt.js';
import { Generator } from '../base/generator.js';
import { Prng } from '../base/prng.js';
import { Item } from './item.js';

class Gem extends Item {
    // STATIC VARIABLES ----------------------------------------------------
    static slot = 'belt';
    static stackable = true;
    static discoverable = true;
    static usable = true;

    static dfltKind = 'health';
    // -- note: kinds, kindTags, secretNames need to be kept in sync (same length)
    static kinds = [
        'test',
        'health',
    ];
    static dfltSecret = 'blue';
    static secretKinds = [
        'blue',
        'gold',
    ];
    static dfltDescription = 'a shiny gem';
    static descriptionMap = {
        'health': 'a gem that restores a small amount of the player\'s health',
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
            this.discoveredKinds = new Set(this.discoveredKinds);
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
            cls: 'Gem',
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
            let description = this.descriptionMap(kind) || this.dfltDescription;
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
        // -- bind events
        this.onUse = this.onUse.bind(this);
        this.evt.listen(this.constructor.evtUse, this.onUse);
    } 

    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        return Object.assign({}, super.as_kv(), {
            kind: this.kind,
        });
    }

    // EVENT HANDLERS ------------------------------------------------------
    onUse(evt) {
        switch (this.kind) {
            case 'health': {
                let health = Math.min(evt.actor.healthMax, evt.actor.health+10);
                if (health !== evt.actor.health) {
                    UpdateSystem.eUpdate(evt.actor, {health: health });
                }
                break;
            }
        }

        // update discovery
        if (!this.constructor.isDiscovered(this.kind)) this.constructor.discover(this.kind);

    }

}