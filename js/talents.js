export { Talents }

import { Assets } from './base/assets.js';
import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Hierarchy } from './base/hierarchy.js';
import { Sketch } from './base/sketch.js';
import { Systems } from './base/system.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxPanel } from './base/uxPanel.js';
import { UxText } from './base/uxText.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';
import { Prompt } from './prompt.js';
import { TalentSystem } from './systems/talentSystem.js';

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
        this.tsys = spec.tsys || Systems.get('talent');
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
                            tag: 'talent.unspent',
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
                                            tag: 't1.count',
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
                                            tag: 't2.count',
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
                                            tag: 't3.count',
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

        // update UI elements for current talent state
        for (const talent of Object.keys(TalentSystem.talents)) {
            this.updateTalent(talent);
        }
        this.updateCounts();
        this.updateUnspent();

    }

    updateUnspent(tag) {
        let points = this.tsys.unspent;
        let unspent = Hierarchy.find(this.bg, (v) => v.tag === 'talent.unspent');
        if (unspent) {
            unspent.text = (points) ? `+${points}` : '';
        }
    }

    updateTalent(tag) {
        // get current talent level
        let lvl = this.tsys.current[tag] || 0;
        // update talent "stars"
        for (let i=1; i<4; i++) {
            let star = Hierarchy.find(this.bg, (v) => v.tag === `${tag}.${i}`);
            if (star) star.sketch = (lvl > (i-1)) ? Assets.get('talent.active', true) : Assets.get('talent.inactive', true);
        }
    }

    getTierCount(tier) {
        let count = 0;
        for (const talent of Object.keys(TalentSystem.talents)) {
            if (TalentSystem.talents[talent].tier !== tier) continue;
            let lvl = this.tsys.current[talent] || 0;
            count += lvl;
        }
        return count;
    }

    updateCounts() {
        for (let tier=1; tier<4; tier++) {
            // count tier talents
            let count = this.getTierCount(tier);
            let cntText = Hierarchy.find(this.bg, (v) => v.tag === `t${tier}.count`);
            if (cntText) {
                cntText.text = `${count}/7`;
            }
        }
    }

    onSlotClick(evt) {
        console.log(`onSlotClick: ${Fmt.ofmt(evt)} selected: ${this.popup}`);
        if (this.popup) this.popup.destroy();

        let talent = TalentSystem.talents[evt.actor.tag];
        let lvl = this.tsys.current[evt.actor.tag];
        let locked = false;
        if (talent.tier > 1) {
            let count = this.getTierCount(talent.tier-1);
            locked = (count < 7);
        }

        this.popup = new TalentPopup({
            unspent: this.tsys.unspent,
            talent: talent,
            lvl: lvl,
            locked: locked,
            tierCount: this.getTierCount(talent.tier),
            xform: new XForm({ left: .7, top: .2, bottom: .2}),
            handleLvlUp: this.handleLvlUp.bind(this),
        });
        this.popup.evt.listen(this.popup.constructor.evtDestroyed, this.onPopupDestroy);
        this.adopt(this.popup);
        //this.markCompatibleSlots(item);
        //this.select(evt.actor);
    }

    onPopupDestroy(evt) {
        console.log(`onPopupDestroy: ${Fmt.ofmt(evt)} selected: ${this.popup}`);
    }

    handleLvlUp(talent) {
        this.tsys.levelUp(talent);
        // update UI elements for current talent state
        for (const talent of Object.keys(TalentSystem.talents)) {
            this.updateTalent(talent);
        }
        this.updateCounts();
        this.updateUnspent();
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
    static dfltWarnTextColor = 'orange';

    cpost(spec) {
        super.cpost(spec);
        this.talent = spec.talent || {
            tag: 'talent',
            name: 'some talent',
            tier: 1,
            description: 'a really cool talent that does really cool things',
        };
        this.lvl = spec.lvl || 0;
        this.locked = spec.hasOwnProperty(`locked`) ? spec.locked : false;
        this.tierCount = spec.tierCount || 0;
        this.handleLvlUp = spec.handleLvlUp || ((talent) => {});
        this.unspent = spec.unspent || 0;

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
                                    tag: 'talent.picture',
                                    xform: new XForm({border: .1}),
                                    sketch: Sketch.zero,
                                }),
                            ],
                        }),

                        new UxText({
                            tag: 'talent.name',
                            xform: new XForm({left: .3, offset: 5, top: .1, bottom: .4}),
                            text: new Text({ text: this.talent.name, color: this.constructor.dfltTextColor, align: 'left'}),
                        }),

                        new UxText({
                            tag: 'talent.tier',
                            xform: new XForm({left: .3, offset: 5, top: .5, bottom: .1}),
                            text: new Text({ text: `tier ${this.talent.tier}`, color: this.constructor.dfltTextColor, align: 'left'}),
                        }),
                    ]
                }),

                // stars
                new UxPanel({
                    xform: new XForm({top: .3, bottom: .6}),
                    sketch: Sketch.zero,
                    children: [
                        new UxPanel({
                            sketch: (this.lvl >= 1) ? Assets.get('talent.active', true) : Assets.get('talent.inactive', true),
                            xform: new XForm({left: .2, right: .7, width: 10, height: 10, lockRatio: true}),
                        }),
                        new UxPanel({
                            sketch: (this.lvl >= 2) ? Assets.get('talent.active', true) : Assets.get('talent.inactive', true),
                            xform: new XForm({left: .45, right: .45, width: 10, height: 10, lockRatio: true}),
                        }),
                        new UxPanel({
                            sketch: (this.lvl >= 3) ? Assets.get('talent.active', true) : Assets.get('talent.inactive', true),
                            xform: new XForm({left: .7, right: .2, width: 10, height: 10, lockRatio: true}),
                        }),
                    ],
                }),

                // description
                new UxPanel({
                    xform: new XForm({top: .425, bottom: .225}),
                    sketch: Sketch.zero,
                    children: [
                        new UxText({
                            tag: 'talent.description',
                            xform: new XForm({offset: 15}),
                            text: new Text({wrap: true, text: this.talent.description, color: this.constructor.dfltTextColor, valign: 'top', align: 'left'}),
                        }),
                        new UxText({
                            tag: 'talent.locked',
                            xform: new XForm({offset: 15}),
                            text: new Text({wrap: true, text: '-- tier is locked, spend points in lower tier first --', color: this.constructor.dfltWarnTextColor, valign: 'bottom'}),
                        }),
                    ]
                }),

                // buttons
                new UxPanel({
                    xform: new XForm({top: .8}),
                    sketch: Sketch.zero,
                    children: [
                        new UxButton({
                            tag: 'talent.lvlup',
                            xform: new XForm({offset: 10, right:.67}),
                            text: new Text({text: '  level up  '}),
                        }),
                        new UxButton({
                            tag: 'talent.cancel',
                            xform: new XForm({offset: 10, left:.67}),
                            text: new Text({text: ' cancel '}),
                        }),
                    ]
                }),

            ],
        });
        this.adopt(this.bg);

        // ui elements
        this.lvlupButton = Hierarchy.find(this.bg, (v) => v.tag === 'talent.lvlup');
        this.cancelButton = Hierarchy.find(this.bg, (v) => v.tag === 'talent.cancel');
        this.lockedText = Hierarchy.find(this.bg, (v) => v.tag === 'talent.locked');
        if (this.locked || this.lvl >= 3 || this.tierCount >= 7 || this.unspent <= 0) {
            this.lvlupButton.active = false;
            this.lvlupButton.visible = false;
        }
        if (!this.locked) {
            this.lockedText.visible = false;
        }
        if (this.tierCount >= 7) {
            this.lockedText.visible = true;
            this.lockedText.text = '-- max tier points allocated --';
        }

        // event handling
        this.onLevelUpClick = this.onLevelUpClick.bind(this);
        this.lvlupButton.evt.listen(this.lvlupButton.constructor.evtMouseClicked, this.onLevelUpClick);
        this.cancelButton.evt.listen(this.cancelButton.constructor.evtMouseClicked, () => this.destroy(), Events.once);

    }
    destroy() {
        super.destroy();
        this.lvlupButton.evt.ignore(this.lvlupButton.constructor.evtMouseClicked, this.onLevelUpClick);
    }

    onLevelUpClick(evt) {
        let prompt = new Prompt({
            xform: new XForm({ border: .3 }),
            title: 'confirm',
            prompt: `spend talent point to level up*${this.talent.name}*? talent points cannot be reset!`,
            handleConfirm: () => {
                this.handleLvlUp(this.talent);
                this.parent.active = true;
                this.destroy();
            },
            handleCancel: () => {
                this.parent.active = true;
            },
        });
        Hierarchy.root(this).adopt(prompt);
        this.parent.active = false;
        //this.parent.adopt(prompt);
    }

}