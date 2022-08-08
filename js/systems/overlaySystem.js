export { OverlaySystem };

import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { System } from '../base/system.js';
import { UxPanel } from '../base/uxPanel.js';
import { XForm } from '../base/xform.js';

class OverlaySystem extends System {
    static evtNotify = 'overlay.notify';

    cpost(spec) {
        super.cpost(spec);
        this.overlay = spec.overlay || new UxPanel();
        this.onNotify = this.onNotify.bind(this);
        this.evt.listen(this.constructor.evtNotify, this.onNotify)
    }

    onNotify(evt) {
        switch (evt.which) {
            case 'info': {
                console.log(`-- ${this} info: ${evt.msg}`);
                break;
            }
            case 'warn': {
                console.log(`-- ${this} warn: ${evt.msg}`);
                break;
            }
            case 'vfx': {
                console.log(`-- ${this} start vfx: ${evt.vfx}`);
                this.startAnimation(evt.actor, evt.vfx);
                break;
            }
        }
    }

    startAnimation(actor, anim) {
        console.log(`actor: ${actor}`);
        console.log(`anim: ${anim}`);
        // create panel for vfx
        let panel = new UxPanel({
            tag: 'vfx',
            sketch: anim,
            xform: new XForm({
                width: anim.width,
                height: anim.height,
                stretchx: false,
                stretchy: false,
                x: actor.xform.x,
                y: actor.xform.y,
                offx: -anim.width*.5,
                offy: -anim.height*.5,
            }),
        });
        this.overlay.adopt(panel);
        //console.log(`-- panel: ${panel} x,y: ${panel.xform.x},${panel.xform.y}`);

        // track actor state
        let onActorUpdate = (evt) => {
            if (evt.update && evt.update.xform && (evt.update.xform.hasOwnProperty('x') || evt.update.xform.hasOwnProperty('y'))) {
                panel.xform.x = evt.update.xform.x;
                panel.xform.y = evt.update.xform.y;
            }
        }
        let onActorDestroyed = (evt) => {
            actor.evt.ignore(actor.constructor.evtUpdate, onActorUpdate);
            actor.evt.ignore(actor.constructor.evtDestroyed, onActorDestroyed);
            anim.evt.ignore(anim.constructor.evtDone, onAnimDone);
            panel.destroy();
        }
        actor.evt.listen(actor.constructor.evtUpdate, onActorUpdate);
        actor.evt.listen(actor.constructor.evtDestroyed, onActorDestroyed);

        // track animation state
        let onAnimDone = (evt) => {
            //console.log(`onAnimDone`);
            actor.evt.ignore(actor.constructor.evtUpdate, onActorUpdate);
            actor.evt.ignore(actor.constructor.evtDestroyed, onActorDestroyed);
            anim.evt.ignore(anim.constructor.evtDone, onAnimDone);
            panel.destroy();
        };
        anim.evt.listen(anim.constructor.evtDone, onAnimDone);



    }

}