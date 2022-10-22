export { Pillar };

    import { Config } from '../base/config.js';
import { Direction } from '../base/dir.js';
import { Events } from '../base/event.js';
import { XForm } from '../base/xform.js';
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
        Events.listen('lvl.loaded', this.onLevelLoaded, Events.once);
    }

    onLevelLoaded(evt) {
        this.elvl = evt.lvl;
    }

    show() {
        Events.trigger(OverlaySystem.evtNotify, {which: 'sparkle', actor: this});
    }

    interact(actor) {
        console.log(`${actor} interacts with ${this} kind: ${this.kind}`);
        switch (this.kind) {
            case 'ice':
                // apply frozen to all entities around pillar
                for (const idx of Direction.all.map((v) => this.elvl.idxfromdir(this.idx, v))) {
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
                            dummy.evt.listen('enflamed.done', (evt) => dummy.destroy() );
                        }
                    }
                }
                break;
        }
    }

}