export { Cog };

import { Assets } from '../base/assets.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { Prng } from '../base/prng.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Charm } from '../charms/charm.js';
import { InvulnerabilityCharm } from '../charms/invulnerability.js';
import { OverlaySystem } from '../systems/overlaySystem.js';
import { Item } from './item.js';


class Cog extends Item {
    // STATIC VARIABLES ----------------------------------------------------
    static stackable = true;
    static discoverable = true;
    static usable = true;

    static dfltKind = 'health';
    static kinds = [
        'identify',
        'spry',
        'savvy',
        'brawn',
        'invulnerability',
        'purge',
    ];
    static dfltSecret = 'four';
    static secretKinds = [
        'four',
        'six',
        'cam',
        'three',
        'five',
        'fours',
    ];
    static dfltDescription = 'a strangely encoded cog';
    static descriptionMap = {
        'identify': 'a cog that allows identification of equipment, other cogs, and gems',
        'spry': 'a cog that permanently increases player *spry* stat',
        'savvy': 'a cog that permanently increases player *savvy* stat',
        'brawn': 'a cog that permanently increases player *brawn* stat',
        'invulnerability': 'a cog temporarily blocks all damage to player',
        'purge': 'a cog that allows the purges all curses from a piece of equipment',
    };

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
            console.log(`setting discovered: ${Array.from(this.discoveredKinds)}`);
        }
    }

    static initFromPrng() {
        let tags = Array.from(this.secretKinds);
        for (let i=0; i<this.kinds.length; i++) {
            let pick = Prng.rangeInt(0, tags.length-1);
            let tag = tags[pick];
            tags.splice(pick, 1);
            console.log(`-- discovery: ${this.name} ${this.kinds[i]} gets tag: ${tag}}`);
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
            return `${kind} cog`;
        } else {
            let secret = this.kindSecretMap[kind] || this.dfltSecret;
            return `${secret} cog?`;
        }
    }

    static descriptionForKind(kind) {
        if (this.discoveredKinds.has(kind)) {
            let description = this.descriptionMap[kind] || this.dfltDescription;
            return description;
        } else {
            let secret = this.kindSecretMap[kind] || this.dfltSecret;
            return `a mysterious ${secret} cog.  use to identify.`;
        }
    }

    static sketchForKind(kind) {
        let secret = this.kindSecretMap[kind] || this.dfltSecret;
        let tag = `cog.${secret}`;
        let sketch = Assets.get(tag, true);
        if (!sketch) sketch = this.dfltSketch;
        return sketch;
    }

    static isDiscovered(kind) {
        return this.discoveredKinds.has(kind);
    }

    static discover(kind) {
        this.discoveredKinds.add(kind);
        Events.trigger(OverlaySystem.evtNotify, {which: 'info', msg: `discovered ${kind} cog`});
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        if (!spec.sketch) spec.sketch = this.constructor.sketchForKind(spec.kind);
    }
    cpost(spec) {
        super.cpost(spec);
        this.kind = spec.kind || this.constructor.dfltKind;
        this.useFilter = this.useFilter.bind(this);
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

    // PROPERTIES ----------------------------------------------------------
    get requiresTarget() {
        return (this.kind === 'identify' || this.kind === 'purge');
    }

    // METHODS -------------------------------------------------------------
    useFilter(item) {
        if (!item) return false;
        switch (this.kind) {
            case 'identify': {
                return item.identifiable;
            }
            case 'purge': {
                return item.purgeable || Charm.cursed(item);
            }
        }
        return false;
    }

    use(actor, target=null) {
        switch (this.kind) {
            case 'identify': {
                if (target) {
                    console.log(`identifying: ${target}`);
                    UpdateSystem.eUpdate(target, { identifiable: false, purgeable: false });
                }
                break;
            }
            case 'purge': {
                if (target && target.charms) {
                    for (let i=target.charms.length-1; i>=0; i--) {
                        let charm = target.charms[i];
                        console.log(`purging: ${charm} from ${target}`);
                        if (charm.curse) charm.unlink();
                    }
                    UpdateSystem.eUpdate(target, { purgeable: false });
                }
                break;
            }
            case 'spry': {
                UpdateSystem.eUpdate(actor, { spry: actor.spry+1});
                Events.trigger(OverlaySystem.evtNotify, {which: 'info', msg: `spry +1`});
                break;
            }
            case 'brawn': {
                UpdateSystem.eUpdate(actor, { brawn: actor.brawn+1});
                Events.trigger(OverlaySystem.evtNotify, {which: 'info', msg: `brawn +1`});
                break;
            }
            case 'savvy': {
                UpdateSystem.eUpdate(actor, { savvy: actor.savvy+1});
                Events.trigger(OverlaySystem.evtNotify, {which: 'info', msg: `savvy +1`});
                break;
            }
            case 'invulnerability': {
                let charm = new InvulnerabilityCharm();
                actor.addCharm(charm);
                break;
            }
        }

        // update discovery
        if (!this.constructor.isDiscovered(this.kind)) this.constructor.discover(this.kind);

        // trigger used event
        this.evt.trigger(this.constructor.evtUse, {actor: this})

    }

}