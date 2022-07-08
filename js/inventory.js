export { Inventory, InventoryData };

import { Assets } from './base/assets.js';
import { Events, EvtStream } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
import { Sketch } from './base/sketch.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxPanel } from './base/uxPanel.js';
import { UxText } from './base/uxText.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';

class InventoryData {
    // STATIC VARIABLES ----------------------------------------------------
    static evtAdded = 'inventory.added';
    static evtRemoved = 'inventory.removed';
    static evtBeltChanged = 'belt.changed';
    static evtEquipChanged = 'equip.changed';

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        // equip
        this.shielding = spec.shielding;
        this.reactor = spec.reactor;
        this.weapon = spec.weapon;
        this.gadget1 = spec.gadget1;
        this.gadget2 = spec.gadget2;
        this.gadget3 = spec.gadget2;
        // slots
        this.slots = Array.from(spec.slots || []);
        this.counts = Array.from(spec.counts || []);
        this.numSlots = spec.numSlots || 16;
        // belt
        this.belt = spec.belt || [];
        this.beltSlots = spec.beltSlots || 5;
        this.evt = new EvtStream();
    }

    // PROPERTIES ----------------------------------------------------------
    get isFull() {
        for (let i=0; i<this.numSlots; i++) {
            if (!this.slots[i]) return false;
        }
        return true;
    }

    get isBeltFull() {
        for (let i=0; i<this.beltSlots; i++) {
            if (!this.belt[i]) return false;
        }
        return true;
    }

    // METHODS -------------------------------------------------------------
    add(item, slot=null) {
        // is item stackable (stacked by name)
        if (item.constructor.stackable) {
            // is there a slot for this stack already
            for (let i=0; i<this.numSlots; i++) {
                if (this.slots[i] && this.slots[i].name === item.name) {
                    this.counts[i] += 1;
                    this.evt.trigger(this.constructor.evtAdded, {actor: this, slot: i, target: item});
                    return item;
                }
            }
        }
        if (slot === null) {
            for (let i=0; i<this.numSlots; i++) {
                if (!this.slots[i]) {
                    slot = i;
                    break;
                }
            }
            if (slot === null) return;
        }
        this.slots[slot] = item;
        this.counts[slot] = 1;
        this.evt.trigger(this.constructor.evtAdded, {actor: this, slot: slot, target: item});
        return item;
    }

    remove(slot, all=false) {
        if (this.slots[slot]) {
            let item = this.slots[slot];
            if (this.counts[slot] <= 1 || all) {
                let name = (this.slots[slot]) ? this.slots[slot].name : 'none';
                this.slots[slot] = undefined;
                this.counts[slot] = 0;
                // check for belt reference -- remove if found
                for (let i=0; i<this.beltSlots; i++) {
                    if (this.belt[i] === name) {
                        this.belt[i] = null;
                        break;
                    }
                }
            } else {
                this.counts[slot] -= 1;
            }
            this.evt.trigger(this.constructor.evtRemoved, {actor: this, slot: slot});
            return item;
        }
        return null;
    }

    removeItem(item, all=false) {
        for (let i=0; i<this.numSlots; i++) {
            if (this.slots[i] && this.slots[i].name === item.name) {
                return this.remove(i, all);
            }
        }
        return null;
    }

    swap(slot1, slot2) {
        let tmpi = this.slots[slot2];
        this.slots[slot2] = this.slots[slot1];
        if (this.slots[slot2]) {
            this.evt.trigger(this.constructor.evtAdded, {actor: this, slot: slot2, target: this.slots[slot2]});
        } else if (tmpi) {
            console.log(`trigger removed`);
            this.evt.trigger(this.constructor.evtRemoved, {actor: this, slot: slot2});
        }
        let oslot1 = this.slots[slot1];
        this.slots[slot1] = tmpi;
        if (this.slots[slot1]) {
            this.evt.trigger(this.constructor.evtAdded, {actor: this, slot: slot1, target: this.slots[slot1]});
        } else if (oslot1) {
            console.log(`trigger removed 2`);
            this.evt.trigger(this.constructor.evtRemoved, {actor: this, slot: slot1});
        }
        let tmpc = this.counts[slot2];
        this.counts[slot2] = this.counts[slot1];
        this.counts[slot1] = tmpc;
    }

    swapBelt(slot1, slot2) {
        let tmpi = this.belt[slot2];
        this.belt[slot2] = this.belt[slot1];
        console.log(`get ${slot2} ${this.belt[slot2]} => ${this.get(this.belt[slot2])}`);
        this.evt.trigger(this.constructor.evtBeltChanged, {actor: this, slot: slot2, target: this.get(this.belt[slot2])});
        this.belt[slot1] = tmpi;
        console.log(`get ${slot1} ${this.belt[slot1]} => ${this.get(this.belt[slot1])}`);
        this.evt.trigger(this.constructor.evtBeltChanged, {actor: this, slot: slot1, target: this.get(this.belt[slot1])});
    }

    equip(slot, item) {
        if (item.constructor.slot !== slot) return false;
        this.removeItem(item);
        this[slot] = item;
        this.evt.trigger(this.constructor.evtEquipChanged, {actor: this, slot: slot, target: item});
        return true;
    }

    unequip(slot, invslot) {
        let item = this[slot];
        if (!item) return false;
        if (!this.add(item, invslot)) return false;
        this[slot] = null;
        this.evt.trigger(this.constructor.evtEquipChanged, {actor: this, slot: slot, target: null});
        return true;
    }

    equipBelt(item, slot=null) {
        if (item.constructor.slot !== 'belt') return;
        if (slot === null) {
            for (let i=0; i<this.beltSlots; i++) if (!this.belt[i]) slot = i;
            if (slot === null) return;
        }
        // check for already on belt
        if (this.belt.includes(item.name)) return;
        this.belt[slot] = item.name;
        this.evt.trigger(this.constructor.evtBeltChanged, {actor: this, slot: slot, target: item});
    }

    unequipBelt(slot) {
        this.evt.trigger(this.constructor.evtBeltChanged, {actor: this, slot: slot, target: null});
        this.belt[slot] = null;
    }

    get(name) {
        if (!name) return null;
        for (let i=0; i<this.numSlots; i++) {
            if (this.slots[i] && this.slots[i].name === name) return this.slots[i];
        }
        return null;
    }

    as_kv() {
        spec = {
            cls: this.constructor.name,
            counts: Array.from(this.counts),
            x_slots: this.slots.map((v) => (v) ? v.as_kv() : null),
            numSlots: this.numSlots,
            belt: Array.from(this.belt),
            beltSlots: this.beltSlots,
        };
        if (this.shielding) spec.x_shielding = this.shielding.as_kv();
        if (this.reactor) spec.x_reactor = this.reactor.as_kv();
        if (this.weapon) spec.x_weapon = this.weapon.as_kv();
        if (this.gadget1) spec.x_gadget1 = this.gadget1.as_kv();
        if (this.gadget2) spec.x_gadget2 = this.gadget2.as_kv();
        if (this.gadget3) spec.x_gadget3 = this.gadget3.as_kv();
        return spec;
    }

    toString() {
        return Fmt.toString(this.constructor.name);
    }

}

