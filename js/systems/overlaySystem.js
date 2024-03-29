export { OverlaySystem };

    import { AnimVfx } from '../base/animVfx.js';
import { Assets } from '../base/assets.js';
import { AttackVfx } from '../base/attackVfx.js';
import { Config } from '../base/config.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { Font } from '../base/font.js';
import { System } from '../base/system.js';
import { Text } from '../base/text.js';
import { TextVfx } from '../base/textVfx.js';
import { UxPanel } from '../base/uxPanel.js';
import { XForm } from '../base/xform.js';
import { MiniaModel } from '../entities/miniaModel.js';
import { Tile } from '../entities/tile.js';
import { HealthVfx } from '../healthVfx.js';
import { Resurrect64 } from '../resurrect64.js';
import { ScanVfx } from '../scanVfx.js';
import { SparkleVfx } from '../sparkleVfx.js';

class OverlaySystem extends System {
    static evtNotify = 'overlay.notify';

    cpost(spec) {
        super.cpost(spec);
        this.overlay = spec.overlay || new UxPanel();
        this.hud = spec.hud || new UxPanel();
        this.lvl = spec.lvl;
        this.onNotify = this.onNotify.bind(this);
        this.evt.listen(this.constructor.evtNotify, this.onNotify)
    }

    onNotify(evt) {
        switch (evt.which) {
            case 'popup': {
                let popup = new TextVfx({
                    actor: evt.actor,
                    fadedelay: 400,
                    text: new Text({color: Resurrect64.colors[12], wrap: true, text: evt.msg, font: new Font({size: 8})}),
                    xform: new XForm({width: 20, height: 20, stretch: false, offx: -10, offy: -10}),
                    float: 16,
                    fade: true,
                });
                this.overlay.adopt(popup);
                break;
            }
            case 'popup.green': {
                let popup = new TextVfx({
                    actor: evt.actor,
                    fadedelay: 400,
                    text: new Text({color: Resurrect64.colors[31], wrap: true, text: evt.msg, font: new Font({size: 8})}),
                    xform: new XForm({width: 40, height: 20, stretch: false, offx: -20, offy: -10}),
                    float: 16,
                    fade: true,
                });
                this.overlay.adopt(popup);
                break;
            }
            case 'popup.white': {
                let popup = new TextVfx({
                    actor: evt.actor,
                    fadedelay: 400,
                    text: new Text({color: 'white', wrap: true, text: evt.msg, font: new Font({size: 8})}),
                    xform: new XForm({width: 40, height: 20, stretch: false, offx: -20, offy: -10}),
                    float: 16,
                    fade: true,
                });
                this.overlay.adopt(popup);
                break;
            }
            case 'popup.yellow': {
                let popup = new TextVfx({
                    actor: evt.actor,
                    fadedelay: 400,
                    text: new Text({color: Resurrect64.colors[18], wrap: true, text: evt.msg, font: new Font({size: 8})}),
                    xform: new XForm({width: 40, height: 20, stretch: false, offx: -20, offy: -10}),
                    float: 16,
                    fade: true,
                });
                this.overlay.adopt(popup);
                break;
            }
            case 'dialog': {
                let popup = new TextVfx({
                    actor: evt.actor,
                    text: new Text({color: Resurrect64.colors[18], wrap: true, text: evt.msg, font: new Font({size: 10})}),
                    xform: new XForm({width: 120, height: 60, stretch: false, offx: -60, offy: -35}),
                    ttl: evt.ttl || 1000,
                });
                this.overlay.adopt(popup);
                break;
            }

            case 'info': {
                let x = Math.round(this.hud.xform.centerx-this.hud.xform.minx);
                let y = Math.round((this.hud.xform.centery-this.hud.xform.miny) *.6);
                let popup = new TextVfx({
                    text: new Text({color: Resurrect64.colors[31], wrap: true, text: evt.msg, font: new Font({size: 30})}),
                    xform: new XForm({x: x, y: y, width: 400, height: 20, stretch: false, offx: -200, offy: -10}),
                    fade: true,
                    ttl: 2000,
                    fadedelay: 1000,
                });
                this.hud.adopt(popup);
                console.log(`-- ${this} info: ${evt.msg}`);
                break;
            }
            case 'warn': {
                let x = Math.round(this.hud.xform.centerx-this.hud.xform.minx);
                let y = Math.round((this.hud.xform.centery-this.hud.xform.miny) *.6);
                let popup = new TextVfx({
                    text: new Text({color: Resurrect64.colors[18], wrap: true, text: evt.msg, font: new Font({size: 30})}),
                    xform: new XForm({x: x, y: y, width: 400, height: 20, stretch: false, offx: -200, offy: -10}),
                    fade: true,
                    ttl: 2000,
                    fadedelay: 1000,
                });
                this.hud.adopt(popup);
                console.log(`-- ${this} warn: ${evt.msg}`);
                break;
            }
            case 'vfx': {
                this.startAnimation(evt.actor, evt.vfx, evt.destroyEvt);
                break;
            }
            case 'overlay': {
                this.startAnimation(evt.actor, evt.vfx, evt.destroyEvt, this.lvl);
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
            case 'healthbar': {
                if (!evt.actor.healthVfx) {
                    let vfx = new HealthVfx({
                        actor: evt.actor,
                        xform: new XForm({stretch: false}),
                    });
                    this.overlay.adopt(vfx);
                    evt.actor.healthVfx = vfx;
                }
                break;
            }
            case 'sparkle': {
                let color = Resurrect64.colors[48];
                if (evt.actor.kind === 'fire') {
                    color = Resurrect64.colors[18];
                } else if (evt.actor.kind === 'dark') {
                    color = Resurrect64.colors[53];
                } else if (evt.actor.kind === 'ice') {
                    color = Resurrect64.colors[48];
                } else if (evt.actor.kind === 'poison') {
                    color = Resurrect64.colors[32];
                }
                let vfx = new SparkleVfx({
                    actor: evt.actor,
                    sparkColor: color,
                    xform: new XForm({stretch: false}),
                    points: [
                        [-5.5,-9.5], [-5.5,-6.5], [-5.5,-3.5], [-4.5,-2.5], [-1.5,-2.5], [1.5,-2.5], [4.5,-2.5], [5.5,-3.5], [5.5,-6.5], [5.5,-9.5],
                        [-4.5,-21.5], [-4.5,-18.5], [-4.5,-15.5], [-3.5,-14.5], [-1.5,-13.5], [1.5,-13.5], [3.5,-14.5], [4.5,-15.5], [4.5,-18.5], [4.5,-21.5],
                        [1.5,-23.5], [-1.5,-23.5], [-.5,-19.5], 
                    ],
                });
                evt.actor.sparkleVfx = vfx;
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
            case 'aggroLoss': {
                let vfx = new AnimVfx({
                    actor: evt.actor,
                    anim: Assets.get('vfx.aggroLoss', true),
                });
                this.overlay.adopt(vfx);
                break;
            }
            case 'swing': {
                let vfx = new AttackVfx({
                    actor: evt.actor,
                    facing: evt.facing,
                    angle: evt.angle,
                });
                this.overlay.adopt(vfx);
                break;
            }

        }
    }

    startAnimation(actor, anim, destroyEvt, overlay, zed) {
        if (!overlay) overlay = this.overlay;
        if (!zed) zed = actor.z;
        let offy = 0;
        if (anim.tag === 'vfx.dazed') {
            offy = (actor.xform.height>Config.tileSize) ? Config.tileSize*.5-actor.xform.height : -Config.tileSize*.5;
            if (actor.cls === 'Magma') offy += 8;
            if (actor.cls === 'Player') offy += 4;
        } else {
            offy = (anim.height > Config.tileSize) ? Config.tileSize*.5-anim.height : -anim.height*.5
        }
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
                offy: offy,
            }),
        });
        panel.idx = actor.idx;
        panel.z = zed;
        overlay.adopt(panel);
        // track actor state
        let onActorUpdate = (evt) => {
            if (evt.update && evt.update.xform && (evt.update.xform.hasOwnProperty('x') || evt.update.xform.hasOwnProperty('y'))) {
                panel.xform.x = evt.update.xform.x;
                panel.xform.y = evt.update.xform.y;
            }
        }
        let onActorDestroyed = (evt) => {
            actor.evt.ignore(actor.constructor.evtUpdated, onActorUpdate);
            actor.evt.ignore(actor.constructor.evtDestroyed, onActorDestroyed);
            anim.evt.ignore(anim.constructor.evtDone, onAnimDone);
            panel.destroy();
        }
        destroyEvt = destroyEvt || actor.constructor.evtDestroyed;
        actor.evt.listen(actor.constructor.evtUpdated, onActorUpdate);
        actor.evt.listen(destroyEvt, onActorDestroyed);

        // track animation state
        let onAnimDone = (evt) => {
            actor.evt.ignore(actor.constructor.evtUpdated, onActorUpdate);
            actor.evt.ignore(destroyEvt, onActorDestroyed);
            anim.evt.ignore(anim.constructor.evtDone, onAnimDone);
            panel.destroy();
        };
        anim.evt.listen(anim.constructor.evtDone, onAnimDone);



    }

}