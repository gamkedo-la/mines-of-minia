export { Talents }

import { Assets } from './base/assets.js';
import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
import { Sketch } from './base/sketch.js';
import { Systems } from './base/system.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxPanel } from './base/uxPanel.js';
import { UxText } from './base/uxText.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';
import { Prompt } from './prompt.js';
import { Resurrect64 } from './resurrect64.js';
import { TalentSystem } from './systems/talentSystem.js';

class Talents extends UxView {
    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltUnpressed() {
        return Assets.get('talent.button', true);
    }
    static get dfltPressed() {
        return Assets.get('talent.button.pressed', true);
    }
    static get dfltHighlight() {
        return Assets.get('talent.button.hl', true);
    }
    static dfltTextColor = Resurrect64.colors[28];
    static dfltHighlightTextColor = Resurrect64.colors[32];

    // CONSTRUCTOR/DECONSTRUCTOR -------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.tsys = spec.tsys || Systems.get('talent');
        this.onSlotClick = this.onSlotClick.bind(this);
        this.onPopupDestroy = this.onPopupDestroy.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.bg = new UxPanel({
            sketch: Assets.get('talents.bg', true),
            xform: new XForm({right: 12/26}),
            children: [
                new UxText({
                    text: new Text({text: 'talents', color: this.constructor.dfltTextColor}),
                    xform: new XForm({left: 5/14, right: 3/14, top: 2/17, bottom: 14/17}),
                }),

                new UxText({
                    tag: 'talent.unspent',
                    text: new Text({text: '+1', color: this.constructor.dfltHighlightTextColor}),
                    xform: new XForm({left: 11/14, right: 2/14, top: 2/17, bottom: 14/17}),
                }),

                new UxText({
                    text: new Text({text: 'tier 1', color: this.constructor.dfltTextColor}),
                    xform: new XForm({left: 5/14, right: 3/14, top: 4.5/17, bottom: 11.5/17}),
                }),

                new UxText({
                    tag: 't1.count',
                    text: new Text({text: '0/7', color: this.constructor.dfltTextColor}),
                    xform: new XForm({left: 11/14, right: 2/14, top: 4.5/17, bottom: 11.5/17}),
                }),

                this.slot({ xform: new XForm({left: 4/14, right: 8/14, top: 5.5/17, bottom: 9.5/17}), }, 'golddigger'),
                this.slot({ xform: new XForm({left: 6/14, right: 6/14, top: 5.5/17, bottom: 9.5/17}), }, 'efficiency'),
                this.slot({ xform: new XForm({left: 8/14, right: 4/14, top: 5.5/17, bottom: 9.5/17}), }, 'shielding'),
                this.slot({ xform: new XForm({left: 10/14, right: 2/14, top: 5.5/17, bottom: 9.5/17}), }, 'gems'),

                new UxText({
                    text: new Text({text: 'tier 2', color: this.constructor.dfltTextColor}),
                    xform: new XForm({left: 5/14, right: 3/14, top: 8.5/17, bottom: 7.5/17}),
                }),

                new UxText({
                    tag: 't2.count',
                    text: new Text({text: '0/7', color: this.constructor.dfltTextColor}),
                    xform: new XForm({left: 11/14, right: 2/14, top: 8.5/17, bottom: 7.5/17}),
                }),

                this.slot({ xform: new XForm({left: 4/14, right: 8/14, top: 9.5/17, bottom: 5.5/17}), }, 'bonkers'),
                this.slot({ xform: new XForm({left: 6/14, right: 6/14, top: 9.5/17, bottom: 5.5/17}), }, 'pointy'),
                this.slot({ xform: new XForm({left: 8/14, right: 4/14, top: 9.5/17, bottom: 5.5/17}), }, 'hackety'),
                this.slot({ xform: new XForm({left: 10/14, right: 2/14, top: 9.5/17, bottom: 5.5/17}), }, 'powerage'),

                new UxText({
                    text: new Text({text: 'tier 3', color: this.constructor.dfltTextColor}),
                    xform: new XForm({left: 5/14, right: 3/14, top: 12.5/17, bottom: 3.5/17}),
                }),

                new UxText({
                    tag: 't3.count',
                    text: new Text({text: '0/7', color: this.constructor.dfltTextColor}),
                    xform: new XForm({left: 11/14, right: 2/14, top: 12.5/17, bottom: 3.5/17}),
                }),

                this.slot({ xform: new XForm({left: 4/14, right: 8/14, top: 13.5/17, bottom: 1.5/17}), }, 'frosty'),
                this.slot({ xform: new XForm({left: 6/14, right: 6/14, top: 13.5/17, bottom: 1.5/17}), }, 'fuego'),
                this.slot({ xform: new XForm({left: 8/14, right: 4/14, top: 13.5/17, bottom: 1.5/17}), }, 'shocking'),
                this.slot({ xform: new XForm({left: 10/14, right: 2/14, top: 13.5/17, bottom: 1.5/17}), }, 'darkness'),

                new UxButton({
                    tag: 'cancel.button',
                    unpressed: Assets.get('hud.cancel.unpressed', true),
                    pressed: Assets.get('hud.cancel.pressed', true),
                    highlight: Assets.get('hud.cancel.highlight', true),
                    xform: new XForm({left: 1/14, right: 11/14, top: 14/17, bottom: 1/17}),
                    text: Text.zero,
                    mouseClickedSound: Assets.get('menu.click', true),
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
        Events.listen(Keys.evtDown, this.onKeyDown);
        let button = Hierarchy.find(this, (v) => v.tag === 'cancel.button');
        if (button) {
            button.evt.listen(button.constructor.evtMouseClicked, () => this.destroy());
        }
    }

    destroy() {
        super.destroy();
        Events.ignore(Keys.evtDown, this.onKeyDown);
    }

    onSlotClick(evt) {
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
            xform: new XForm({ left: 14/26, top: 2/17, bottom: 3/17}),
            handleLvlUp: this.handleLvlUp.bind(this),
        });
        this.popup.evt.listen(this.popup.constructor.evtDestroyed, this.onPopupDestroy);
        this.adopt(this.popup);
    }

    onPopupDestroy(evt) {
        this.popup = null;
    }

    onKeyDown(evt) {
        if (!this.active) return;
        switch (evt.key) {
        case 't':
        case 'Escape':
            this.destroy();
            break;
        }
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

    handleLvlUp(talent) {
        this.tsys.levelUp(talent);
        // update UI elements for current talent state
        for (const talent of Object.keys(TalentSystem.talents)) {
            this.updateTalent(talent);
        }
        this.updateCounts();
        this.updateUnspent();
    }

    slot(spec, tag) {
        let sketch = Assets.get(`talent.${tag}`, true);
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
                            tag: `${tag}.icon`,
                            //xform: new XForm({ offset: 3}),
                            sketch: sketch,
                        }),
                        this.button({ tag: tag }, this.onSlotClick),
                        new UxPanel({
                            tag: `${tag}.overlay`,
                            sketch: Sketch.zero,
                        }),
                        new UxPanel({
                            tag: `${tag}.1`,
                            xform: new XForm({ left: 25/32, right: 3/32, top: 7/32, bottom: 21/32 }),
                        }),
                        new UxPanel({
                            tag: `${tag}.2`,
                            xform: new XForm({ left: 25/32, right: 3/32, top: 14/32, bottom: 14/32 }),
                        }),
                        new UxPanel({
                            tag: `${tag}.3`,
                            xform: new XForm({ left: 25/32, right: 3/32, top: 21/32, bottom: 7/32 }),
                        }),
                    ],
                }),
            ],
        }, spec, {tag: `${tag}.bg`}));
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
            sketch: Assets.get('talents.popup.bg', true),
            children: [
                new UxPanel({
                    xform: new XForm({left: 2/12, right: 8/12, top: 2/12, bottom: 8/12}),
                    sketch: Sketch.zero,
                    children: [
                        new UxPanel({
                            tag: 'talent.picture',
                            sketch: Assets.get(`talent.${this.talent.tag}`, true),
                        }),
                        new UxPanel({
                            sketch: Assets.get(`talent.frame`, true),
                        }),
                    ],
                }),

                new UxText({
                    tag: 'talent.name',
                    xform: new XForm({left: 4.5/12, right: 3.75/12, top: 1.5/12, bottom: 8.5/12}),
                    text: new Text({ text: this.talent.name, color: this.constructor.dfltTextColor, align: 'center'}),
                }),

                new UxText({
                    tag: 'talent.tier',
                    xform: new XForm({left: 5/12, right: 4/12, top: 3.25/12, bottom: 8/12}),
                    text: new Text({ text: `tier ${this.talent.tier}`, color: this.constructor.dfltTextColor, align: 'center'}),
                }),

                new UxPanel({
                    sketch: (this.lvl >= 1) ? Assets.get('talent.active.lg', true) : Assets.get('talent.inactive.lg', true),
                    xform: new XForm({left: 5/12, right: 6/12, top: 5/12, bottom: 6/12}),
                }),
                new UxPanel({
                    sketch: (this.lvl >= 2) ? Assets.get('talent.active.lg', true) : Assets.get('talent.inactive.lg', true),
                    xform: new XForm({left: 6/12, right: 5/12, top: 5/12, bottom: 6/12}),
                }),
                new UxPanel({
                    sketch: (this.lvl >= 3) ? Assets.get('talent.active.lg', true) : Assets.get('talent.inactive.lg', true),
                    xform: new XForm({left: 7/12, right: 4/12, top: 5/12, bottom: 6/12}),
                }),

                new UxText({
                    tag: 'talent.description',
                    xform: new XForm({left: 2/12, right: 4/12, top: 7/12, bottom: 3/12}),
                    text: new Text({wrap: true, text: this.talent.description, color: this.constructor.dfltTextColor, valign: 'top', align: 'left'}),
                }),

                new UxText({
                    tag: 'talent.locked',
                    xform: new XForm({left: 2/12, right: 4/12, top: 9/12, bottom: 2/12}),
                    text: new Text({wrap: true, text: '-- tier is locked, spend points in lower tier first --', color: this.constructor.dfltWarnTextColor, valign: 'bottom'}),
                }),

                new UxButton({
                    tag: 'talent.lvlup',
                    unpressed: Assets.get('hud.plus.unpressed', true),
                    pressed: Assets.get('hud.plus.pressed', true),
                    highlight: Assets.get('hud.plus.highlight', true),
                    xform: new XForm({left: 9/12, right: 1/12, top: 7/12, bottom: 3/12}),
                    text: Text.zero,
                    mouseClickedSound: Assets.get('menu.click', true),
                }),

                new UxButton({
                    tag: 'talent.cancel',
                    unpressed: Assets.get('hud.cancel.unpressed', true),
                    pressed: Assets.get('hud.cancel.pressed', true),
                    highlight: Assets.get('hud.cancel.highlight', true),
                    xform: new XForm({left: 9/12, right: 1/12, top: 9/12, bottom: 1/12}),
                    text: Text.zero,
                    mouseClickedSound: Assets.get('menu.click', true),
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