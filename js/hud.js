export { Hud };

import { Assets } from './base/assets.js';
import { Hierarchy } from './base/hierarchy.js';
import { Mathf } from './base/math.js';
import { Rect } from './base/rect.js';
import { Sketch } from './base/sketch.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxPanel } from './base/uxPanel.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';


class Hud extends UxView {
    cpost(spec) {
        super.cpost(spec);
        this.player;
        // build out hud
        this.adopt( new UxPanel({
            sketch: Assets.get('hud.border', true),
            //sketch: Sketch.zero,
            children: [
                new UxPanel({
                    sketch: Sketch.zero,
                    //dbg: { xform: true },
                    xform: new XForm({oleft: 10, otop: 10, origx: 0, origy: 0, right: .6, bottom: .8, width: 220, height: 100, lockRatio: true}),
                    children: [
                        new UxPanel({
                            sketch: Assets.get('hud.portrait', true, {lockRatio: true}),
                            xform: new XForm({right: .6,}),
                            //dbg: { xform: true },
                        }),
                        new UxPanel({
                            sketch: Sketch.zero,
                            xform: new XForm({left: .25, top: .2, bottom: .2}),
                            //dbg: { xform: true },
                            children: [
                                this.sliderBar('bar.health', new XForm({bottom: .67}), "rgba(179,56,49,1)"),
                                this.sliderBar('bar.power', new XForm({top: .33, bottom: .33}), "rgba(77,101,180,1)"),
                                this.sliderBar('bar.fuel', new XForm({top: .67}), "rgba(247,150,23,1)"),
                            ],
                        }),
                    ],
                }),

                new UxButton({
                    text: new Text({text: '    options    '}),
                    pressed: Assets.get('hud.button.pressed', true),
                    unpressed: Assets.get('hud.button.unpressed', true),
                    highlight: Assets.get('hud.button.highlight', true),
                    xform: new XForm({left: .925, bottom: .85, otop: 30, oright: 30, lockRatio: true, width: 10, height: 10, origx: 1, origy: 0}),
                    //dbg: { xform: true },
                }),

                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({left: .75, top: .875, obottom: 30, oright: 30, lockRatio: true}),
                    children: [

                        this.beltslot(0),
                        this.beltslot(1),
                        this.beltslot(2),
                        this.beltslot(3),
                        this.beltslot(4),

                    ],
                    //dbg: { xform: true },
                }),

            ],
        }));

        // bind event handlers
        this.onBeltChanged = this.onBeltChanged.bind(this);
        this.onPlayerUpdate = this.onPlayerUpdate.bind(this);
    }

    onBeltChanged(evt) {
        let inactive = 5-this.player.inventory.beltSlots;
        this.assignBelt(evt.slot, inactive+evt.slot);
    }

    onPlayerUpdate(evt) {
        if (evt.update && (evt.update.hasOwnProperty('health') || evt.update.hasOwnProperty('healthMax'))) {
            this.assignHealth(this.player.health, this.player.healthMax);
        }
        if (evt.update && (evt.update.hasOwnProperty('fuel') || evt.update.hasOwnProperty('fuelMax'))) {
            this.assignFuel(this.player.fuel, this.player.fuelMax);
        }
        if (evt.update && (evt.update.hasOwnProperty('power') || evt.update.hasOwnProperty('powerMax'))) {
            this.assignPower(this.player.power, this.player.powerMax);
        }
    }

    linkPlayer(player) {
        this.player = player;
        // disable inactive belt slots
        let inactive = 5-this.player.inventory.beltSlots;
        console.log(`inactive: ${inactive} player inv: ${this.player.inventory}`);
        for (let i=0; i<inactive; i++) {
            let root = Hierarchy.find(this, (v) => v.tag === `belt.root.${i}`);
            root.enable = false;
            root.visible = false;
        }
        for (let i=inactive; i<5; i++) {
            this.assignBelt(i-inactive, i);
        }
        this.assignHealth(this.player.health, this.player.healthMax);
        this.assignPower(this.player.power, this.player.powerMax);
        this.assignFuel(this.player.fuel, this.player.fuelMax);
        // bind inventory events
        this.player.inventory.evt.listen(this.player.inventory.constructor.evtBeltChanged, this.onBeltChanged);
        this.player.evt.listen(this.player.constructor.evtUpdated, this.onPlayerUpdate);
    }

    assignBelt(beltIdx, panelIdx) {
        let gid = this.player.inventory.belt[beltIdx];
        let item = this.player.inventory.getByGid(gid);
        let root = Hierarchy.find(this, (v) => v.tag === `belt.root.${panelIdx}`);
        root.visible = true;
        let panel = Hierarchy.find(this, (v) => v.tag === `belt.${panelIdx}`);
        let sketch = (item) ? Assets.get(item.sketch.tag, true, {state: 'carry'}) : Sketch.zero;
        if (sketch) panel.sketch = sketch;
        if (item) {
            root.enable = true;
        } else {
            root.enable = false;
        }
    }

    assignHealth(current, max) {
        let panel = Hierarchy.find(this, (v) => v.tag === 'bar.health');
        let pct = Mathf.clamp(current/max, 0, 1);
        panel.xform.right = 1-pct;
    }

    assignFuel(current, max) {
        let panel = Hierarchy.find(this, (v) => v.tag === 'bar.fuel');
        let pct = Mathf.clamp(current/max, 0, 1);
        panel.xform.right = 1-pct;
    }

    assignPower(current, max) {
        let panel = Hierarchy.find(this, (v) => v.tag === 'bar.power');
        let pct = Mathf.clamp(current/max, 0, 1);
        panel.xform.right = 1-pct;
    }

    sliderBar(tag, xform, color) {

        return new UxPanel({
            sketch: Sketch.zero,
            xform: xform,
            children: [
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({left: .225, right: .225, top: .3, bottom: .3, }),
                    children: [
                        new UxPanel({
                            tag: tag,
                            sketch: new Rect({color: color}),
                        }),
                    ],
                }),
                new UxPanel({
                    sketch: Assets.get('hud.bar', true, {lockRatio: true}),
                }),
            ],
        });

    }

    beltslot(idx) {

        return new UxPanel({
            // idx: 0 left: 0 right: .8
            // idx: 1 left: .2 right: .6
            tag: `belt.root.${idx}`,
            sketch: Sketch.zero,
            xform: new XForm({left: idx*.2, right: 1-(idx+1)*.2, offset: 4, lockRatio: true, width: 10, height: 10, origy: 1}),
            children: [
                new UxPanel({ sketch: Assets.get('hud.sbutton.bg', true) }),
                new UxPanel({ tag: `belt.${idx}`, sketch: Sketch.zero, xform: new XForm({ border: .175 }) }),
                new UxButton({
                    text: Sketch.zero,
                    pressed: Assets.get('hud.sbutton.unpressed', true),
                    unpressed: Assets.get('hud.sbutton.unpressed', true),
                    highlight: Assets.get('hud.sbutton.highlight', true),
                }),

            ],
        });

    }

}