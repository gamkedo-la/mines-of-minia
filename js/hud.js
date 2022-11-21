export { Hud };

import { UseAction } from './actions/use.js';
import { WaitAction } from './base/actions/wait.js';
import { Assets } from './base/assets.js';
import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Hierarchy } from './base/hierarchy.js';
import { Mathf } from './base/math.js';
import { Rect } from './base/rect.js';
import { Sketch } from './base/sketch.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxPanel } from './base/uxPanel.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';
import { TurnSystem } from './systems/turnSystem.js';


class Hud extends UxView {
    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.getCurrentHandler = spec.getCurrentHandler || (() => 'interact');
        this.player;
        this.doScan = spec.doScan;
        this.doCancel = spec.doCancel;
        this.doInventory = spec.doInventory;
        this.doTalents = spec.doTalents;
        this.doOptions = spec.doOptions;
        this.doBeltClick = spec.doBeltClick;
        // build out hud
        this.adopt( new UxPanel({
            sketch: Assets.get('hud.border', true),
            children: [
                new UxPanel({
                    sketch: Assets.get('hud.bar.panel', true),
                    xform: new XForm({right: 23/30, bottom: 18/22, width: 7, height: 4, origx: 0, origy: 0, lockRatio: true}),
                    children: [
                        this.sliderBar('bar.health', new XForm({left: 0/7, right: 2/7, top: 0/4, bottom: 3/4}), "rgba(179,56,49,1)"),
                        this.sliderBar('bar.power', new XForm({left: 0/7, right: 2/7, top: 1/4, bottom: 2/4}), "rgba(77,101,180,1)"),
                        this.sliderBar('bar.fuel', new XForm({left: 0/7, right: 2/7, top: 2/4, bottom: 1/4}), "rgba(247,150,23,1)"),
                        new UxPanel({
                            tag: 'hud.health',
                            sketch: Assets.get('hud.health', true),
                            xform: new XForm({left: 5/7, right: 1/7, top: 0/4, bottom: 3/4}),
                        }),
                        new UxPanel({
                            tag: 'hud.power',
                            sketch: Assets.get('hud.power', true),
                            xform: new XForm({left: 5/7, right: 1/7, top: 1/4, bottom: 2/4}),
                        }),
                        new UxPanel({
                            tag: 'hud.fuel',
                            sketch: Assets.get('hud.fuel', true),
                            xform: new XForm({left: 5/7, right: 1/7, top: 2/4, bottom: 1/4}),
                        }),
                    ],
                }),

                new UxPanel({
                    sketch: Assets.get('hud.button.panel', true),
                    xform: new XForm({left: 8/30, right: 6/30, bottom: 19/22, width: 16, height: 3, origx: .5, origy: 0, lockRatio: true}),
                    children: [
                        new UxButton({
                            tag: 'hud.wait',
                            text: Text.zero,
                            pressed: Assets.get('hud.wait.pressed', true),
                            unpressed: Assets.get('hud.wait.unpressed', true),
                            highlight: Assets.get('hud.wait.highlight', true),
                            xform: new XForm({left: 1/16, right: 13/16, top: 0/3, bottom: 1/3}),
                            mouseBlock: true,
                            mousePriority: 1,
                            mouseClickedSound: Assets.get('menu.click', true),
                        }),
                        new UxButton({
                            tag: 'hud.scan',
                            text: Text.zero,
                            pressed: Assets.get('hud.scan.pressed', true),
                            unpressed: Assets.get('hud.scan.unpressed', true),
                            highlight: Assets.get('hud.scan.highlight', true),
                            xform: new XForm({left: 3/16, right: 11/16, top: 0/3, bottom: 1/3}),
                            mouseBlock: true,
                            mousePriority: 1,
                            mouseClickedSound: Assets.get('menu.click', true),
                        }),
                        new UxButton({
                            tag: 'hud.cancel',
                            text: Text.zero,
                            pressed: Assets.get('hud.cancel.pressed', true),
                            unpressed: Assets.get('hud.cancel.unpressed', true),
                            highlight: Assets.get('hud.cancel.highlight', true),
                            xform: new XForm({left: 5/16, right: 9/16, top: 0/3, bottom: 1/3}),
                            mouseBlock: true,
                            mousePriority: 1,
                            mouseClickedSound: Assets.get('menu.click', true),
                        }),
                        this.beltslot(0, new XForm({left: 9/16, right: 5/16, top: 0/3, bottom: 1/3})),
                        this.beltslot(1, new XForm({left: 11/16, right: 3/16, top: 0/3, bottom: 1/3})),
                        this.beltslot(2, new XForm({left: 13/16, right: 1/16, top: 0/3, bottom: 1/3})),
                    ],
                }),

                new UxPanel({
                    sketch: Assets.get('hud.toggle.panel', true),
                    xform: new XForm({left: 25/30, bottom: 15/22, width: 5, height: 7, origx: 1, origy: 0, lockRatio: true}),
                    //xform: new XForm({left: 25/30, bottom: 15/22}),
                    children: [

                        new UxPanel({
                            sketch: Assets.get('hud.options.panel', true),
                            xform: new XForm({left: 1/5, right: 2/5, top: 0/7, bottom: 5/7}),
                        }),
                        new UxButton({
                            tag: 'hud.options',
                            text: Text.zero,
                            pressed: Assets.get('hud.switch.pressed', true),
                            unpressed: Assets.get('hud.switch.unpressed', true),
                            highlight: Assets.get('hud.switch.highlight', true),
                            xform: new XForm({left: 3/5, right: 0/5, top: 0/7, bottom: 5/7}),
                            mouseBlock: true,
                            mousePriority: 1,
                            mouseClickedSound: Assets.get('switch.toggle', true),
                        }),

                        new UxPanel({
                            sketch: Assets.get('hud.equip.panel', true),
                            xform: new XForm({left: 1/5, right: 2/5, top: 2/7, bottom: 3/7}),
                        }),
                        new UxButton({
                            tag: 'hud.equip',
                            text: Text.zero,
                            pressed: Assets.get('hud.switch.pressed', true),
                            unpressed: Assets.get('hud.switch.unpressed', true),
                            highlight: Assets.get('hud.switch.highlight', true),
                            xform: new XForm({left: 3/5, right: 0/5, top: 2/7, bottom: 3/7}),
                            mouseBlock: true,
                            mousePriority: 1,
                            mouseClickedSound: Assets.get('switch.toggle', true),
                        }),

                        new UxPanel({
                            sketch: Assets.get('hud.talents.panel', true),
                            xform: new XForm({left: 1/5, right: 2/5, top: 4/7, bottom: 1/7}),
                        }),
                        new UxButton({
                            tag: 'hud.talents',
                            text: Text.zero,
                            pressed: Assets.get('hud.switch.pressed', true),
                            unpressed: Assets.get('hud.switch.unpressed', true),
                            highlight: Assets.get('hud.switch.highlight', true),
                            xform: new XForm({left: 3/5, right: 0/5, top: 4/7, bottom: 1/7}),
                            mouseBlock: true,
                            mousePriority: 1,
                            mouseClickedSound: Assets.get('switch.toggle', true),
                        }),

                    ],
                }),

            ],
        }));