class Inventory extends UxView {
    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltSelectedUnpressed() {
        return Assets.get('frame.blue.2', true, {lockRatio: true});
    }
    static get dfltSelectedPressed() {
        return Assets.get('frame.red.2', true, {lockRatio: true});
    }
    static get dfltSelectedHighlight() {
        return Assets.get('frame.yellow.2', true, {lockRatio: true});
    }
    static get dfltUnpressed() {
        return Assets.get('frame.blue', true, {lockRatio: true});
    }
    static get dfltPressed() {
        return Assets.get('frame.red', true, {lockRatio: true});
    }
    static get dfltHighlight() {
        return Assets.get('frame.yellow', true, {lockRatio: true});
    }
    static get dfltMark() {
        return Assets.get('frame.green.2', true, {lockRatio: true});
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // bind event handlers before setting data
        this.onInventoryAdded = this.onInventoryAdded.bind(this);
        this.onInventoryRemoved = this.onInventoryRemoved.bind(this);
        this.onBeltChanged = this.onBeltChanged.bind(this);
        this.onEquipChanged = this.onEquipChanged.bind(this);
        this.onSlotClick = this.onSlotClick.bind(this);
        // -- the inventory data
        this.setData(spec.data || new InventoryData);
        this.numGadgets = spec.numGadgets || 3;
        this.numBelt = spec.numBelt || 5;

        this.bg = new UxPanel({
            sketch: Assets.get('oframe.red', true),
            xform: new XForm({offset: 10, right:.3}),
            children: [
                new UxPanel({
                    tag: 'equip',
                    xform: new XForm({offset: 10, right:.6}),
                    sketch: Assets.get('frame.red', true),
                    children: [
                        this.slot({ tag: 'gadget1', xform: new XForm({left: .1, right: .65, top: .2, bottom: .6}), }),
                        this.slot({ tag: 'gadget2', xform: new XForm({left: .375, right: .375, top: .2, bottom: .6}), }),
                        this.slot({ tag: 'gadget3', xform: new XForm({left: .65, right: .1, top: .2, bottom: .6}), }),
                        this.slot({ tag: 'shielding', xform: new XForm({left: .1, right: .65, top: .4, bottom: .4}), }),
                        this.slot({ tag: 'reactor', xform: new XForm({left: .375, right: .375, top: .4, bottom: .4}), }),
                        this.slot({ tag: 'weapon', xform: new XForm({left: .65, right: .1, top: .4, bottom: .4}), }),
                    ],
                }),

                new UxPanel({
                    tag: 'belt',
                    xform: new XForm({offset: 10, left:.4, bottom: .75}),
                    sketch: Assets.get('frame.red', true),
                    children: [
                        this.slot({ tag: 'belt0', xform: new XForm({offset: 10, left: .0, right: .8}), }),
                        this.slot({ tag: 'belt1', xform: new XForm({offset: 10, left: .2, right: .6}), }),
                        this.slot({ tag: 'belt2', xform: new XForm({offset: 10, left: .4, right: .4}), }),
                        this.slot({ tag: 'belt3', xform: new XForm({offset: 10, left: .6, right: .2}), }),
                        this.slot({ tag: 'belt4', xform: new XForm({offset: 10, left: .8, right: .0}), }),
                    ],
                }),

                new UxPanel({
                    tag: 'inventory',
                    xform: new XForm({offset: 10, left:.4, top: .25}),
                    sketch: Assets.get('frame.red', true),
                    children: [
                        this.slot({ tag: 'inv0', xform: new XForm({offset: 10, left: .0, right: .8, top: .0, bottom: .8}), }),
                        this.slot({ tag: 'inv1', xform: new XForm({offset: 10, left: .2, right: .6, top: .0, bottom: .8}), }),
                        this.slot({ tag: 'inv2', xform: new XForm({offset: 10, left: .4, right: .4, top: .0, bottom: .8}), }),
                        this.slot({ tag: 'inv3', xform: new XForm({offset: 10, left: .6, right: .2, top: .0, bottom: .8}), }),
                        this.slot({ tag: 'inv4', xform: new XForm({offset: 10, left: .8, right: .0, top: .0, bottom: .8}), }),

                        this.slot({ tag: 'inv5', xform: new XForm({offset: 10, left: .0, right: .8, top: .2, bottom: .6}), }),
                        this.slot({ tag: 'inv6', xform: new XForm({offset: 10, left: .2, right: .6, top: .2, bottom: .6}), }),
                        this.slot({ tag: 'inv7', xform: new XForm({offset: 10, left: .4, right: .4, top: .2, bottom: .6}), }),
                        this.slot({ tag: 'inv8', xform: new XForm({offset: 10, left: .6, right: .2, top: .2, bottom: .6}), }),
                        this.slot({ tag: 'inv9', xform: new XForm({offset: 10, left: .8, right: .0, top: .2, bottom: .6}), }),
                    ],
                }),

            ],
        });
        this.adopt(this.bg);
        this.selected;
        this.marked = [];
    }

