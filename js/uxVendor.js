
export { UxVendor };

import { DropAction } from './actions/drop.js';
import { UseAction } from './actions/use.js';
import { Assets } from './base/assets.js';
import { Config } from './base/config.js';
import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Generator } from './base/generator.js';
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
import { Resurrect64 } from './resurrect64.js';
import { OverlaySystem } from './systems/overlaySystem.js';
import { TurnSystem } from './systems/turnSystem.js';

const textColor = "yellow";

function button(text, spec) {
    return new UxButton(Object.assign({}, UxButton.xspec({
        x_textXform: XForm.xspec({offset: 10}),
        highlight: Sketch.zero,
        unpressed: Sketch.zero,
        pressed: Sketch.zero,
        text: new Text({text: text, color: Resurrect64.colors[0]}),
        hltext: new Text({text: text, color: Resurrect64.colors[10]}),
    }), spec));
}

function counter(spec, count) {
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
                        text: new Text({text: '0', color: textColor}),
                        xform: new XForm({bottom: -.15}),
                    }),
                ],
            }),
        ],
    }, spec));
    panel.xform.lockRatio = true;
    return panel;
}

class UxVendor extends UxView {
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
        this.onSlotClick = this.onSlotClick.bind(this);
        this.onOtherChanged = this.onOtherChanged.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onPopupDestroy = this.onPopupDestroy.bind(this);
        this.onBuyClicked = this.onBuyClicked.bind(this);
        this.onSellClicked = this.onSellClicked.bind(this);
        this.mode = 'buy';
        this.player = spec.player;
        this.vendor = spec.vendor;
        this.failedSfx = spec.failedSfx || Assets.get('action.failed', true);

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
                            text: new Text({text: 'bigsby', color: textColor}),
                            xform: new XForm({top: .025, bottom: .9}),
                        }),
                        new UxPanel({
                            sketch: Assets.get('vendor_portrait', true, { lockRatio: true }),
                            xform: new XForm({top: .1, bottom: .1, left: -.2, right: -.2}),
                        }),
                        counter({ tag: 'tokens', xform: new XForm({offset: 10, left: 0, right: .75, top: .8, bottom: .05}), sketch: Assets.get('token.carry', true, {lockRatio: true})}),
                    ],
                }),
                new UxPanel({
                    tag: 'trade',
                    xform: new XForm({offset: 10, left:.4, bottom: .75}),
                    sketch: Assets.get('frame.red', true),
                    children: [
                        new UxText({
                            text: new Text({text: 'vendor actions', color: textColor}),
                            xform: new XForm({top: .1, bottom: .65}),
                        }),
                        button('buy', { tag: 'vendor.buy', xform: new XForm({top: .3, left: .2, right: .6}), }),
                        button('sell', { tag: 'vendor.sell', xform: new XForm({top: .3, left: .6, right: .2}), }),
                    ],
                }),
                new UxPanel({
                    tag: 'transaction',
                    xform: new XForm({offset: 10, left:.4, top: .25}),
                    sketch: Assets.get('frame.red', true),
                    children: [
                        new UxText({
                            tag: 'transact.text',
                            text: new Text({text: 'wares', color: textColor}),
                            xform: new XForm({top: .025, bottom: .9}),
                        }),
                        new UxPanel({
                            xform: new XForm({top: .1}),
                            sketch: Sketch.zero,
                            children: [
                                this.slot({ tag: 'slot.0', xform: new XForm({offset: 10, left: .0, right: .8, top: .0, bottom: .8}), }),
                                this.slot({ tag: 'slot.1', xform: new XForm({offset: 10, left: .2, right: .6, top: .0, bottom: .8}), }),
                                this.slot({ tag: 'slot.2', xform: new XForm({offset: 10, left: .4, right: .4, top: .0, bottom: .8}), }),
                                this.slot({ tag: 'slot.3', xform: new XForm({offset: 10, left: .6, right: .2, top: .0, bottom: .8}), }),
                                this.slot({ tag: 'slot.4', xform: new XForm({offset: 10, left: .8, right: .0, top: .0, bottom: .8}), }),

                                this.slot({ tag: 'slot.5', xform: new XForm({offset: 10, left: .0, right: .8, top: .2, bottom: .6}), }),
                                this.slot({ tag: 'slot.6', xform: new XForm({offset: 10, left: .2, right: .6, top: .2, bottom: .6}), }),
                                this.slot({ tag: 'slot.7', xform: new XForm({offset: 10, left: .4, right: .4, top: .2, bottom: .6}), }),
                                this.slot({ tag: 'slot.8', xform: new XForm({offset: 10, left: .6, right: .2, top: .2, bottom: .6}), }),
                                this.slot({ tag: 'slot.9', xform: new XForm({offset: 10, left: .8, right: .0, top: .2, bottom: .6}), }),

                                this.slot({ tag: 'slot.10', xform: new XForm({offset: 10, left: .0, right: .8, top: .4, bottom: .4}), }),
                                this.slot({ tag: 'slot.11', xform: new XForm({offset: 10, left: .2, right: .6, top: .4, bottom: .4}), }),
                                this.slot({ tag: 'slot.12', xform: new XForm({offset: 10, left: .4, right: .4, top: .4, bottom: .4}), }),
                                this.slot({ tag: 'slot.13', xform: new XForm({offset: 10, left: .6, right: .2, top: .4, bottom: .4}), }),
                                this.slot({ tag: 'slot.14', xform: new XForm({offset: 10, left: .8, right: .0, top: .4, bottom: .4}), }),

                                this.slot({ tag: 'slot.15', xform: new XForm({offset: 10, left: .0, right: .8, top: .6, bottom: .2}), }),
                                this.slot({ tag: 'slot.16', xform: new XForm({offset: 10, left: .2, right: .6, top: .6, bottom: .2}), }),
                                this.slot({ tag: 'slot.17', xform: new XForm({offset: 10, left: .4, right: .4, top: .6, bottom: .2}), }),
                                this.slot({ tag: 'slot.18', xform: new XForm({offset: 10, left: .6, right: .2, top: .6, bottom: .2}), }),
                                this.slot({ tag: 'slot.19', xform: new XForm({offset: 10, left: .8, right: .0, top: .6, bottom: .2}), }),

                                this.slot({ tag: 'slot.20', xform: new XForm({offset: 10, left: .0, right: .8, top: .8, bottom: .0}), }),
                                this.slot({ tag: 'slot.21', xform: new XForm({offset: 10, left: .2, right: .6, top: .8, bottom: .0}), }),
                                this.slot({ tag: 'slot.22', xform: new XForm({offset: 10, left: .4, right: .4, top: .8, bottom: .0}), }),
                                this.slot({ tag: 'slot.23', xform: new XForm({offset: 10, left: .6, right: .2, top: .8, bottom: .0}), }),
                                this.slot({ tag: 'slot.24', xform: new XForm({offset: 10, left: .8, right: .0, top: .8, bottom: .0}), }),
                            ],
                        }),

                    ],
                }),

            ],
        });
        this.adopt(this.bg);
        //this.setData(spec.data || new InventoryData);
        this.updateSlots();
        this.buyButton = Hierarchy.find(this.bg, (v) =>v.tag === 'vendor.buy');
        this.buyButton.evt.listen(this.buyButton.constructor.evtMouseClicked, this.onBuyClicked);
        this.sellButton = Hierarchy.find(this.bg, (v) =>v.tag === 'vendor.sell');
        this.sellButton.evt.listen(this.buyButton.constructor.evtMouseClicked, this.onSellClicked);
        this.transactText = Hierarchy.find(this.bg, (v) => v.tag === 'transact.text');
        this.selected;

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
            case 'v':
            case 'Escape':
                this.destroy();
                break;
        }
    }

    onBuyClicked(evt) {
        if (this.mode !== 'buy') {
            this.mode = 'buy';
            this.transactText.text = 'wares';
            this.updateSlots();
        }
    }

    onSellClicked(evt) {
        if (this.mode !== 'sell') {
            this.mode = 'sell';
            this.transactText.text = 'inventory';
            this.updateSlots();
        }
    }

    onSlotClick(evt) {
        console.log(`onSlotClick: ${Fmt.ofmt(evt)} selected: ${this.selected}`);
        let item = this.getItemForSlot(evt.actor.tag);
        console.log(`item: ${item}`);
        if (this.selected) {
            this.reset();
        }
        if (item) {
            this.itemPopup = new VendorPopup({
                xform: new XForm({ left: .7, top: .2, bottom: .2}),
                mode: this.mode,
                item: item,
                handleSell: this.handleSell.bind(this),
                handleBuy: this.handleBuy.bind(this),
            });
            this.itemPopup.evt.listen(this.itemPopup.constructor.evtDestroyed, this.onPopupDestroy);
            this.adopt(this.itemPopup);
            this.select(evt.actor);
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

    updateSlot(slot, item) {
        // handle key/token slots
        let count = (item) ? item.count : 0;

        // -- update sketch
        let panel  = Hierarchy.find(this.bg, (v) => v.tag === `${slot}.panel`);
        let sketch = (item) ? Assets.get(item.sketch.tag, true, {lockRatio: true, state: 'carry'}) : Sketch.zero;
        panel.sketch = sketch;

        // -- update counter
        let cpanel = Hierarchy.find(this, (v) => v.tag === `${slot}.cpanel`);
        let ctext = Hierarchy.find(this, (v) => v.tag === `${slot}.ctext`);
        if (count <= 1) {
            cpanel.enable = false;
            cpanel.visible = false;
        } else {
            cpanel.enable = true;
            cpanel.visible = true;
            ctext.text = `${count}`;
        }

    }

    updateSlots() {
        let inventory;
        if (this.mode === 'buy') {
            inventory = this.vendor.inventory;
        } else {
            inventory = this.player.inventory;
        }
        for (let i=0; i<25; i++) {
            let tag = `slot.${i}`;
            //let slot = Hierarchy.find(this.bg, tag);
            this.updateSlot(tag, inventory.slots[i]);
        }
        // display player tokens
        let ctext = Hierarchy.find(this.bg, (v) => v.tag === 'tokens.ctext');
        ctext.text = `${this.player.inventory.tokens}`;
    }

    getItemForSlot(slot) {
        let idx = parseInt(slot.slice('5'));
        let inventory = (this.mode === 'buy') ? this.vendor.inventory : this.player.inventory;
        return inventory.slots[idx];
    }

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
                                    text: new Text({text: slotid || '0', color: textColor}),
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
        if (this.selected) this.unselect(this.selected);
        if (this.itemPopup) this.itemPopup.destroy();
    }

    handleSell(item, all=false) {
        let slot = this.player.inventory.getSlot(item);
        this.player.inventory.removeItem(item, true);
        let cost = item.cost;
        if (!all && item.count > 1) {
            // split item from inventory
            let x_leftover = item.as_kv();
            x_leftover.count -= 1;
            delete x_leftover.gid;
            x_leftover.xform = new XForm({stretch: false});
            let leftover = Generator.generate(x_leftover);
            let h = leftover.xform.height;
            leftover.xform.offx = -leftover.xform.width*.5;
            if (h > Config.tileSize) {
                leftover.xform.offy = Config.tileSize*.5 - leftover.xform.height;
            } else {
                leftover.xform.offy = -leftover.xform.height*.5;
            }
            this.player.inventory.add(leftover, slot);
        }
        this.vendor.inventory.add(item);
        this.player.inventory.tokens += cost;
        this.updateSlots();
    }

    handleBuy(item) {
        console.log(`handleBuy`);
        let cost = Math.round(item.cost * 2.5);
        if (this.player.inventory.tokens < cost) {
            Events.trigger(OverlaySystem.evtNotify, { actor: this.player, which: 'warn', msg: `insufficient funds` });
            if (this.failedSfx) this.failedSfx.play();
            return;
        }
        let slot = this.vendor.inventory.getSlot(item);
        this.vendor.inventory.removeItem(item, true);
        if (item.count > 1) {
            // split item from inventory
            let x_leftover = item.as_kv();
            x_leftover.count -= 1;
            delete x_leftover.gid;
            x_leftover.xform = new XForm({stretch: false});
            let leftover = Generator.generate(x_leftover);
            let h = leftover.xform.height;
            leftover.xform.offx = -leftover.xform.width*.5;
            if (h > Config.tileSize) {
                leftover.xform.offy = Config.tileSize*.5 - leftover.xform.height;
            } else {
                leftover.xform.offy = -leftover.xform.height*.5;
            }
            this.vendor.inventory.add(leftover, slot);
        }
        let ok = this.player.inventory.add(item);
        if (ok) {
            this.player.inventory.tokens -= cost;
        } else {
            Events.trigger(OverlaySystem.evtNotify, { actor: this.player, which: 'warn', msg: `insufficient space` });
            this.vendor.inventory.add(item);
        }
        this.updateSlots();
    }

}

