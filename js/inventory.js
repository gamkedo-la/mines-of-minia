export { Inventory, InventoryData };

import { DropAction } from './actions/drop.js';
import { UseAction } from './actions/use.js';
import { Assets } from './base/assets.js';
import { Events, EvtStream } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
import { Rect } from './base/rect.js';
import { Sketch } from './base/sketch.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxPanel } from './base/uxPanel.js';
import { UxText } from './base/uxText.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';
import { Key } from './entities/key.js';
import { Prompt } from './prompt.js';
import { TurnSystem } from './systems/turnSystem.js';

const invTextColor = "yellow";

class InventoryData {
    // STATIC VARIABLES ----------------------------------------------------
    static evtAdded = 'inventory.added';
    static evtRemoved = 'inventory.removed';
    static evtBeltChanged = 'belt.changed';
    static evtEquipChanged = 'equip.changed';
    static evtOtherChanged = 'other.changed';

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        // -- equip
        this.shielding = spec.shielding;
        this.reactor = spec.reactor;
        this.weapon = spec.weapon;
        // -- gadgets
        this.gadget0 = spec.gadget0;
        this.gadget1 = spec.gadget1;
        this.gadget2 = spec.gadget2;
        this.gadgetSlots = spec.gadgetSlots || 3;
        // -- bakcback
        this.slots = Array.from(spec.slots || []);
        this.numSlots = spec.numSlots || 15;
        // -- belt
        this.belt = spec.belt || [];
        this.beltSlots = spec.beltSlots || 5;
        this.evt = new EvtStream();
        // -- other
        this.tokens = spec.tokens || 0;
        for (const keyKind of Key.kinds) {
            let tag = `key.${keyKind}`;
            this[tag] = spec[tag] || 0;
        }
        // -- actor (entity tied to inventory)
        this.actor;
        // -- event handlers
        this.onUse = this.onUse.bind(this);
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

    // EVENT HANDLERS ------------------------------------------------------
    onUse(evt) {
        let item = evt.actor;
        // remove item from inventory
        this.removeItem(item);
        // destroy object if applicable
        if (!item.constructor.stackable || item.count <= 0) {
            item.destroy();
        }
    }