        // ui elements
        this.optionsButton = Hierarchy.find(this, (v) => v.tag === 'hud.options');
        this.equipButton = Hierarchy.find(this, (v) => v.tag === 'hud.equip');
        this.talentsButton = Hierarchy.find(this, (v) => v.tag === 'hud.talents');
        this.waitButton = Hierarchy.find(this, (v) => v.tag === 'hud.wait');
        this.scanButton = Hierarchy.find(this, (v) => v.tag === 'hud.scan');
        this.cancelButton = Hierarchy.find(this, (v) => v.tag === 'hud.cancel');

        // bind event handlers
        this.onBeltChanged = this.onBeltChanged.bind(this);
        this.onBeltClicked = this.onBeltClicked.bind(this);
        this.onPlayerUpdate = this.onPlayerUpdate.bind(this);
        this.onOptionsClicked = this.onOptionsClicked.bind(this);
        this.onEquipClicked = this.onEquipClicked.bind(this);
        this.onTalentsClicked = this.onTalentsClicked.bind(this);
        this.onWaitClicked = this.onWaitClicked.bind(this);
        this.onScanClicked = this.onScanClicked.bind(this);
        this.onCancelClicked = this.onCancelClicked.bind(this);

        this.optionsButton.evt.listen(this.optionsButton.constructor.evtMouseClicked, this.onOptionsClicked);
        this.equipButton.evt.listen(this.equipButton.constructor.evtMouseClicked, this.onEquipClicked);
        this.talentsButton.evt.listen(this.talentsButton.constructor.evtMouseClicked, this.onTalentsClicked);
        this.waitButton.evt.listen(this.waitButton.constructor.evtMouseClicked, this.onWaitClicked);
        this.scanButton.evt.listen(this.scanButton.constructor.evtMouseClicked, this.onScanClicked);
        this.cancelButton.evt.listen(this.cancelButton.constructor.evtMouseClicked, this.onCancelClicked);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onBeltChanged(evt) {
        //let inactive = 3-this.player.inventory.beltSlots;
        this.assignBelt(evt.slot, evt.slot);
    }

