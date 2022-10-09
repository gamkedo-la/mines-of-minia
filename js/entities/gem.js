export { Gem };

import { Assets } from '../base/assets.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { Prng } from '../base/prng.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { XForm } from '../base/xform.js';
import { DazedCharm } from '../charms/dazed.js';
import { EnflamedCharm } from '../charms/enflamed.js';
import { StealthCharm } from '../charms/stealth.js';
import { OverlaySystem } from '../systems/overlaySystem.js';
import { Dummy } from './dummy.js';
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
        'fire',
        'health',
        'daze',
        'power',
        'stealth',
    ];
    static dfltSecret = 'blue';
    static secretKinds = [
        'blue',
        'red',
        'purple',
        'green',
        'aqua',
    ];
    static dfltDescription = 'a shiny gem';
    static descriptionMap = {
        'fire': 'a gem that ignites the target',
        'health': 'a gem that restores a small amount of the player\'s health',
        'daze': 'a gem that causes target to be dazed for a short time',
        'power': 'a gem that restores a small amount of the player\'s power',
        'stealth': 'a gem that grants target stealth until next attack',
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
                Events.trigger(OverlaySystem.evtNotify, {which: 'popup.green', actor: actor, msg: `+10`});
                break;
            }
            case 'power': {
                let power = Math.min(actor.powerMax, actor.power+10);
                if (power !== actor.power) {
                    UpdateSystem.eUpdate(actor, {power: power});
                }
                Events.trigger(OverlaySystem.evtNotify, {which: 'popup.white', actor: actor, msg: `+10 pow`});
                break;
            }
            case 'daze': {
                let dazed = new DazedCharm();
                actor.addCharm(dazed);
                break;
            }
            case 'stealth': {
                let dazed = new StealthCharm();
                actor.addCharm(dazed);
                break;
            }
            case 'fire': {
                let charm = new EnflamedCharm();
                actor.addCharm(charm);
                break;
            }
        }

        // update discovery
        if (!this.constructor.isDiscovered(this.kind)) this.constructor.discover(this.kind);

        // trigger used event
        this.evt.trigger(this.constructor.evtUse, {actor: this}, true);

    }

    break(target, idx) {
        switch (this.kind) {
            case 'daze': {
                if (target) {
                    let charm = new DazedCharm();
                    target.addCharm(charm);
                    if (!this.constructor.isDiscovered(this.kind)) this.constructor.discover(this.kind);
                }
                break;
            }
            case 'stealth': {
                if (target) {
                    let charm = new StealthCharm();
                    target.addCharm(charm);
                    if (!this.constructor.isDiscovered(this.kind)) this.constructor.discover(this.kind);
                }
                break;
            }
            case 'fire': {
                if (target) {
                    let charm = new EnflamedCharm();
                    target.addCharm(charm);
                    if (!this.constructor.isDiscovered(this.kind)) this.constructor.discover(this.kind);
                } else if (idx) {
                    let dummy = new Dummy({
                        idx: idx, 
                        z: this.z,
                        xform: new XForm({stretch: false, x: this.xform.x, y: this.xform.y}),
                    });
                    dummy.evt.trigger(dummy.constructor.evtEmerged, {actor: dummy}, true);
                    let charm = new EnflamedCharm();
                    dummy.addCharm(charm);
                    dummy.evt.listen('enflamed.done', (evt) => dummy.destroy() );
                    if (!this.constructor.isDiscovered(this.kind)) this.constructor.discover(this.kind);
                }
                break;
            }

        }

        // broken gem gets destroyed
        this.destroy();
    }

}