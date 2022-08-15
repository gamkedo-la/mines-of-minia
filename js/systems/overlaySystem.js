export { OverlaySystem };

    import { AnimVfx } from '../base/animVfx.js';
import { Assets } from '../base/assets.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { Font } from '../base/font.js';
import { System } from '../base/system.js';
import { Text } from '../base/text.js';
import { TextVfx } from '../base/textVfx.js';
import { UxPanel } from '../base/uxPanel.js';
import { XForm } from '../base/xform.js';
import { Resurrect64 } from '../resurrect64.js';
import { ScanVfx } from '../scanVfx.js';

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
            case 'popup': {
                let popup = new TextVfx({
                    actor: evt.actor,
                    text: new Text({color: Resurrect64.colors[15], wrap: true, text: evt.msg, font: new Font({size: 10})}),
                    //textStr: evt.msg,
                    xform: new XForm({width: 20, height: 20, stretch: false, offx: -10, offy: -10}),
                    float: 16,
                    fade: true,
                });
                this.overlay.adopt(popup);
                break;
            }
            case 'info': {
                console.log(`-- ${this} info: ${evt.msg}`);
                break;
            }
            case 'warn': {
                console.log(`-- ${this} warn: ${evt.msg}`);
                break;
            }
            case 'vfx': {
                this.startAnimation(evt.actor, evt.vfx);
                break;
            }
            case 'scan': {
                let vfx = new ScanVfx({
                    actor: evt.actor,
                    xform: new XForm({stretch: false}),
                });
                this.overlay.adopt(vfx);
                break;
            }
            case 'alert': {
                let vfx = new AnimVfx({
                    actor: evt.actor,
                    anim: Assets.get('vfx.alert', true),
                });
                this.overlay.adopt(vfx);
                break;
            }
        }
    }

    startAnimation(actor, anim) {
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
            actor.evt.ignore(actor.constructor.evtUpdate, onActorUpdate);
            actor.evt.ignore(actor.constructor.evtDestroyed, onActorDestroyed);
            anim.evt.ignore(anim.constructor.evtDone, onAnimDone);
            panel.destroy();
        };
        anim.evt.listen(anim.constructor.evtDone, onAnimDone);



    }

}