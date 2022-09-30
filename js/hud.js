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
        // build out hud
        this.adopt( new UxPanel({
            sketch: Assets.get('hud.border', true),
            //sketch: Sketch.zero,
            children: [
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({oleft: 22, otop: 22, origx: 0, origy: 0, right: .7, bottom: .75, width: 220, height: 100, lockRatio: true}),
                    //xform: new XForm({oleft: 22, otop: 22, bottom: .75, right: .7}),
                    children: [
                        new UxPanel({
                            sketch: Sketch.zero,
                            xform: new XForm({bottom: .3, right: .3}),
                            children: [
                                new UxPanel({
                                    sketch: Assets.get('hud.portrait', true, {lockRatio: true}),
                                    xform: new XForm({right: .6,}),
                                }),
                                new UxPanel({
                                    sketch: Sketch.zero,
                                    //xform: new XForm({left: .35, top: .2, bottom: .2, lockRatio: true, width: 22, height: 10, origx: 0, origy: 0}),
                                    xform: new XForm({left: .2, right: -.1, top: .1, bottom: .1 }),
                                    children: [
                                        this.sliderBar('bar.health', new XForm({bottom: .67}), "rgba(179,56,49,1)"),
                                        this.sliderBar('bar.power', new XForm({left: .05, right: -.05, top: .33, bottom: .33}), "rgba(77,101,180,1)"),
                                        this.sliderBar('bar.fuel', new XForm({top: .67}), "rgba(247,150,23,1)"),
                                    ],
                                }),
                            ],
                        }),
                        new UxPanel({
                            sketch: Sketch.zero,
                            xform: new XForm({top: .7}),
                            children: [
                                new UxButton({
                                    tag: 'hud.wait',
                                    text: new Text({text: '    wait    '}),
                                    pressed: Assets.get('hud.gbutton.pressed', true),
                                    unpressed: Assets.get('hud.gbutton.unpressed', true),
                                    highlight: Assets.get('hud.gbutton.highlight', true),
                                    xform: new XForm({offset: 1, right: .875, lockRatio: true, width: 10, height: 10, origx: .5, origy: .5}),
                                    mouseBlock: true,
                                    mousePriority: 1,
                                }),
                                new UxButton({
                                    tag: 'hud.scan',
                                    text: new Text({text: '    scan    '}),
                                    pressed: Assets.get('hud.gbutton.pressed', true),
                                    unpressed: Assets.get('hud.gbutton.unpressed', true),
                                    highlight: Assets.get('hud.gbutton.highlight', true),
                                    xform: new XForm({offset: 1, left: .125, right: .75, lockRatio: true, width: 10, height: 10, origx: .5, origy: .5}),
                                    mouseBlock: true,
                                    mousePriority: 1,
                                }),
                                new UxButton({
                                    tag: 'hud.cancel',
                                    text: new Text({text: '   cancel   '}),
                                    pressed: Assets.get('hud.button.pressed', true),
                                    unpressed: Assets.get('hud.button.unpressed', true),
                                    highlight: Assets.get('hud.button.highlight', true),
                                    xform: new XForm({offset: 1, left: .25, right: .625, lockRatio: true, width: 10, height: 10, origx: .5, origy: .5}),
                                    mouseBlock: true,
                                    mousePriority: 1,
                                }),
                                new UxPanel({
                                    sketch: Sketch.zero,
                                    xform: new XForm({left: .375, lockRatio: true}),
                                    children: [
                                        this.beltslot(0),
                                        this.beltslot(1),
                                        this.beltslot(2),
                                        this.beltslot(3),
                                        this.beltslot(4),
                                    ],
                                }),
                            ],
                        }),

                        new UxPanel({
                            sketch: Sketch.zero,
                            xform: new XForm({top: 0, left: .7, bottom: .3}),
                            children: [
                                new UxButton({
                                    tag: 'hud.options',
                                    text: new Text({text: '    options    '}),
                                    pressed: Assets.get('hud.button.pressed', true),
                                    unpressed: Assets.get('hud.button.unpressed', true),
                                    highlight: Assets.get('hud.button.highlight', true),
                                    xform: new XForm({offset: 1, left: .5, bottom: .67, lockRatio: true, width: 10, height: 10, origx: .5, origy: .5}),
                                    mouseBlock: true,
                                    mousePriority: 1,
                                }),

                                new UxButton({
                                    tag: 'hud.equip',
                                    text: new Text({text: '    equip    '}),
                                    pressed: Assets.get('hud.button.pressed', true),
                                    unpressed: Assets.get('hud.button.unpressed', true),
                                    highlight: Assets.get('hud.button.highlight', true),
                                    xform: new XForm({offset: 1, left: .5, top: .33, bottom: .33, lockRatio: true, width: 10, height: 10, origx: .5, origy: .5}),
                                    mouseBlock: true,
                                    mousePriority: 1,
                                }),

                                new UxButton({
                                    tag: 'hud.talents',
                                    text: new Text({text: '  talents  '}),
                                    pressed: Assets.get('hud.button.pressed', true),
                                    unpressed: Assets.get('hud.button.unpressed', true),
                                    highlight: Assets.get('hud.button.highlight', true),
                                    xform: new XForm({offset: 1, left: .5, top: .67, lockRatio: true, width: 10, height: 10, origx: .5, origy: .5}),
                                    mouseBlock: true,
                                    mousePriority: 1,
                                }),

                            ],
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
        let inactive = 5-this.player.inventory.beltSlots;
        this.assignBelt(evt.slot, inactive+evt.slot);
    }

    onBeltClicked(evt) {
        console.log(`onBeltClicked: ${Fmt.ofmt(evt)}`);
        if (this.getCurrentHandler() !== 'interact') return;
        let beltIdx = evt.actor.beltIdx;
        let gid = this.player.inventory.belt[beltIdx];
        let item = this.player.inventory.getByGid(gid);
        if (item) {
            if (item.constructor.shootable) {
                console.log(`${item} shootable`);
                Events.trigger('handler.wanted', {which: 'aim', shooter: item});
            } else {
                let action = new UseAction({
                    points: this.player.pointsPerTurn,
                    item: item,
                });
                TurnSystem.postLeaderAction(action);
            }
        }
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
        let inactive = 5-this.player.inventory.beltSlots;
        for (let i=0; i<inactive; i++) {
            let root = Hierarchy.find(this, (v) => v.tag === `belt.root.${i}`);
            root.active = false;
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
                    xform: new XForm({left: .225, right: .225, top: .31, bottom: .31, }),
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
                    tag: `belt.button.${idx}`,
                    text: Sketch.zero,
                    pressed: Assets.get('hud.sbutton.unpressed', true),
                    unpressed: Assets.get('hud.sbutton.unpressed', true),
                    highlight: Assets.get('hud.sbutton.highlight', true),
                }),

            ],
        });

    }

}