class VendorPopup extends UxView {

    cpost(spec) {
        super.cpost(spec);
        this.handleSell = spec.handleSell;
        this.handleBuy = spec.handleBuy;
        this.mode = spec.mode || 'buy';
        let title = spec.title || 'info';
        this.item;
        this.target;

        this.panel = new UxPanel({
            sketch: Assets.get('oframe.red', true),
            children: [
                // title
                new UxText({
                    tag: 'title',
                    xform: new XForm({offset: 5, bottom: .9}),
                    text: new Text({ text: title, color: textColor}),
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
                            text: new Text({ text: 'name', color: textColor, align: 'left'}),
                        }),

                        new UxText({
                            tag: 'item.kind',
                            xform: new XForm({left: .3, offset: 5, top: .5, bottom: .1}),
                            text: new Text({ text: 'kind', color: textColor, align: 'left'}),
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
                            text: new Text({wrap: true, text: 'description', color: textColor, valign: 'top', align: 'left'}),
                        }),
                    ]
                }),

                // buttons
                new UxPanel({
                    xform: new XForm({top: .7, bottom: .1}),
                    sketch: Sketch.zero,
                    children: [
                        new UxButton({
                            tag: 'item.buy',
                            xform: new XForm({offset: 10, right:.67}),
                            text: new Text({text: '   buy   '}),
                        }),
                        new UxButton({
                            tag: 'item.sell',
                            xform: new XForm({offset: 10, right:.67}),
                            text: new Text({text: ' sell '}),
                        }),
                        new UxButton({
                            tag: 'item.sellall',
                            xform: new XForm({offset: 10, left:.33, right:.33}),
                            text: new Text({text: ' sell all '}),
                        }),
                        new UxButton({
                            tag: 'item.cancel',
                            xform: new XForm({offset: 10, left:.67}),
                            text: new Text({text: ' cancel '}),
                        }),
                    ]
                }),
                new UxPanel({
                    xform: new XForm({top: .85}),
                    sketch: Sketch.zero,
                    children: [
                        counter({ tag: 'tokens', xform: new XForm({left: 0, right: .66, bottom: .25}), sketch: Assets.get('token.carry', true, {lockRatio: true})}),
                        counter({ tag: 'tokens.all', xform: new XForm({left: .33, right: .33, bottom: .25}), sketch: Assets.get('token.carry', true, {lockRatio: true})}),
                    ],
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
        this.buyButton = Hierarchy.find(this, (v) => v.tag === 'item.buy');
        this.sellButton = Hierarchy.find(this, (v) => v.tag === 'item.sell');
        this.sellallButton = Hierarchy.find(this, (v) => v.tag === 'item.sellall');
        this.cancelButton = Hierarchy.find(this, (v) => v.tag === 'item.cancel');
        this.tokens = Hierarchy.find(this, (v) => v.tag === 'tokens');
        this.tokensall = Hierarchy.find(this, (v) => v.tag === 'tokens.all');
        // set button state
        // -- want target state... hide use/drop/throw
        if (this.mode === 'buy') {
            this.sellButton.active = this.sellButton.visible = false;
            this.sellallButton.active = this.sellallButton.visible = false;
            this.tokensall.active = this.tokensall.visible = false;
        } else {
            this.buyButton.active = this.buyButton.visible = false;
            if (!this.item || !this.item || this.item.count < 2) {
                this.sellallButton.active = this.sellallButton.visible = false;
                this.tokensall.active = this.tokensall.visible = false;
            }
        }

        // event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onSellClicked = this.onSellClicked.bind(this);
        this.onSellAllClicked = this.onSellAllClicked.bind(this);
        this.onBuyClicked = this.onBuyClicked.bind(this);
        this.onCancelClicked = this.onCancelClicked.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        this.sellButton.evt.listen(this.sellButton.constructor.evtMouseClicked, this.onSellClicked);
        this.sellallButton.evt.listen(this.sellallButton.constructor.evtMouseClicked, this.onSellAllClicked);
        this.buyButton.evt.listen(this.buyButton.constructor.evtMouseClicked, this.onBuyClicked);
        this.cancelButton.evt.listen(this.cancelButton.constructor.evtMouseClicked, this.onCancelClicked);

        this.item = spec.item;
        if (spec.item) this.setItem(spec.item);

    }

    destroy() {
        super.destroy();
        Events.ignore(Keys.evtDown, this.onKeyDown);
    }

    onKeyDown(evt) {
        if (!this.active) return;
        switch (evt.key) {
            case 'Escape': {
                this.destroy();
                break;
            }
        }
    }

    onSellClicked(evt) {
        // destroy window
        this.destroy();
        // call function to handle use
        this.handleSell(this.item);
    }

    onSellAllClicked(evt) {
        // destroy window
        this.destroy();
        // call function to handle use
        this.handleSell(this.item, true);
    }

    onBuyClicked(evt) {
        this.destroy();
        this.handleBuy(this.item);
    }

    onCancelClicked(evt) {
        this.destroy();
    }

    setItem(item) {
        // picture
        this.picture.sketch = Assets.get(item.sketch.tag, true, { lockRatio: true, state: 'carry'}) || Sketch.zero;
        this.name.text = item.name;
        this.kind.text = `-- ${item.constructor.slot} --`;
        this.description.text = item.description;
        this.item = item;
        // token counts/costs
        let count = item.count || 1;
        let ctext = Hierarchy.find(this, (v) => v.tag === 'tokens.ctext');
        let cost = (this.mode === 'buy') ? Math.round(item.cost * 2.5) : item.cost;
        console.log(`cost: ${cost}`);
        ctext.text = `${cost}`;
        ctext = Hierarchy.find(this, (v) => v.tag === 'tokens.all');
        ctext.text = `${cost*count}`;

    }

}