    destroy() {
        if (this.data) {
            this.data.evt.ignore(this.data.constructor.evtAdded, this.onInventoryAdded);
            this.data.evt.ignore(this.data.constructor.evtRemoved, this.onInventoryRemoved);
            this.data.evt.ignore(this.data.constructor.evtBeltChanged, this.onBeltChanged);
            this.data.evt.ignore(this.data.constructor.evtEquipChanged, this.onEquipChanged);
        }
    }

    // EVENT HANDLERS ------------------------------------------------------

    onSlotClick(evt) {
        console.log(`onSlotClick: ${Fmt.ofmt(evt)} selected: ${this.selected}`);
        let item = this.getInventoryForButton(evt.actor);
        if (this.selected) {
            let selectedItem = this.getInventoryForButton(this.selected);
            // -- self: unselect
            if (this.selected === evt.actor) {
                this.reset();
            } else if (this.selected.tag.startsWith('inv')) {
                let selectedIdx = parseInt(this.selected.tag.slice('3'));
                // -- swap
                if (evt.actor.tag.startsWith('inv')) {
                    let targetIdx = parseInt(evt.actor.tag.slice('3'));
                    this.data.swap(selectedIdx, targetIdx);
                // -- try to move to belt
                } else if (evt.actor.tag.startsWith('belt')) {
                    let targetIdx = parseInt(evt.actor.tag.slice('4'));
                    if (selectedItem && selectedItem.constructor.slot === 'belt') {
                        this.data.equipBelt(selectedItem, targetIdx);
                    }
                // -- try to equip
                } else {
                    if (selectedItem && selectedItem.constructor.slot === evt.actor.tag) {
                        let targetIdx = parseInt(this.selected.tag.slice('3'));
                        this.data.equip(evt.actor.tag, selectedItem);
                        if (item) this.data.add(item, targetIdx);
                    }
                }
                this.reset();
            } else if (this.selected.tag.startsWith('belt')) {
                let selectedIdx = parseInt(this.selected.tag.slice('4'));
                // -- swap
                if (evt.actor.tag.startsWith('belt')) {
                    let targetIdx = parseInt(evt.actor.tag.slice('4'));
                    this.data.swapBelt(selectedIdx, targetIdx);
                // -- unequip
                } else if (evt.actor.tag.startsWith('inv')) {
                    this.data.unequipBelt(selectedIdx);
                }
                this.reset();
            } else {
                if (selectedItem) {
                    // -- unequip or swap
                    if (evt.actor.tag.startsWith('inv')) {
                        // swap compatible
                        let targetIdx = parseInt(evt.actor.tag.slice('3'));
                        if (item && item.constructor.slot === this.selected.tag) {
                            this.data.remove(targetIdx);
                            this.data.equip(this.selected.tag, item);
                            this.data.add(selectedItem, targetIdx);
                        // unequip
                        } else if (!item) {
                            let targetIdx = parseInt(evt.actor.tag.slice('3'));
                            console.log(`-- unequip tag: ${this.selected.tag} idx: ${targetIdx}`);
                            this.data.unequip(this.selected.tag, targetIdx);
                        }
                    }
                }
                this.reset();
            }
        } else {
            this.itemPopup = new ItemPopup({
                xform: new XForm({ left: .7, top: .2, bottom: .2}),
            });
            this.adopt(this.itemPopup);
            if (item) {
                this.markCompatibleSlots(item);
            }
            this.select(evt.actor);
        }
    }

