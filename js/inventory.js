export { Inventory, InventoryData };
import { Assets } from './base/assets.js';
import { EvtStream } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Hierarchy } from './base/hierarchy.js';
import { Sketch } from './base/sketch.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxPanel } from './base/uxPanel.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';


class InventoryData {
    static evtAdded = 'inventory.added';
    static evtRemoved = 'inventory.removed';

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
            let item = this.inv[slot];
            if (this.counts[slot] <= 1 || all) {
                let name = (this.inv[slot]) ? this.inv[slot].name : 'none';
                this.inv[slot] = undefined;
                this.counts[slot] = 0;
                // check for belt reference -- remove if found
                for (let i=0; i<this.beltSlots; i++) {
                    if (this.beltSlots[i] === name) {
                        this.beltSlots[i] = null;
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

    removeItem(item, all=False) {
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

    equip(slot, item) {
        if (item.constructor.slot !== slot) return false;
        this.removeItem(item);
        this[slot] = item;
        return true;
    }

    unequip(slot) {
        let item = this[slot];
        if (!item) return false;
        if (!this.add(item)) return false;
        this[slot] = null;
        return true;
    }

    equipBelt(item, slot=null) {
        if (item.constructor.slot !== belt) return;
        if (slot === null) {
            for (let i=0; i<this.beltSlots; i++) if (!this.belt[i]) slot = i;
            if (slot === null) return;
        }
        // check for already on belt
        if (this.belt.includes(item.name)) return;
        this.belt[slot] = item.name;
    }

    unequipBelt(slot) {
        this.belt[slot] = null;
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

    cpost(spec) {
        super.cpost(spec);
        // -- the inventory data
        this.data = spec.data || new InventoryData();
        this.numGadgets = spec.numGadgets || 3;
        this.numBelt = spec.numBelt || 5;

        //this.onSlotClick = this.onSlotClick.bind(this);
        //this.onDataAdded = this.onDataAdded.bind(this);
        //console.log(`-- onDataAdded: ${this.onDataAdded}`);
        //this.onDataRemoved = this.onDataRemoved.bind(this);

        //this.data.evt.listen(this.data.constructor.evtAdded, this.onDataAdded);
        //this.data.evt.listen(this.data.constructor.evtRemoved, this.onDataRemoved);
        //console.log(`-- removed evt: ${this.data.constructor.evtRemoved}`);
        //console.log(`-- removed cb: ${this.onDataRemoved}`);
        //console.log(`-- listeners: ${Fmt.ofmt(this.data.evt.listeners)}`);


        this.bg = new UxPanel({
            children: [
                new UxPanel({
                    tag: 'equip',
                    xform: new XForm({offset: 10, right:.7}),
                    sketch: Assets.get('frame.red', true),
                    children: [
                        this.button({ tag: 'gadget1', xform: new XForm({left: .1, right: .65, top: .2, bottom: .6}), }),
                        this.button({ tag: 'gadget2', xform: new XForm({left: .375, right: .375, top: .2, bottom: .6}), }),
                        this.button({ tag: 'gadget3', xform: new XForm({left: .65, right: .1, top: .2, bottom: .6}), }),
                        this.button({ tag: 'shielding', xform: new XForm({left: .1, right: .65, top: .4, bottom: .4}), }),
                        this.button({ tag: 'reactor', xform: new XForm({left: .375, right: .375, top: .4, bottom: .4}), }),
                        this.button({ tag: 'weapon', xform: new XForm({left: .65, right: .1, top: .4, bottom: .4}), }),
                    ],
                }),

                new UxPanel({
                    tag: 'belt',
                    xform: new XForm({offset: 10, left:.6, bottom: .75}),
                    sketch: Assets.get('frame.red', true),
                    children: [
                        this.slot({ tag: 'belt1', xform: new XForm({offset: 10, left: .0, right: .8}), }),
                        this.slot({ tag: 'belt2', xform: new XForm({offset: 10, left: .2, right: .6}), }),
                        this.slot({ tag: 'belt3', xform: new XForm({offset: 10, left: .4, right: .4}), }),
                        this.slot({ tag: 'belt4', xform: new XForm({offset: 10, left: .6, right: .2}), }),
                        this.slot({ tag: 'belt5', xform: new XForm({offset: 10, left: .8, right: .0}), }),
                    ],
                }),

                new UxPanel({
                    tag: 'inventory',
                    xform: new XForm({offset: 10, left:.6, top: .25}),
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

                new UxPanel({
                    tag: 'info',
                    sketch: Assets.get('frame.red', true),
                    xform: new XForm({offset: 10, left:.3, right: .4}),
                    children: [
                        new UxPanel({
                            sketch: Sketch.zero,
                            xform: new XForm({offset: 10, top:.85}),
                            children: [
                                new UxButton({
                                    xform: new XForm({offset: 10, right:.67}),
                                    text: new Text({text: 'use'})
                                }),
                                new UxButton({
                                    xform: new XForm({offset: 10, left:.33, right:.33}),
                                    text: new Text({text: 'drop'})
                                }),
                                new UxButton({
                                    xform: new XForm({offset: 10, left:.67}),
                                    text: new Text({text: 'throw'})
                                }),
                            ],
                        }),
                    ],
                }),

            ],
        });
        this.adopt(this.bg);
        this.selected;
        this.marked = [];
    }

    slot(spec) {
        let buttonTag = spec.tag || 'slot';
        let panelTag = `${buttonTag}.panel`;
        let panel = new UxPanel( Object.assign( {
            sketch: Sketch.zero,
            children: [
                this.button({
                    tag: buttonTag,
                })
            ]
        }, spec, { tag: panelTag }));
        //let button  = Hierarchy.find(panel, (v) => v.tag === buttonTag);
        //button.evt.listen(button.constructor.evtMouseClicked, this.onButtonClick);


        return panel;
    }

    button(spec) {
        let final = Object.assign( {
            text: Sketch.zero,
            pressed: this.constructor.dfltPressed,
            unpressed: this.constructor.dfltUnpressed,
            highlight: this.constructor.dfltHighlight,
        }, spec);

        let button = new UxButton(final);
        button.evt.listen(button.constructor.evtMouseClicked, this.onSlotClick);
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

    onSlotClick(evt) {
        //this.reset();
        console.log(`onSlotClick: ${Fmt.ofmt(evt)} selected: ${this.selected}`);

        if (this.selected) {
            // -- self: unselect
            if (this.selected === evt.actor) {
                this.reset();
            } else if (this.selected.tag.startsWith('inv')) {
                // -- swap
                if (evt.actor.tag.startsWith('inv')) {
                    let selectedIdx = parseInt(this.selected.tag.slice('3'));
                    let targetIdx = parseInt(evt.actor.tag.slice('3'));
                    console.log(`swap: ${selectedIdx} -> ${targetIdx}`);
                    this.data.swap(selectedIdx, targetIdx);
                    this.reset();
                // -- try to move to belt
                } else if (this.selected.tag.startsWith('belt')) {
                // -- try to equip
                } else {
                }
            } else if (this.selected.tag.startsWith('belt')) {
            } else {
            }

        } else {
            this.select(evt.actor);
        }

        /*
        let item = this.getInventoryForButton(evt.actor);
        console.log(`-- item: ${item}`);
        if (item) {
            this.markCompatibleSlots(item);
        }
        if (this.selected) {
            this.selected.pressed = this.constructor.dfltPressed;
            this.selected.unpressed = this.constructor.dfltUnpressed;
            this.selected.highlight = this.constructor.dfltHighlight;
        }
        this.selected = evt.actor;
        this.selected.pressed = this.constructor.dfltSelectedPressed;
        this.selected.unpressed = this.constructor.dfltSelectedUnpressed;
        this.selected.highlight = this.constructor.dfltSelectedHighlight;
        */
    }

    markCompatibleSlots(item) {
        if (item.constructor.slot === 'belt') {
            for (let i=0; i<this.numBelt; i++) {
                let button = Hierarchy.find(this, (v) => v.tag === `belt${i}`);
                button.unpressed = this.constructor.dfltMark;
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

    onDataAdded(evt) {
        console.log(`onDataAdded: ${Fmt.ofmt(evt)}`);
        let slotTag = `inv${evt.slot}`;
        let sketchTag = evt.target.sketch.tag;
        this.assignSlotSketch(slotTag, sketchTag);
    }

    /*
    onDataRemoved(evt) {
        console.log(`onDataRemoved: ${Fmt.ofmt(evt)}`);
        let slotTag = `inv${evt.slot}`;
        this.assignSlotSketch(slotTag);
    }
    */

    setData(data) {
        if (this.data) {
            this.data.evt.ignore(this.data.constructor.evtAdded, this.onInventoryAdded);
        }
        this.data = data;
        this.data.evt.listen(this.data.constructor.evtAdded, this.onInventoryAdded);
    }

}