    onBeltClicked(evt) {
        if (this.doBeltClick) this.doBeltClick(evt)
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

    onOptionsClicked(evt) {
        if (this.doInventory) this.doOptions();
    }

    onEquipClicked(evt) {
        if (this.doInventory) this.doInventory();
    }
    onTalentsClicked(evt) {
        if (this.doTalents) this.doTalents();
    }
    onWaitClicked(evt) {
        if (this.getCurrentHandler() !== 'interact') return;
        TurnSystem.postLeaderAction(new WaitAction({points: this.player.pointsPerTurn}));
    }
    onScanClicked(evt) {
        //console.log(`${this} onScanClicked: ${Fmt.ofmt(evt)}}`)
        if (this.doScan) this.doScan();
    }
    onCancelClicked(evt) {
        console.log(`${this} onCancelClicked: ${Fmt.ofmt(evt)}}`)
        if (this.doCancel) this.doCancel();
    }

    // METHODS -------------------------------------------------------------
    linkPlayer(player) {
        this.player = player;
        // disable inactive belt slots
        /*
        let inactive = 3-this.player.inventory.beltSlots;
        for (let i=0; i<inactive; i++) {
            let root = Hierarchy.find(this, (v) => v.tag === `belt.root.${i}`);
            root.active = false;
            root.visible = false;
        }
        */
        for (let i=0; i<3; i++) {
            this.assignBelt(i, i);
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
        let btn = Hierarchy.find(this, (v) => v.tag === `belt.button.${panelIdx}`);
        root.visible = true;
        let panel = Hierarchy.find(this, (v) => v.tag === `belt.${panelIdx}`);
        let sketch = (item) ? Assets.get(item.sketch.tag, true, {state: 'carry', lockRatio: true}) : Sketch.zero;
        if (sketch) panel.sketch = sketch;
        if (item) {
            root.active = true;
            btn.active = true;
            btn.beltIdx = beltIdx;
            btn.evt.listen(btn.constructor.evtMouseClicked, this.onBeltClicked);
        } else {
            root.active = false;
            btn.active = false;
            btn.mouseOver = false;
            btn.evt.ignore(btn.constructor.evtMouseClicked, this.onBeltClicked);
        }
    }

    assignHealth(current, max) {
        let panel = Hierarchy.find(this, (v) => v.tag === 'bar.health');
        let pct = Mathf.clamp(current/max, 0, 1);
        panel.xform.right = 1-pct;
        if (current >= Math.round(max*.25) && this.flashHealth) {
            let indicator = Hierarchy.find(this, (v) => v.tag === 'hud.health');
            indicator.sketch = Assets.get('hud.health', true);
            this.flashHealth = false;
        } else if (current < Math.round(max*.25) && !this.flashHealth) {
            let indicator = Hierarchy.find(this, (v) => v.tag === 'hud.health');
            indicator.sketch = Assets.get('hud.health.flash', true);
            this.flashHealth = true;
        }

    }

    assignFuel(current, max) {
        let panel = Hierarchy.find(this, (v) => v.tag === 'bar.fuel');
        let pct = Mathf.clamp(current/max, 0, 1);
        panel.xform.right = 1-pct;
        if (current >= Math.round(max*.25) && this.flashFuel) {
            let indicator = Hierarchy.find(this, (v) => v.tag === 'hud.fuel');
            indicator.sketch = Assets.get('hud.fuel', true);
            this.flashFuel = false;
        } else if (current < Math.round(max*.25) && !this.flashFuel) {
            let indicator = Hierarchy.find(this, (v) => v.tag === 'hud.fuel');
            indicator.sketch = Assets.get('hud.fuel.flash', true);
            this.flashFuel = true;
        }
    }

    assignPower(current, max) {
        let panel = Hierarchy.find(this, (v) => v.tag === 'bar.power');
        let pct = Mathf.clamp(current/max, 0, 1);
        panel.xform.right = 1-pct;
        if (current >= Math.round(max*.25) && this.flashPower) {
            let indicator = Hierarchy.find(this, (v) => v.tag === 'hud.power');
            indicator.sketch = Assets.get('hud.power', true);
            this.flashPower = false;
        } else if (current < Math.round(max*.25) && !this.flashPower) {
            let indicator = Hierarchy.find(this, (v) => v.tag === 'hud.power');
            indicator.sketch = Assets.get('hud.power.flash', true);
            this.flashPower = true;
        }
    }

    sliderBar(tag, xform, color) {

        return new UxPanel({
            sketch: Sketch.zero,
            xform: xform,
            children: [
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({left: .15, right: .15, top: .31, bottom: .31, }),
                    children: [
                        new UxPanel({
                            tag: tag,
                            sketch: new Rect({color: color}),
                        }),
                    ],
                }),
                new UxPanel({
                    //sketch: Assets.get('hud.bar', true, {lockRatio: true}),
                    sketch: Assets.get('hud.bar', true),
                }),
            ],
        });

    }

    beltslot(idx, xform) {

        return new UxPanel({
            tag: `belt.root.${idx}`,
            sketch: Sketch.zero,
            xform: xform,
            children: [
                new UxPanel({ sketch: Assets.get('hud.sbutton.bg', true) }),
                new UxPanel({ tag: `belt.${idx}`, sketch: Sketch.zero, xform: new XForm({ border: .175 }) }),
                new UxButton({
                    tag: `belt.button.${idx}`,
                    text: Sketch.zero,
                    mouseBlock: true,
                    mousePriority: 1,
                    pressed: Assets.get('hud.sbutton.unpressed', true),
                    unpressed: Assets.get('hud.sbutton.unpressed', true),
                    highlight: Assets.get('hud.sbutton.highlight', true),
                    mouseClickedSound: Assets.get('menu.click', true),
                }),

            ],
        });

    }

}