    onInventoryAdded(evt) {
        console.log(`onInventoryAdded: ${Fmt.ofmt(evt)}`);
        let slotTag = `inv${evt.slot}`;
        let sketchTag = evt.target.sketch.tag;
        this.assignSlotSketch(slotTag, sketchTag);
        console.log(`counts: ${this.data.counts}`);
        this.changeSlotCount(slotTag, this.data.counts[evt.slot]);
    }

    onInventoryRemoved(evt) {
        console.log(`onInventoryRemoved: ${Fmt.ofmt(evt)}`);
        let slotTag = `inv${evt.slot}`;
        this.assignSlotSketch(slotTag);
        this.changeSlotCount(slotTag, this.data.counts[evt.slot]);
    }

    onEquipChanged(evt) {
        let slotTag = evt.slot;
        let sketchTag = (evt.target) ? evt.target.sketch.tag : null;
        console.log(`onEquipChanged: ${Fmt.ofmt(evt)} slotTag: ${slotTag} sketchTag: ${sketchTag}`);
        this.assignSlotSketch(slotTag, sketchTag);
    }

    onBeltChanged(evt) {
        let slotTag = `belt${evt.slot}`;
        let sketchTag = (evt.target) ? evt.target.sketch.tag : null;
        console.log(`onBeltChanged: ${Fmt.ofmt(evt)} slotTag: ${slotTag} sketchTag: ${sketchTag}`);
        this.assignSlotSketch(slotTag, sketchTag);
    }