    // METHODS -------------------------------------------------------------
    add(item, slot=null) {
        // item is token
        if (item.constructor.slot === 'tokens') {
            this.addToken(item);
            return true;
        }
        // item is key
        if (item.constructor.slot === 'key') {
            this.addKey(item);
            return true;
        }
        // is item stackable (stacked by name)
        if (item.constructor.stackable) {
            // is there a slot for this stack already
            for (let i=0; i<this.numSlots; i++) {
                if (this.slots[i] && this.slots[i].name === item.name) {
                    this.slots[i].count += 1;
                    this.evt.trigger(this.constructor.evtAdded, {actor: this.actor, slot: i, target: this.slots[i]});
                    // only keep one copy of item
                    item.destroy();
                    return true;
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
            if (slot === null) return false;
        }
        this.slots[slot] = item;
        // item is usable?
        if (item.constructor.usable) item.evt.listen(item.constructor.evtUse, this.onUse);
        this.evt.trigger(this.constructor.evtAdded, {actor: this.actor, slot: slot, target: item});
        return true;
    }

    remove(slot, all=false) {
        if (this.slots[slot]) {
            let item = this.slots[slot];
            // is item stackable?
            if (!item.constructor.stackable || (item.constructor.stackable && item.count <= 1) || all) {
                let gid = (this.slots[slot]) ? this.slots[slot].gid : 0;
                this.slots[slot] = undefined;
                if (item && item.constructor.usable) item.evt.ignore(item.constructor.evtUse, this.onUse);
                // check for belt reference -- remove if found
                for (let i=0; i<this.beltSlots; i++) {
                    if (this.belt[i] === gid) {
                        this.belt[i] = null;
                        this.evt.trigger(this.constructor.evtBeltChanged, {actor: this.actor, slot: i, target: null});
                        break;
                    }
                }
            } else {
                item.count -= 1;
            }
            this.evt.trigger(this.constructor.evtRemoved, {actor: this.actor, slot: slot});
            return item;
        }
        return null;
    }

    removeItem(item, all=false) {
        for (let i=0; i<this.numSlots; i++) {
            if (this.slots[i] && this.slots[i].gid === item.gid) {
                return this.remove(i, all);
            }
        }
        return null;
    }

    swap(slot1, slot2) {
        let tmpi = this.slots[slot2];
        this.slots[slot2] = this.slots[slot1];
        if (this.slots[slot2]) {
            this.evt.trigger(this.constructor.evtAdded, {actor: this.actor, slot: slot2, target: this.slots[slot2]});
        } else if (tmpi) {
            this.evt.trigger(this.constructor.evtRemoved, {actor: this.actor, slot: slot2});
        }
        let oslot1 = this.slots[slot1];
        this.slots[slot1] = tmpi;
        if (this.slots[slot1]) {
            this.evt.trigger(this.constructor.evtAdded, {actor: this.actor, slot: slot1, target: this.slots[slot1]});
        } else if (oslot1) {
            this.evt.trigger(this.constructor.evtRemoved, {actor: this.actor, slot: slot1});
        }
    }

    swapBelt(slot1, slot2) {
        let tmpi = this.belt[slot2];
        this.belt[slot2] = this.belt[slot1];
        this.evt.trigger(this.constructor.evtBeltChanged, {actor: this.actor, slot: slot2, target: this.getByGid(this.belt[slot2])});
        this.belt[slot1] = tmpi;
        this.evt.trigger(this.constructor.evtBeltChanged, {actor: this.actor, slot: slot1, target: this.getByGid(this.belt[slot1])});
    }

    equip(slot, item) {
        if (item.constructor.slot !== slot) return false;
        this.removeItem(item);
        this[slot] = item;
        this.evt.trigger(this.constructor.evtEquipChanged, {actor: this.actor, slot: slot, target: item});
        if (item && item.constructor.evtEquipped) item.evt.trigger(item.constructor.evtEquipped, {actor: this.actor, target: item});
        return true;
    }

    unequip(slot, invslot) {
        let item = this[slot];
        if (!item) return false;
        if (!this.add(item, invslot)) return false;
        this[slot] = null;
        this.evt.trigger(this.constructor.evtEquipChanged, {actor: this.actor, slot: slot, target: null});
        if (item && item.constructor.evtUnequipped) item.evt.trigger(item.constructor.evtUnequipped, {actor: this.actor, target: item});
        return true;
    }

    equipBelt(item, slot=null) {
        if (item.constructor.slot !== 'belt') return;
        if (slot === null) {
            for (let i=0; i<this.beltSlots; i++) if (!this.belt[i]) slot = i;
            if (slot === null) return;
        }
        // check for already on belt
        if (this.belt.includes(item.gid)) return;
        this.belt[slot] = item.gid;
        this.evt.trigger(this.constructor.evtBeltChanged, {actor: this.actor, slot: slot, target: item});
    }

    unequipBelt(slot) {
        this.evt.trigger(this.constructor.evtBeltChanged, {actor: this.actor, slot: slot, target: null});
        this.belt[slot] = null;
    }

    getByName(name) {
        if (!name) return null;
        for (let i=0; i<this.numSlots; i++) {
            if (this.slots[i] && this.slots[i].name === name) return this.slots[i];
        }
        return null;
    }

    getByGid(gid) {
        for (let i=0; i<this.numSlots; i++) {
            if (this.slots[i] && this.slots[i].gid === gid) return this.slots[i];
        }
        return null;
    }

    as_kv() {
        let spec = {
            cls: this.constructor.name,
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

    addToken(item) {
        this.tokens += item.count;
        this.evt.trigger(this.constructor.evtOtherChanged, {actor: this, slot: 'tokens'});
        item.destroy();
    }

    removeToken(count) {
        this.tokens -= count;
        this.evt.trigger(this.constructor.evtOtherChanged, {actor: this, slot: 'tokens'});
    }

    addKey(item) {
        let tag = `key.${item.kind}`;
        this[tag] += 1;
        this.evt.trigger(this.constructor.evtOtherChanged, {actor: this, slot: tag});
        item.destroy();
    }

    removeKey(keyKind) {
        let tag = `key.${keyKind}`;
        this[tag] -= 1;
        if (this[tag] < 0) this[tag] = 0;
        this.evt.trigger(this.constructor.evtOtherChanged, {actor: this, slot: tag});
    }

    hasKey(keyKind) {
        let tag = `key.${keyKind}`;
        return this[tag] > 0;
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
        this.onOtherChanged = this.onOtherChanged.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onPopupDestroy = this.onPopupDestroy.bind(this);

        this.bg = new UxPanel({
            sketch: Assets.get('oframe.red', true),
            xform: new XForm({offset: 10, right:.3}),
            children: [
                new UxPanel({
                    tag: 'equip',
                    xform: new XForm({offset: 10, top: .1, bottom: .2, right:.6}),
                    sketch: Assets.get('frame.red', true),
                    children: [
                        new UxText({
                            text: new Text({text: 'equipment', color: invTextColor}),
                            xform: new XForm({top: .025, bottom: .9}),
                        }),
                        new UxPanel({
                            sketch: Assets.get('player_portrait', true, { lockRatio: true }),
                            xform: new XForm({top: -.1, bottom: .0, left: -.2, right: -.2}),
                        }),
                        this.slot({ tag: 'gadget0', xform: new XForm({left: .1, right: .65, top: .2, bottom: .6}), }),
                        this.slot({ tag: 'gadget1', xform: new XForm({left: .375, right: .375, top: .2, bottom: .6}), }),
                        this.slot({ tag: 'gadget2', xform: new XForm({left: .65, right: .1, top: .2, bottom: .6}), }),
                        this.slot({ tag: 'weapon', xform: new XForm({left: .1, right: .65, top: .4, bottom: .4}), }),
                        this.slot({ tag: 'reactor', xform: new XForm({left: .375, right: .375, top: .4, bottom: .4}), }),
                        this.slot({ tag: 'shielding', xform: new XForm({left: .65, right: .1, top: .4, bottom: .4}), }),

                        this.counter({ tag: 'tokens', xform: new XForm({offset: 10, left: 0, right: .75, top: .8, bottom: .05}), sketch: Assets.get('token.carry', true, {lockRatio: true})}),
                        this.counter({ tag: 'key.blue', xform: new XForm({offset: 10, left: .25, right: .5, top: .8, bottom: .05}), sketch: Assets.get('key.blue', true, {lockRatio: true})}),
                        this.counter({ tag: 'key.dark', xform: new XForm({offset: 10, left: .5, right: .25, top: .8, bottom: .05}), sketch: Assets.get('key.dark', true, {lockRatio: true})}),
                        this.counter({ tag: 'key.green', xform: new XForm({offset: 10, left: .75, right: .0, top: .8, bottom: .05}), sketch: Assets.get('key.green', true, {lockRatio: true})}),

                    ],
                }),

                new UxPanel({
                    tag: 'belt',
                    xform: new XForm({offset: 10, left:.4, bottom: .75}),
                    sketch: Assets.get('frame.red', true),
                    children: [
                        new UxText({
                            text: new Text({text: 'quick slots', color: invTextColor}),
                            xform: new XForm({top: .1, bottom: .65}),
                        }),
                        this.slot({ tag: 'belt0', xform: new XForm({offset: 10, top: .3, left: .0, right: .8}), }, '1'),
                        this.slot({ tag: 'belt1', xform: new XForm({offset: 10, top: .3, left: .2, right: .6}), }, '2'),
                        this.slot({ tag: 'belt2', xform: new XForm({offset: 10, top: .3, left: .4, right: .4}), }, '3'),
                        this.slot({ tag: 'belt3', xform: new XForm({offset: 10, top: .3, left: .6, right: .2}), }, '4'),
                        this.slot({ tag: 'belt4', xform: new XForm({offset: 10, top: .3, left: .8, right: .0}), }, '5'),
                    ],
                }),

                new UxPanel({
                    tag: 'backback',
                    xform: new XForm({offset: 10, left:.4, top: .25}),
                    sketch: Assets.get('frame.red', true),
                    children: [
                        new UxText({
                            text: new Text({text: 'backpack', color: invTextColor}),
                            xform: new XForm({top: .025, bottom: .9}),
                        }),
                        new UxPanel({
                            xform: new XForm({top: .1}),
                            sketch: Sketch.zero,
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

                                this.slot({ tag: 'inv10', xform: new XForm({offset: 10, left: .0, right: .8, top: .4, bottom: .4}), }),
                                this.slot({ tag: 'inv11', xform: new XForm({offset: 10, left: .2, right: .6, top: .4, bottom: .4}), }),
                                this.slot({ tag: 'inv12', xform: new XForm({offset: 10, left: .4, right: .4, top: .4, bottom: .4}), }),
                                this.slot({ tag: 'inv13', xform: new XForm({offset: 10, left: .6, right: .2, top: .4, bottom: .4}), }),
                                this.slot({ tag: 'inv14', xform: new XForm({offset: 10, left: .8, right: .0, top: .4, bottom: .4}), }),

                                this.slot({ tag: 'inv15', xform: new XForm({offset: 10, left: .0, right: .8, top: .6, bottom: .2}), }),
                                this.slot({ tag: 'inv16', xform: new XForm({offset: 10, left: .2, right: .6, top: .6, bottom: .2}), }),
                                this.slot({ tag: 'inv17', xform: new XForm({offset: 10, left: .4, right: .4, top: .6, bottom: .2}), }),
                                this.slot({ tag: 'inv18', xform: new XForm({offset: 10, left: .6, right: .2, top: .6, bottom: .2}), }),
                                this.slot({ tag: 'inv19', xform: new XForm({offset: 10, left: .8, right: .0, top: .6, bottom: .2}), }),

                                this.slot({ tag: 'inv20', xform: new XForm({offset: 10, left: .0, right: .8, top: .8, bottom: .0}), }),
                                this.slot({ tag: 'inv21', xform: new XForm({offset: 10, left: .2, right: .6, top: .8, bottom: .0}), }),
                                this.slot({ tag: 'inv22', xform: new XForm({offset: 10, left: .4, right: .4, top: .8, bottom: .0}), }),
                                this.slot({ tag: 'inv23', xform: new XForm({offset: 10, left: .6, right: .2, top: .8, bottom: .0}), }),
                                this.slot({ tag: 'inv24', xform: new XForm({offset: 10, left: .8, right: .0, top: .8, bottom: .0}), }),
                            ],
                        }),

                    ],
                }),

            ],
        });
        this.adopt(this.bg);
        this.setData(spec.data || new InventoryData);
        this.selected;
        this.marked = [];
        this.filtered = [];

        // disable excess belts
        for (let i=4; i+1>this.data.beltSlots; i--) {
            this.toggleSlot(`belt${i}`, false);
        }

        // disable gadget slots
        for (let i=2; i+1>this.data.gadgetSlots; i--) {
            this.toggleSlot(`gadget${i}`, false);
        }

        // disable backpack slots
        for (let i=24; i+1>this.data.numSlots; i--) {
            this.toggleSlot(`inv${i}`, false);
        }

        Events.listen(Keys.evtDown, this.onKeyDown);

    }

    destroy() {
        super.destroy();
        Events.ignore(Keys.evtDown, this.onKeyDown);
        if (this.data) {
            this.data.evt.ignore(this.data.constructor.evtAdded, this.onInventoryAdded);
            this.data.evt.ignore(this.data.constructor.evtRemoved, this.onInventoryRemoved);
            this.data.evt.ignore(this.data.constructor.evtBeltChanged, this.onBeltChanged);
            this.data.evt.ignore(this.data.constructor.evtEquipChanged, this.onEquipChanged);
            this.data.evt.ignore(this.data.constructor.evtOtherChanged, this.onOtherChanged);
        }
    }

    // EVENT HANDLERS ------------------------------------------------------

    onKeyDown(evt) {
        if (!this.active) return;
        switch (evt.key) {
            case 'Escape': {
                this.destroy();
                break;
            }
        }
    }

    onSlotClick(evt) {
        //console.log(`onSlotClick: ${Fmt.ofmt(evt)} selected: ${this.selected}`);
        let item = this.getItemForSlot(evt.actor.tag);
        if (this.wantUseTarget && this.itemPopup) {
            this.itemPopup.setTarget(item);
            return;
        }
        if (this.selected) {
            let selectedItem = this.getItemForSlot(this.selected.tag);
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
                            this.data.unequip(this.selected.tag, targetIdx);
                        }
                    }
                }
                this.reset();
            }
        } else {
            if (item) {
                this.itemPopup = new ItemPopup({
                    xform: new XForm({ left: .7, top: .2, bottom: .2}),
                    item: item,
                    handleUse: this.handleUse.bind(this),
                });
                this.itemPopup.evt.listen(this.itemPopup.constructor.evtDestroyed, this.onPopupDestroy);
                this.adopt(this.itemPopup);
                this.markCompatibleSlots(item);
                this.select(evt.actor);
            }
        }
    }

    onPopupDestroy(evt) {
        this.itemPopup = null;
        this.reset();
    }

    onInventoryAdded(evt) {
        let slot = `inv${evt.slot}`;
        this.updateSlot(slot);
    }

    onInventoryRemoved(evt) {
        let slot = `inv${evt.slot}`;
        this.updateSlot(slot);
    }

    onEquipChanged(evt) {
        this.updateSlot(evt.slot);
    }

    onBeltChanged(evt) {
        let slot = `belt${evt.slot}`;
        this.updateSlot(slot);
    }

    onOtherChanged(evt) {
        this.updateSlot(evt.slot);
    }

    // METHODS -------------------------------------------------------------

    hide() {
        if (this.itemPopup) {
            this.itemPopup.destroy();
            this.itemPopup = null;
        }
        this.reset();
        super.hide();
    }

    changeSlotCount(tag, count) {
        let cpanel = Hierarchy.find(this, (v) => v.tag === `${tag}.cpanel`);
        let ctext = Hierarchy.find(this, (v) => v.tag === `${tag}.ctext`);
        // disable slot counter if not stacked
        if (!count || count <= 1) {
            cpanel.enable = false;
            cpanel.visible = false;
        } else {
            cpanel.enable = true;
            cpanel.visible = true;
            ctext.text = `${count}`;
        }
    }

    slot(spec, slotid=null, sketch=null) {
        let slotTag = spec.tag || 'slot';
        if (!sketch) sketch = Sketch.zero;
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
                            sketch: sketch,
                        }),
                        this.button({ tag: slotTag }, this.onSlotClick),
                        new UxPanel({
                            tag: `${slotTag}.cpanel`,
                            xform: new XForm({left: .6, top: .85, bottom: -.15, oright: 5}),
                            active: (slotid !== null),
                            visible: (slotid !== null),
                            children: [
                                new UxText({
                                    tag: `${slotTag}.ctext`,
                                    text: new Text({text: slotid || '0', color: invTextColor}),
                                    xform: new XForm({bottom: -.15}),
                                }),
                            ],
                        }),
                        new UxPanel({
                            tag: `${slotTag}.overlay`,
                            xform: new XForm(),
                            sketch: Sketch.zero,
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
            mouseClickedSound: Assets.get('menu.click', true),
        }, spec);
        let button = new UxButton(final);
        button.evt.listen(button.constructor.evtMouseClicked, cb);
        return button;
    }

    counter(spec, count) {
        let tag = spec.tag || 'counter';
        let panel = new UxPanel( Object.assign( {
            children: [
                new UxPanel({
                    tag: `${tag}.cpanel`,
                    xform: new XForm({left: .6, top: .75, bottom: -.25}),
                    sketch: Sketch.zero,
                    children: [
                        new UxText({
                            tag: `${tag}.ctext`,
                            text: new Text({text: '0', color: invTextColor}),
                            xform: new XForm({bottom: -.15}),
                        }),
                    ],
                }),
            ],
        }, spec));
        panel.xform.lockRatio = true;
        return panel;
    }

    getItemForSlot(slot) {
        if (slot.startsWith('inv')) {
            let idx = parseInt(slot.slice('3'));
            return this.data.slots[idx];
        }
        if (slot.startsWith('belt')) {
            let idx = parseInt(slot.slice('4'));
            let gid = this.data.belt[idx];
            return this.data.getByGid(gid);
        }
        return this.data[slot];
    }

    markCompatibleSlots(item) {
        if (item.constructor.slot === 'belt') {
            for (let i=0; i<this.data.beltSlots; i++) {
                let button = Hierarchy.find(this, (v) => v.tag === `belt${i}`);
                this.markButton(button);
            }
        } else if (item.constructor.slot === 'weapon') {
            let button = Hierarchy.find(this, (v) => v.tag === `weapon`);
            this.markButton(button);
        } else if (item.constructor.slot === 'shielding') {
            let button = Hierarchy.find(this, (v) => v.tag === `shielding`);
            this.markButton(button);
        } else if (item.constructor.slot === 'reactor') {
            let button = Hierarchy.find(this, (v) => v.tag === `reactor`);
            this.markButton(button);
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

    toggleSlot(slotTag, enabled) {
        let button  = Hierarchy.find(this.bg, (v) => v.tag === `${slotTag}`);
        let overlay  = Hierarchy.find(this.bg, (v) => v.tag === `${slotTag}.overlay`);
        // button activate
        button.active = enabled;
        // update overlay
        if (enabled) {
            overlay.sketch = Sketch.zero;
        } else {
            overlay.sketch = new Rect({ width: 16, height: 16, color: 'rgba(55,55,55,.5)', borderColor: 'rgba(127,127,127,.5)', border: 2});
        }
    }

    filterButtons(filter) {
        if (!filter) filter = (v) => true;
        for (const slot of ['reactor', 'weapon', 'shielding', 'gadget0', 'gadget1', 'gadget2']) {
            let item = this.getItemForSlot(slot);
            if (!filter(item)) {
                this.toggleSlot(slot, false);
                this.filtered.push(slot);
            }
        }
        for (let i=0; i<this.data.numSlots; i++) {
            let slot = `inv${i}`;
            let item = this.getItemForSlot(slot);
            if (!filter(item)) {
                this.toggleSlot(slot, false);
                this.filtered.push(slot);
            }
        }
    }

    reset() {
        for (const button of Array.from(this.marked)) {
            button.unpressed = this.constructor.dfltUnpressed;
        }
        for (const slot of Array.from(this.filtered)) {
            this.toggleSlot(slot, true);
        }
        this.filtered = [];
        if (this.selected) this.unselect(this.selected);
        if (this.itemPopup) this.itemPopup.destroy();
    }

    updateSlot(slot) {
        // handle key/token slots
        let count = 0;
        let item;
        let updateSketch = true;
        let updateCount = true;
        let alwaysShowCount = true;
        if (slot.startsWith('key') || slot === 'tokens') {
            count = this.data[slot];
            updateSketch = false;
        } else if (slot.startsWith('belt')) {
            updateCount = false;
            item = this.getItemForSlot(slot)
        } else {
            item = this.getItemForSlot(slot)
            if (item) count = item.count;
            alwaysShowCount = false;
        }
        // pull item for slot
        // -- update sketch
        if (updateSketch) {
            let panel  = Hierarchy.find(this.bg, (v) => v.tag === `${slot}.panel`);
            let sketch = (item) ? Assets.get(item.sketch.tag, true, {lockRatio: true, state: 'carry'}) : Sketch.zero;
            if (sketch) panel.sketch = sketch;
        }
        // -- update counter
        if (updateCount) {
            let cpanel = Hierarchy.find(this, (v) => v.tag === `${slot}.cpanel`);
            let ctext = Hierarchy.find(this, (v) => v.tag === `${slot}.ctext`);
            if (!alwaysShowCount && count <= 1) {
                cpanel.enable = false;
                cpanel.visible = false;
            } else {
                cpanel.enable = true;
                cpanel.visible = true;
                ctext.text = `${count}`;
            }
        }
    }

    setData(data) {
        if (this.data) {
            this.data.evt.ignore(this.data.constructor.evtAdded, this.onInventoryAdded);
            this.data.evt.ignore(this.data.constructor.evtRemoved, this.onInventoryRemoved);
            this.data.evt.ignore(this.data.constructor.evtBeltChanged, this.onBeltChanged);
            this.data.evt.ignore(this.data.constructor.evtEquipChanged, this.onEquipChanged);
            this.data.evt.ignore(this.data.constructor.evtOtherChanged, this.onOtherChanged);
        }
        this.data = data;
        this.data.evt.listen(this.data.constructor.evtAdded, this.onInventoryAdded);
        this.data.evt.listen(this.data.constructor.evtRemoved, this.onInventoryRemoved);
        this.data.evt.listen(this.data.constructor.evtBeltChanged, this.onBeltChanged);
        this.data.evt.listen(this.data.constructor.evtEquipChanged, this.onEquipChanged);
        this.data.evt.listen(this.data.constructor.evtOtherChanged, this.onOtherChanged);
        // fill out inventory sprites for anything currently in inventory
        for (const slot of ['reactor', 'weapon', 'shielding', 'gadget0', 'gadget1', 'gadget2', 'tokens']) {
            this.updateSlot(slot);
        }
        for (let i=0; i<this.data.numSlots; i++) {
            let slot = `inv${i}`;
            this.updateSlot(slot);
        }
        for (let i=0; i<this.data.beltSlots; i++) {
            let slot = `belt${i}`;
            this.updateSlot(slot);
        }
        // keys
        for (const kind of Key.kinds) {
            let slot = `key.${kind}`;
            this.updateSlot(slot);
        }

        // disable gadget slots
        for (let i=2; i+1>this.data.gadgetSlots; i--) {
            this.toggleSlot(`gadget${i}`, false);
        }

        // disable excess belts
        for (let i=4; i+1>this.data.beltSlots; i--) {
            this.toggleSlot(`belt${i}`, false);
        }

        // disable backpack slots
        for (let i=0; i<25; i++) {
            this.toggleSlot(`inv${i}`, (i<data.numSlots));
        }
    }

    handleUse(item) {
        if (!item.constructor.usable) return;
        if (item.requiresTarget) {
            // set want target state
            this.wantUseTarget = true;
            // filter buttons for target
            this.filterButtons(item.useFilter);
            // popup item select view
            this.itemPopup = new ItemPopup({
                title: `select ${item.kind} target`,
                xform: new XForm({ left: .7, top: .2, bottom: .2}),
                item: item,
                wantTarget: true,
                handleUse: this.handleUseTarget.bind(this),
            });
            this.itemPopup.evt.listen(this.itemPopup.constructor.evtDestroyed, this.onPopupDestroy);
            this.adopt(this.itemPopup);
        } else if (item.constructor.shootable) {
            console.log(`${item} shootable`);
            Events.trigger('handler.wanted', {which: 'aim', shooter: item});
            this.destroy();
        } else {
            let action = new UseAction({
                item: item,
            });
            TurnSystem.postLeaderAction(action);
            this.destroy();
        }
    }

    handleUseTarget(item, target) {
        console.log(`handleUseTarget: ${item} target: ${target}`);
        this.wantUseTarget = false;
        let action = new UseAction({
            item: item,
            target: target,
        });
        TurnSystem.postLeaderAction(action);
        this.destroy();
    }

}

class ItemPopup extends UxView {

    cpost(spec) {
        super.cpost(spec);
        this.handleUse = spec.handleUse;
        let title = spec.title || 'info';
        this.wantTarget = spec.wantTarget;
        this.item;
        this.target;

        this.panel = new UxPanel({
            sketch: Assets.get('oframe.red', true),
            children: [
                // title
                new UxText({
                    tag: 'title',
                    xform: new XForm({offset: 5, bottom: .9}),
                    text: new Text({ text: title, color: invTextColor}),
                }),

                // top panel
                new UxPanel({
                    xform: new XForm({top: .1, bottom: .7}),
                    sketch: Sketch.zero,
                    children: [
                        new UxPanel({
                            xform: new XForm({offset: 10, right: .7, width: 10, height: 10, lockRatio: true}),
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
                            xform: new XForm({left: .3, offset: 5, top: .1, bottom: .4}),
                            text: new Text({ text: 'name', color: invTextColor, align: 'left'}),
                        }),

                        new UxText({
                            tag: 'item.kind',
                            xform: new XForm({left: .3, offset: 5, top: .5, bottom: .1}),
                            text: new Text({ text: 'kind', color: invTextColor, align: 'left'}),
                        }),

                    ]
                }),

                // description
                new UxPanel({
                    xform: new XForm({top: .325, bottom: .225}),
                    sketch: Sketch.zero,
                    children: [
                        new UxText({
                            tag: 'item.description',
                            xform: new XForm({offset: 15}),
                            text: new Text({wrap: true, text: 'description', color: invTextColor, valign: 'top', align: 'left'}),
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
                            text: new Text({text: '   use   '}),
                        }),
                        new UxButton({
                            tag: 'item.confirm',
                            xform: new XForm({offset: 10, right:.67}),
                            text: new Text({text: ' confirm '}),
                        }),
                        new UxButton({
                            tag: 'item.drop',
                            xform: new XForm({offset: 10, left:.33, right:.33}),
                            text: new Text({text: '  drop  '}),
                        }),
                        new UxButton({
                            tag: 'item.throw',
                            xform: new XForm({offset: 10, left:.67}),
                            text: new Text({text: ' throw '}),
                        }),
                        new UxButton({
                            tag: 'item.cancel',
                            xform: new XForm({offset: 10, left:.67}),
                            text: new Text({text: ' cancel '}),
                        }),
                    ]
                }),
            ]
        });
        this.adopt(this.panel);

        // ui elements
        this.title = Hierarchy.find(this, (v) => v.tag === 'title');
        this.picture = Hierarchy.find(this, (v) => v.tag === 'item.picture');
        this.name = Hierarchy.find(this, (v) => v.tag === 'item.name');
        this.kind = Hierarchy.find(this, (v) => v.tag === 'item.kind');
        this.description = Hierarchy.find(this, (v) => v.tag === 'item.description');
        this.useButton = Hierarchy.find(this, (v) => v.tag === 'item.use');
        this.dropButton = Hierarchy.find(this, (v) => v.tag === 'item.drop');
        this.throwButton = Hierarchy.find(this, (v) => v.tag === 'item.throw');
        this.confirmButton = Hierarchy.find(this, (v) => v.tag === 'item.confirm');
        this.cancelButton = Hierarchy.find(this, (v) => v.tag === 'item.cancel');
        // set button state
        // -- want target state... hide use/drop/throw
        if (this.wantTarget) {
            this.useButton.active = this.useButton.visible = false;
            this.dropButton.active = this.dropButton.visible = false;
            this.throwButton.active = this.throwButton.visible = false;
            // -- disable confirm
            this.confirmButton.active = false;
        // item info state... hide confirm/cancel
        } else {
            this.confirmButton.active = this.confirmButton.visible = false;
            this.cancelButton.active = this.cancelButton.visible = false;
            // disable use button
            this.useButton.active = false;
        }

        // event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onUseClicked = this.onUseClicked.bind(this);
        this.onDropClicked = this.onDropClicked.bind(this);
        this.onThrowClicked = this.onThrowClicked.bind(this);
        this.onConfirmClicked = this.onConfirmClicked.bind(this);
        this.onCancelClicked = this.onCancelClicked.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        this.useButton.evt.listen(this.useButton.constructor.evtMouseClicked, this.onUseClicked);
        this.dropButton.evt.listen(this.dropButton.constructor.evtMouseClicked, this.onDropClicked);
        this.throwButton.evt.listen(this.throwButton.constructor.evtMouseClicked, this.onThrowClicked);
        this.confirmButton.evt.listen(this.confirmButton.constructor.evtMouseClicked, this.onConfirmClicked);
        this.cancelButton.evt.listen(this.cancelButton.constructor.evtMouseClicked, this.onCancelClicked);

        this.item = spec.item;
        if (spec.item && !this.wantTarget) this.setItem(spec.item);

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

    onUseClicked(evt) {
        // destroy window
        this.destroy();
        // call function to handle use
        this.handleUse(this.item);
    }

    onDropClicked(evt) {
        let action = new DropAction({
            item: this.item,
        });
        TurnSystem.postLeaderAction(action);
        this.destroy();
    }

    onThrowClicked(evt) {
        this.parent.destroy();
        this.destroy();
        Events.trigger('handler.wanted', {which: 'aim', shooter: this.item});
    }

    onConfirmClicked(evt) {
        console.log(`onConfirmClicked`);
        this.destroy();
        this.handleUse(this.item, this.target);
    }

    onCancelClicked(evt) {
        console.log(`onCancelClicked`);
        if (!this.item.constructor.isDiscovered(this.item.kind)) {
            let prompt = new Prompt({
                xform: new XForm({ border: .3 }),
                title: 'confirm',
                prompt: `*${this.item.name}* has just been discovered. canceling now will still consume the item without applying its effect. are you sure?`,
                handleConfirm: () => {
                    this.handleUse(this.item, null);
                    this.destroy();
                }
            });
            this.parent.adopt(prompt);
        } else {
            this.destroy();
        }
    }

    setItem(item) {
        // enable use button if item is usable
        if (item.constructor.usable) {
            this.useButton.active = true;
        }
        // picture
        this.picture.sketch = Assets.get(item.sketch.tag, true, { lockRatio: true, state: 'carry'}) || Sketch.zero;
        this.name.text = item.name;
        this.kind.text = `-- ${item.constructor.slot} --`;
        this.description.text = item.description;
        this.item = item;
    }

    setTarget(item) {
        // -- enable confirm
        this.confirmButton.active = true;
        // picture
        this.picture.sketch = Assets.get(item.sketch.tag, true, { lockRatio: true, state: 'carry'}) || Sketch.zero;
        this.name.text = item.name;
        this.kind.text = `-- ${item.constructor.slot} --`;
        this.description.text = item.description;
        this.target = item;
    }

}