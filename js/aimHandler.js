export { AimHandler };

    import { Assets } from './base/assets.js';
import { Entity } from './base/entity.js';
import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Keys } from './base/keys.js';
import { MouseSystem } from './base/systems/mouseSystem.js';
import { UpdateSystem } from './base/systems/updateSystem.js';
import { UxPanel } from './base/uxPanel.js';
import { Vect } from './base/vect.js';
import { XForm } from './base/xform.js';

/**
 * A mini-state to handle inputs during aiming
 */
class AimHandler extends Entity {
    cpost(spec) {
        super.cpost(spec);
        this.lvl = spec.lvl;
        this.player = spec.player;
        this.overlay = spec.overlay;
        // create a reticle
        this.reticle = new UxPanel({
            sketch: Assets.get('reticle.aim.ok', true),
            xform: new XForm({stretch: false}),
        });
        this.reticle.xform.width = this.reticle.sketch.width;
        this.reticle.xform.height = this.reticle.sketch.height;
        this.reticle.xform.offx = -this.reticle.xform.width*.5;
        this.reticle.xform.offy = -this.reticle.xform.height*.5;
        this.aimok = true;
        // -- starting position is player
        this.reticle.xform.x = this.player.xform.x;
        this.reticle.xform.y = this.player.xform.y;
        this.overlay.adopt(this.reticle);
        // bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onLevelClick = this.onLevelClick.bind(this);
        this.onMouseMoved = this.onMouseMoved.bind(this);
        this.lvl.evt.listen(this.lvl.constructor.evtMouseClicked, this.onLevelClick);
        Events.listen(Keys.evtDown, this.onKeyDown);
        Events.listen(MouseSystem.evtMoved, this.onMouseMoved);
    }
    destroy() {
        super.destroy();
        this.reticle.destroy();
        this.lvl.evt.ignore(this.lvl.constructor.evtMouseClicked, this.onLevelClick);
        Events.ignore(Keys.evtDown, this.onKeyDown);
        Events.ignore(MouseSystem.evtMoved, this.onMouseMoved);
    }

    onKeyDown(evt) {
        console.log(`-- ${this} onKeyDown: ${Fmt.ofmt(evt)}`);
        switch (evt.key) {
            case 'Escape': {
                this.destroy();
                break;
            }
        }
    }

    onLevelClick(evt) {
        console.log(`-- ${this} onLevelClick: ${Fmt.ofmt(evt)}`);
    }

    onMouseMoved(evt) {
        //console.log(`-- ${this} onMouseMoved: ${Fmt.ofmt(evt)}`);

        let lmouse = this.lvl.xform.getLocal(new Vect(evt.x, evt.y));
        let idx = this.lvl.idxfromxy(lmouse.x, lmouse.y);

        // update reticle
        // index in player los?
        let aimok = this.player.losIdxs.includes(idx);
        if (aimok !== this.aimok) {
            let sketch = Assets.get((aimok) ? 'reticle.aim.ok' : 'reticle.aim.nok', true);
            this.reticle.sketch = sketch;
            this.aimok = aimok;
        }

        //console.log(`-- ${this} aimok: ${aimok} idx: ${idx} los: ${this.player.losIdxs}`);

        // update position
        let x = this.lvl.grid.xfromidx(idx, true);
        let y = this.lvl.grid.yfromidx(idx, true);
        if (x !== this.reticle.xform.x || y !== this.reticle.xform.y) {
            UpdateSystem.eUpdate(this.reticle, {
                xform: {
                    x: x,
                    y: y,
                },
            });
        }

    }

    getLocalMouse() {
        let lmouse = this.lvl.xform.getLocal(new Vect(evt.mouse.x, evt.mouse.y));
        let idx = this.lvl.idxfromxy(lmouse.x, lmouse.y);
    }

}