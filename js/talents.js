export { Talents }

import { Assets } from './base/assets.js';
import { Fmt } from './base/fmt.js';
import { Sketch } from './base/sketch.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxPanel } from './base/uxPanel.js';
import { UxText } from './base/uxText.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';

class Talents extends UxView {
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
    static dfltTextColor = 'yellow';
    static dfltHighlightTextColor = 'green';

    cpost(spec) {
        super.cpost(spec);
        this.onSlotClick = this.onSlotClick.bind(this);
        this.onPopupDestroy = this.onPopupDestroy.bind(this);
        this.bg = new UxPanel({
            sketch: Assets.get('oframe.red', true),
            xform: new XForm({offset: 10, right:.3}),
            children: [
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({ top: 0, bottom: .85}),
                    children: [
                        new UxText({
                            text: new Text({text: 'talents', color: this.constructor.dfltTextColor}),
                            xform: new XForm({top: .25, bottom: .1}),
                        }),
                        new UxText({
                            text: new Text({text: '+1', color: this.constructor.dfltHighlightTextColor}),
                            xform: new XForm({left: .8, top: .35, bottom: .2}),
                        }),
                    ]
                }),
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({ top: .15, bottom: 0}),
                    children: [
                        new UxPanel({
                            sketch: Assets.get('oframe.red', true),
                            xform: new XForm({ oleft: 20, oright: 20, obottom: 20, top: 0, bottom: .66}),

                            children: [
                                new UxPanel({
                                    sketch: Sketch.zero,
                                    xform: new XForm({ bottom: .7}),
                                    children: [
                                        new UxText({
                                            text: new Text({text: 'tier 1', color: this.constructor.dfltTextColor}),
                                            xform: new XForm({top: .15, bottom: .1}),
                                        }),
                                        new UxText({
                                            text: new Text({text: '0/7', color: this.constructor.dfltTextColor}),
                                            xform: new XForm({left: .85, top: .2, bottom: .2}),
                                        }),
                                    ],
                                }),
                                new UxPanel({
                                    sketch: Sketch.zero,
                                    xform: new XForm({ top: .3, bottom: .1}),
                                    children: [
                                        this.slot({ xform: new XForm({offset: 8, left: 0, right: .75}), }, 'golddigger'),
                                        this.slot({ xform: new XForm({offset: 8, left: .25, right: .5}), }, 'efficiency'),
                                        this.slot({ xform: new XForm({offset: 8, left: .5, right: .25}), }, 'shielding'),
                                        this.slot({ xform: new XForm({offset: 8, left: .75, right: 0}), }, 'gems'),
                                    ],
                                }),
                            ],
                        }),

                        new UxPanel({
                            sketch: Assets.get('oframe.red', true),
                            xform: new XForm({ oleft: 20, oright: 20, obottom: 20, top: .33, bottom: .33}),

                            children: [
                                new UxPanel({
                                    sketch: Sketch.zero,
                                    xform: new XForm({ bottom: .7}),
                                    children: [
                                        new UxText({
                                            text: new Text({text: 'tier 2', color: this.constructor.dfltTextColor}),
                                            xform: new XForm({top: .15, bottom: .1}),
                                        }),
                                        new UxText({
                                            text: new Text({text: '0/7', color: this.constructor.dfltTextColor}),
                                            xform: new XForm({left: .85, top: .2, bottom: .2}),
                                        }),
                                    ],
                                }),
                                new UxPanel({
                                    sketch: Sketch.zero,
                                    xform: new XForm({ top: .3, bottom: .1}),
                                    children: [
                                        this.slot({ xform: new XForm({offset: 8, left: 0, right: .75}), }, 'bonkers'),
                                        this.slot({ xform: new XForm({offset: 8, left: .25, right: .5}), }, 'pointy'),
                                        this.slot({ xform: new XForm({offset: 8, left: .5, right: .25}), }, 'hackety'),
                                        this.slot({ xform: new XForm({offset: 8, left: .75, right: 0}), }, 'powerage'),
                                    ],
                                }),
                            ],

                        }),
                        new UxPanel({
                            sketch: Assets.get('oframe.red', true),
                            xform: new XForm({ oleft: 20, oright: 20, obottom: 20, top: .66, bottom: 0}),

                            children: [
                                new UxPanel({
                                    sketch: Sketch.zero,
                                    xform: new XForm({ bottom: .7}),
                                    children: [
                                        new UxText({
                                            text: new Text({text: 'tier 3', color: this.constructor.dfltTextColor}),
                                            xform: new XForm({top: .15, bottom: .1}),
                                        }),
                                        new UxText({
                                            text: new Text({text: '0/7', color: this.constructor.dfltTextColor}),
                                            xform: new XForm({left: .85, top: .2, bottom: .2}),
                                        }),
                                    ],
                                }),
                                new UxPanel({
                                    sketch: Sketch.zero,
                                    xform: new XForm({ top: .3, bottom: .1}),
                                    children: [
                                        this.slot({ xform: new XForm({offset: 8, left: 0, right: .75}), }, 'frosty'),
                                        this.slot({ xform: new XForm({offset: 8, left: .25, right: .5}), }, 'fuego'),
                                        this.slot({ xform: new XForm({offset: 8, left: .5, right: .25}), }, 'shocking'),
                                        this.slot({ xform: new XForm({offset: 8, left: .75, right: 0}), }, 'darkness'),
                                    ],
                                }),
                            ],

                        }),
                    ]
                }),
            ],
        });
        this.adopt(this.bg);
    }

    /*
    onSlotClick(evt) {
        console.log(`${this} clicked ${Fmt.ofmt(evt)}`);
    }
    */

    onSlotClick(evt) {
        console.log(`onSlotClick: ${Fmt.ofmt(evt)} selected: ${this.popup}`);
        if (this.popup) this.popup.destroy();

        this.popup = new TalentPopup({});
        this.popup = new TalentPopup({
            xform: new XForm({ left: .7, top: .2, bottom: .2}),
            //item: item,
            //handleUse: this.handleUse.bind(this),
        });
        this.popup.evt.listen(this.popup.constructor.evtDestroyed, this.onPopupDestroy);
        this.adopt(this.popup);
        //this.markCompatibleSlots(item);
        //this.select(evt.actor);
    }

    onPopupDestroy(evt) {
        console.log(`onPopupDestroy: ${Fmt.ofmt(evt)} selected: ${this.popup}`);
    }

    slot(spec, slot=null, sketch=null) {
        let slotTag = slot || 'slot';
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
                            tag: `${slotTag}.icon`,
                            xform: new XForm({ border: .1 }),
                            sketch: sketch,
                        }),
                        this.button({ tag: slotTag }, this.onSlotClick),
                        new UxPanel({
                            tag: `${slotTag}.overlay`,
                            sketch: Sketch.zero,
                        }),
                        new UxPanel({
                            tag: `${slotTag}.1`,
                            xform: new XForm({ left: .85, bottom: .66, width: 10, height: 10, lockRatio: true}),
                        }),
                        new UxPanel({
                            tag: `${slotTag}.2`,
                            xform: new XForm({ left: .85, top: .33, bottom: .33, width: 10, height: 10, lockRatio: true}),
                        }),
                        new UxPanel({
                            tag: `${slotTag}.3`,
                            xform: new XForm({ left: .85, top: .66, width: 10, height: 10, lockRatio: true}),
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


}

class TalentPopup extends UxView {
    static dfltTextColor = 'yellow';

    cpost(spec) {
        super.cpost(spec);
        //this.handleUse = spec.handleUse;
        let talent = spec.talent || {
            tag: 'talent',
            name: 'some talent',
            tier: 1,
            description: 'a really cool talent that does really cool things',
        };
        //this.wantTarget = spec.wantTarget;
        //this.item;
        //this.target;

        this.bg = new UxPanel({
            sketch: Assets.get('oframe.red', true),
            children: [
                // title
                new UxText({
                    tag: 'title',
                    xform: new XForm({offset: 5, bottom: .9}),
                    text: new Text({ text: 'talent info', color: this.constructor.dfltTextColor}),
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
                            text: new Text({ text: talent.name, color: this.constructor.dfltTextColor, align: 'left'}),
                        }),

                        new UxText({
                            tag: 'item.tier',
                            xform: new XForm({left: .3, offset: 5, top: .5, bottom: .1}),
                            text: new Text({ text: `tier ${talent.tier}`, color: this.constructor.dfltTextColor, align: 'left'}),
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
                            text: new Text({wrap: true, text: talent.description, color: this.constructor.dfltTextColor, valign: 'top', align: 'left'}),
                        }),
                    ]
                }),

            ],
        });
        this.adopt(this.bg);

    }

}