export { Pillar };

    import { Config } from '../base/config.js';
import { Direction } from '../base/dir.js';
import { Events } from '../base/event.js';
import { XForm } from '../base/xform.js';
import { EnflamedCharm } from '../charms/enflamed.js';
import { FrozenCharm } from '../charms/frozen.js';
import { OverlaySystem } from '../systems/overlaySystem.js';
import { Dummy } from './dummy.js';
import { Item } from './item.js';
import { MiniaModel } from './miniaModel.js';


/**
 * pillar for bio boss interaction
 */
class Pillar extends Item {
    // STATIC VARIABLES ----------------------------------------------------
    static mobile = false;
    static lootable = false;
    static interactable = true;
    static dfltKind = 'fire';

    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        return Object.assign( this.spec, {
            blockedBy: MiniaModel.block.all,
            blocks: MiniaModel.block.all,
        }, spec);
    }

    cpost(spec) {
        super.cpost(spec);
        this.kind = spec.kind || this.constructor.dfltKind;
        this.elvl;
        this.onLevelLoaded = this.onLevelLoaded.bind(this);
        this.linkRange = spec.hasOwnProperty('linkRange') ? spec.linkRange : Config.tileSize*10;
        this.links = [];
        Events.listen('lvl.loaded', this.onLevelLoaded, Events.once);
    }

    onLevelLoaded(evt) {
        this.elvl = evt.lvl;
        for (const idx of this.elvl.idxsInRange(this.idx, this.linkRange)) {
            for (const e of this.elvl.findidx(idx, (e) => e.cls === 'Pillar' && e !== this)) {
                this.links.push(e);
            }
        }
    }

    show() {
        Events.trigger(OverlaySystem.evtNotify, {which: 'sparkle', actor: this});
    }

    interact(actor) {
        console.log(`${actor} interacts with ${this} kind: ${this.kind}`);
        let kind = this.kind;
        for (const pillar of this.links.concat(this)) {
            switch (kind) {
                case 'ice': {
                    // apply frozen to all entities around pillar
                    for (const idx of Direction.all.map((v) => this.elvl.idxfromdir(pillar.idx, v))) {
                        for (const e of this.elvl.findidx(idx)) {
                            let charm = new FrozenCharm({});
                            if ('charms' in e) {
                                console.log(`applying: ${charm} to ${e}`);
                                e.addCharm(charm);
                            } else {
                                let dummy = new Dummy({
                                    idx: idx, 
                                    z: Config.template.bgoZed,
                                    xform: new XForm({stretch: false, x: this.elvl.xfromidx(idx, true), y: this.elvl.yfromidx(idx, true)}),
                                });
                                dummy.evt.trigger(dummy.constructor.evtEmerged, {actor: dummy}, true);
                                console.log(`applying: ${charm} to ${dummy}`);
                                dummy.addCharm(charm);
                                dummy.evt.listen('frozen.done', (evt) => dummy.destroy() );
                            }
                        }
                    }

                    break;

                }

                case 'fire': {
                    // apply enflamed to all entities around pillar
                    for (const idx of Direction.all.map((v) => this.elvl.idxfromdir(pillar.idx, v))) {
                        for (const e of this.elvl.findidx(idx)) {
                            let charm = new EnflamedCharm({});
                            if ('charms' in e) {
                                console.log(`applying: ${charm} to ${e}`);
                                e.addCharm(charm);
                            } else {
                                let dummy = new Dummy({
                                    idx: idx, 
                                    z: Config.template.bgoZed,
                                    xform: new XForm({stretch: false, x: this.elvl.xfromidx(idx, true), y: this.elvl.yfromidx(idx, true)}),
                                });
                                dummy.evt.trigger(dummy.constructor.evtEmerged, {actor: dummy}, true);
                                dummy.addCharm(charm);
                                dummy.evt.listen('enflamed.done', (evt) => dummy.destroy() );
                            }
                        }
                    }
                    break;
                }
            }
        }
    }

}