    // METHODS -------------------------------------------------------------

    changeSlotCount(tag, count) {
        let cpanel = Hierarchy.find(this, (v) => v.tag === `${tag}.cpanel`);
        let ctext = Hierarchy.find(this, (v) => v.tag === `${tag}.ctext`);
        // disable slot counter if not stacked
        if (count <= 1) {
            cpanel.enable = false;
            cpanel.visible = false;
        } else {
            cpanel.enable = true;
            cpanel.visible = true;
            ctext.text = count.toString();
        }
    }

    slot(spec) {
        let slotTag = spec.tag || 'slot';
        // outer panel for positioning...
        let panel = new UxPanel( Object.assign( {
            sketch: Sketch.zero,
            //dbg: { xform: true},
            children: [
                // inner panel used to align everything else (ratio locked)
                new UxPanel({
                    xform: new XForm({ width: 10, height: 10, lockRatio: true}),
                    sketch: Sketch.zero,
                    children: [
                        new UxPanel({
                            tag: `${slotTag}.panel`,
                            xform: new XForm({ border: .1 }),
                            sketch: Sketch.zero,
                        }),
                        this.button({ tag: slotTag }, this.onSlotClick),
                        new UxPanel({
                            tag: `${slotTag}.cpanel`,
                            xform: new XForm({left: .6, top: .85, bottom: -.15, oright: 5}),
                            active: false,
                            visible: false,
                            children: [
                                new UxText({
                                    tag: `${slotTag}.ctext`,
                                    text: new Text({text: '0'}),
                                    xform: new XForm({bottom: -.15}),
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        }, spec, {tag: `${slotTag}.bg`}));
        panel.xform.lockRatio = true;
        return panel;
    }

    button(spec, cb) {
        let final = Object.assign( {
            text: Sketch.zero,
            pressed: this.constructor.dfltPressed,
            unpressed: this.constructor.dfltUnpressed,
            highlight: this.constructor.dfltHighlight,
        }, spec);
        let button = new UxButton(final);
        button.evt.listen(button.constructor.evtMouseClicked, cb);
        return button;
    }

    getInventoryForButton(button) {
        let tag = button.tag;
        if (tag.startsWith('inv')) {
            let idx = parseInt(tag.slice('3'));
            console.log(`idx: ${idx}`);
            return this.data.slots[idx];
        }
        if (tag.startsWith('belt')) {
            let idx = parseInt(tag.slice('4'));
            console.log(`belt idx: ${idx}`);
            return this.data.belt[idx];
        }
        return this.data[tag];
    }

    markCompatibleSlots(item) {
        console.log(`item: ${item} slot: ${item.constructor.slot}`);
        if (item.constructor.slot === 'belt') {
            for (let i=0; i<this.numBelt; i++) {
                let button = Hierarchy.find(this, (v) => v.tag === `belt${i}`);
                console.log(`tag: belt${i} button: ${button}`);
                this.markButton(button);
            }
        } else if (item.constructor.slot === 'weapon') {
            let button = Hierarchy.find(this, (v) => v.tag === `weapon`);
            this.markButton(button);
        } else if (item.constructor.slot === 'shielding') {
        } else if (item.constructor.slot === 'reactor') {
        } else if (item.constructor.slot === 'gadget') {
        }
    }

    markButton(button) {
        button.unpressed = this.constructor.dfltMark;
        this.marked.push(button);
    }

    unmarkButton(button) {
        button.unpressed = this.constructor.dfltUnpressed;
        let idx = this.marked.indexOf(button);
        if (idx !== -1) {
            this.marked.splice(idx, 1);
        }
    }

    select(button) {
        if (this.selected) this.unselect(this.selected);
        button.pressed = this.constructor.dfltSelectedPressed;
        button.unpressed = this.constructor.dfltSelectedUnpressed;
        button.highlight = this.constructor.dfltSelectedHighlight;
        this.selected = button;
    }

    unselect(button) {
        button.pressed = this.constructor.dfltPressed;
        button.unpressed = this.constructor.dfltUnpressed;
        button.highlight = this.constructor.dfltHighlight;
        if (this.selected === button) this.selected = null;
    }

    reset() {
        for (const button of Array.from(this.marked)) {
            button.unpressed = this.constructor.dfltUnpressed;
        }
        if (this.selected) this.unselect(this.selected);
    }

    assignSlotSketch(slotTag, sketchTag) {
        let panel  = Hierarchy.find(this.bg, (v) => v.tag === `${slotTag}.panel`);
        let sketch = (sketchTag) ? Assets.get(sketchTag, true, {lockRatio: true}) : Sketch.zero;
        console.log(`panel: ${panel} sketch: ${sketch}`);
        if (sketch) panel.sketch = sketch;
    }

    setData(data) {
        if (this.data) {
            this.data.evt.ignore(this.data.constructor.evtAdded, this.onInventoryAdded);
            this.data.evt.ignore(this.data.constructor.evtRemoved, this.onInventoryRemoved);
            this.data.evt.ignore(this.data.constructor.evtBeltChanged, this.onBeltChanged);
            this.data.evt.ignore(this.data.constructor.evtEquipChanged, this.onEquipChanged);
        }
        this.data = data;
        this.data.evt.listen(this.data.constructor.evtAdded, this.onInventoryAdded);
        this.data.evt.listen(this.data.constructor.evtRemoved, this.onInventoryRemoved);
        this.data.evt.listen(this.data.constructor.evtBeltChanged, this.onBeltChanged);
        this.data.evt.listen(this.data.constructor.evtEquipChanged, this.onEquipChanged);
    }

}

class ItemPopup extends UxView {

    cpost(spec) {
        super.cpost(spec);

        this.panel = new UxPanel({
            sketch: Assets.get('oframe.red', true),
            children: [

                // top panel
                new UxPanel({
                    xform: new XForm({bottom: .8}),
                    sketch: Sketch.zero,
                    children: [
                        new UxPanel({
                            xform: new XForm({right: .7, width: 10, height: 10, lockRatio: true}),
                            sketch: Assets.get('frame.red', true),
                            children: [
                                new UxPanel({
                                    tag: 'item.picture',
                                    xform: new XForm({border: .1}),
                                    sketch: Sketch.zero,
                                }),
                            ],
                        }),
                        new UxText({
                            tag: 'item.name',
                            xform: new XForm({left: .3, offset: 5}),
                            text: new Text(),
                        }),
                    ]
                }),

                // description
                new UxPanel({
                    xform: new XForm({top: .2, bottom: .2}),
                    sketch: Sketch.zero,
                    children: [
                        new UxText({
                            tag: 'item.description',
                            xform: new XForm({offset: 5}),
                            text: new Text({wrap: true}),
                        }),
                    ]
                }),

                // buttons
                new UxPanel({
                    xform: new XForm({top: .8}),
                    sketch: Sketch.zero,
                    children: [
                        new UxButton({
                            tag: 'item.use',
                            xform: new XForm({offset: 10, right:.67}),
                            text: new Text({text: 'use'})
                        }),
                        new UxButton({
                            tag: 'item.drop',
                            xform: new XForm({offset: 10, left:.33, right:.33}),
                            text: new Text({text: 'drop'})
                        }),
                        new UxButton({
                            tag: 'item.throw',
                            xform: new XForm({offset: 10, left:.67}),
                            text: new Text({text: 'throw'})
                        }),
                    ]
                }),
            ]
        });
        this.adopt(this.panel);

        // event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);

    }

    destroy() {
        super.destroy();
        Events.ignore(Keys.evtDown, this.onKeyDown);
    }

    onKeyDown(evt) {
        if (!this.active) return;
        console.log(`-- ${this.constructor.name} onKeyDown: ${Fmt.ofmt(evt)}`);
        switch (evt.key) {
            case 'Escape': {
                this.destroy();
                break;
            }
        }
    }

}