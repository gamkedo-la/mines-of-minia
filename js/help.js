export { Help };

import { Assets } from './base/assets.js';
import { Events } from './base/event.js';
import { Font } from './base/font.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
import { Sketch } from './base/sketch.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxPanel } from './base/uxPanel.js';
import { UxText } from './base/uxText.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';
import { Resurrect64 } from './resurrect64.js';

let titleColor = Resurrect64.colors[7];
let textColor = Resurrect64.colors[11];
let text2Color = Resurrect64.colors[17];
let buttonTextColor = Resurrect64.colors[1];
let buttonTextHLColor = Resurrect64.colors[18];

function button(text, spec) {
    return new UxButton(Object.assign({}, {
        textXform: new XForm({offset: 25}),
        highlight: Sketch.zero,
        unpressed: Sketch.zero,
        pressed: Sketch.zero,
        text: new Text({text: text, color: buttonTextColor}),
        hltext: new Text({text: text, color: buttonTextHLColor}),
    }, spec));
}

class Help extends UxView {

    cpost(spec) {
        super.cpost(spec);
        // -- bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        // -- start help sub panel
        this.doKeys();
    }

    doKeys() {
        if (this.panel) this.panel.destroy();
        this.panel = new UxPanel({
            sketch: Assets.get('help.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'controls', color: titleColor}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({ top: .2, bottom: .2, left: .1, right: .1 }),
                    children: [
                        new UxText({
                            text: new Text({text: 'qweasdzxc', color: textColor, align: 'left'}),
                            xform: new XForm({ top: 0/7, bottom: 1-1/7, right: .6}),
                        }),
                        new UxText({
                            text: new Text({text: 'movement', color: text2Color, align: 'right'}),
                            xform: new XForm({ top: 0/7, bottom: 1-1/7, left: .5}),
                        }),

                        new UxText({
                            text: new Text({text: '<space>', color: textColor, align: 'left'}),
                            xform: new XForm({ top: 1/7, bottom: 1-2/7, right: .6}),
                        }),
                        new UxText({
                            text: new Text({text: 'wait/end turn', color: text2Color, align: 'right'}),
                            xform: new XForm({ top: 1/7, bottom: 1-2/7, left: .5}),
                        }),

                        new UxText({
                            text: new Text({text: '<escape>', color: textColor, align: 'left'}),
                            xform: new XForm({ top: 2/7, bottom: 1-3/7, right: .6}),
                        }),
                        new UxText({
                            text: new Text({text: 'cancel/options', color: text2Color, align: 'right'}),
                            xform: new XForm({ top: 2/7, bottom: 1-3/7, left: .5}),
                        }),

                        new UxText({
                            text: new Text({text: 'i', color: textColor, align: 'left'}),
                            xform: new XForm({ top: 3/7, bottom: 1-4/7, right: .6}),
                        }),
                        new UxText({
                            text: new Text({text: 'inventory', color: text2Color, align: 'right'}),
                            xform: new XForm({ top: 3/7, bottom: 1-4/7, left: .5}),
                        }),

                        new UxText({
                            text: new Text({text: 't', color: textColor, align: 'left'}),
                            xform: new XForm({ top: 4/7, bottom: 1-5/7, right: .6}),
                        }),
                        new UxText({
                            text: new Text({text: 'talents', color: text2Color, align: 'right'}),
                            xform: new XForm({ top: 4/7, bottom: 1-5/7, left: .5}),
                        }),

                        new UxText({
                            text: new Text({text: '+/-', color: textColor, align: 'left'}),
                            xform: new XForm({ top: 5/7, bottom: 1-6/7, right: .6}),
                        }),
                        new UxText({
                            text: new Text({text: 'zoom in/out', color: text2Color, align: 'right'}),
                            xform: new XForm({ top: 5/7, bottom: 1-6/7, left: .5}),
                        }),

                        new UxText({
                            text: new Text({text: 'mouse click', color: textColor, align: 'left'}),
                            xform: new XForm({ top: 6/7, bottom: 1-7/7, right: .6}),
                        }),
                        new UxText({
                            text: new Text({text: 'movement/pathfinding', color: text2Color, align: 'right'}),
                            xform: new XForm({ top: 6/7, bottom: 1-7/7, left: .5}),
                        }),

                    ],
                }),
                //button('   prev   ', { tag: 'help.prev', xform: new XForm({right: .67, top: .8, bottom: .025 }) }),
                button('   back   ', { tag: 'help.back', xform: new XForm({left: .33, right: .33, top: .8, bottom: .025 }) }),
                button('   next   ', { tag: 'help.next', xform: new XForm({left: .67, top: .8, bottom: .025 }) }),
            ],
        });
        this.adopt(this.panel);
        let b = Hierarchy.find(this.panel, (v) => v.tag === 'help.back');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.destroy());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.next');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doObjectives());
    }

    doObjectives() {
        if (this.panel) this.panel.destroy();
        this.panel = new UxPanel({
            sketch: Assets.get('help.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'objectives', color: titleColor}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({ top: .2, bottom: .2, left: .1, right: .1 }),
                    children: [
                        new UxText({
                            text: new Text({text: 'explore, discover, and gear up to defeat the overbearer and secure your freedom.  ' +
                            'explore each level looking out for traps and secrets and locate the stairs to the next level.  ' +
                            'discover gems/cogs that can help (or hurt) you on your journey.  gear up and level up by defeating enemies along the way.', 
                            font: Font.dflt.copy({size: 24}), color: text2Color, wrap: true}),
                        }),
                    ],
                }),
                button('   prev   ', { tag: 'help.prev', xform: new XForm({right: .67, top: .8, bottom: .025 }) }),
                button('   back   ', { tag: 'help.back', xform: new XForm({left: .33, right: .33, top: .8, bottom: .025 }) }),
                button('   next   ', { tag: 'help.next', xform: new XForm({left: .67, top: .8, bottom: .025 }) }),
            ],
        });
        this.adopt(this.panel);
        let b = Hierarchy.find(this.panel, (v) => v.tag === 'help.back');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.destroy());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.prev');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doKeys());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.next');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doTips1());
    }

    doTips1() {
        if (this.panel) this.panel.destroy();
        this.panel = new UxPanel({
            sketch: Assets.get('help.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'tips', color: titleColor}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({ top: .2, bottom: .2, left: .1, right: .1 }),
                    children: [
                        new UxText({
                            text: new Text({text: 'interact with the world by moving into objects.  '+
                            'move towards enemies to attack, move towards doors and chests to open.  ' +
                            'beware of hidden traps and keep an eye out for hidden loot and rooms.  '+
                            'use the scan function to locate secrets within range.',
                            font: Font.dflt.copy({size: 24}), color: text2Color, wrap: true}),
                        }),
                    ],
                }),
                button('   prev   ', { tag: 'help.prev', xform: new XForm({right: .67, top: .8, bottom: .025 }) }),
                button('   back   ', { tag: 'help.back', xform: new XForm({left: .33, right: .33, top: .8, bottom: .025 }) }),
                button('   next   ', { tag: 'help.next', xform: new XForm({left: .67, top: .8, bottom: .025 }) }),
            ],
        });
        this.adopt(this.panel);
        let b = Hierarchy.find(this.panel, (v) => v.tag === 'help.back');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.destroy());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.prev');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doTips1());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.next');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doDiscovery());
    }

    doDiscovery() {
        if (this.panel) this.panel.destroy();
        this.panel = new UxPanel({
            sketch: Assets.get('help.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'discovery', color: titleColor}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({ top: .2, bottom: .2, left: .1, right: .1 }),
                    children: [
                        new UxText({
                            text: new Text({text: 'gear is randomly generated so each play through will be a new experience. '+
                            'some gear properties may be hidden until identified by the player. '+
                            'certain gear like cogs and gems are randomly assigned properties unique for each game. ' +
                            'the properties must be discovered by use.  gems can either be thrown or used.  '+
                            'thrown gems burst open at the target location which may reveal their nature.  '+
                            'used cogs and gems are consumed by the player for good or evil and will be revealed. ',
                            font: Font.dflt.copy({size: 24}), color: text2Color, wrap: true}),
                        }),
                    ],
                }),
                button('   prev   ', { tag: 'help.prev', xform: new XForm({right: .67, top: .8, bottom: .025 }) }),
                button('   back   ', { tag: 'help.back', xform: new XForm({left: .33, right: .33, top: .8, bottom: .025 }) }),
                button('   next   ', { tag: 'help.next', xform: new XForm({left: .67, top: .8, bottom: .025 }) }),
            ],
        });
        this.adopt(this.panel);
        let b = Hierarchy.find(this.panel, (v) => v.tag === 'help.back');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.destroy());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.prev');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doObjectives());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.next');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doGear());
    }

    doGear() {
        if (this.panel) this.panel.destroy();
        this.panel = new UxPanel({
            sketch: Assets.get('help.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'gear', color: titleColor}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({ top: .2, bottom: .2, left: .1, right: .1 }),
                    children: [
                        new UxText({
                            text: new Text({text: 'tiers: all gear has one of three tiers, the higher the tier, usually the better the gear. '+
                            'requirements: most gear has attribute requirements, if you don\'t meet the requirements, you will not be able to make full use of the gear. '+
                            'levels: most gear can be leveled up to increase stats and lower requirements. ',
                            font: Font.dflt.copy({size: 24}), color: text2Color, wrap: true}),
                        }),
                    ],
                }),
                button('   prev   ', { tag: 'help.prev', xform: new XForm({right: .67, top: .8, bottom: .025 }) }),
                button('   back   ', { tag: 'help.back', xform: new XForm({left: .33, right: .33, top: .8, bottom: .025 }) }),
                button('   next   ', { tag: 'help.next', xform: new XForm({left: .67, top: .8, bottom: .025 }) }),
            ],
        });
        this.adopt(this.panel);
        let b = Hierarchy.find(this.panel, (v) => v.tag === 'help.back');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.destroy());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.prev');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doDiscovery());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.next');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doCharms());
    }

    doCharms() {
        if (this.panel) this.panel.destroy();
        this.panel = new UxPanel({
            sketch: Assets.get('help.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'charms & curses', color: titleColor}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({ top: .2, bottom: .2, left: .1, right: .1 }),
                    children: [
                        new UxText({
                            text: new Text({text: 'most gear can have one or more charms or curses.  '+
                            'charms benefit you, curses not so much. '+
                            'once equipped, cursed gear cannot be removed until purged. '+
                            'use identify cogs to identify gear and any charms/curses, '+
                            'use level up cogs to level your gear up, '+
                            'and purge cogs to purge any curses from gear.',
                            font: Font.dflt.copy({size: 24}), color: text2Color, wrap: true}),
                        }),
                    ],
                }),
                button('   prev   ', { tag: 'help.prev', xform: new XForm({right: .67, top: .8, bottom: .025 }) }),
                button('   back   ', { tag: 'help.back', xform: new XForm({left: .33, right: .33, top: .8, bottom: .025 }) }),
                button('   next   ', { tag: 'help.next', xform: new XForm({left: .67, top: .8, bottom: .025 }) }),
            ],
        });
        this.adopt(this.panel);
        let b = Hierarchy.find(this.panel, (v) => v.tag === 'help.back');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.destroy());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.prev');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doGear());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.next');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doAttack());
    }

    doAttack() {
        if (this.panel) this.panel.destroy();
        this.panel = new UxPanel({
            sketch: Assets.get('help.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'attacking', color: titleColor}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({ top: .2, bottom: .2, left: .1, right: .1 }),
                    children: [
                        new UxText({
                            text: new Text({text: 
                            'melee attacks require a successful roll to hit.  many factors go into the roll. '+
                            'weapon profiency: every weapon has a base kind that is tied to a profiency score, '+
                            'as you use a weapon, you will gain profiency which increases your hit chance. '+
                            'strong enemies: enemy levels vary and enemies with greater level than the player will be harder to hit. '+
                            'weapon requirements and talents can also influence your hit chance.',
                            font: Font.dflt.copy({size: 24}), color: text2Color, wrap: true}),
                        }),
                    ],
                }),
                button('   prev   ', { tag: 'help.prev', xform: new XForm({right: .67, top: .8, bottom: .025 }) }),
                button('   back   ', { tag: 'help.back', xform: new XForm({left: .33, right: .33, top: .8, bottom: .025 }) }),
                button('   next   ', { tag: 'help.next', xform: new XForm({left: .67, top: .8, bottom: .025 }) }),
            ],
        });
        this.adopt(this.panel);
        let b = Hierarchy.find(this.panel, (v) => v.tag === 'help.back');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.destroy());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.prev');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doCharms());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.next');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doRanged());
    }

    doRanged() {
        if (this.panel) this.panel.destroy();
        this.panel = new UxPanel({
            sketch: Assets.get('help.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'ranged attacks & resistances', color: titleColor}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({ top: .2, bottom: .2, left: .1, right: .1 }),
                    children: [
                        new UxText({
                            text: new Text({text: 
                            'ranged weapons allow the player to attack enemies at range but require significant power to use. '+
                            'ranged attacks have different elemental types and will always hit, but are still subject to resistances. '+
                            'both player and enemies can have resistances to different attack types. ',
                            font: Font.dflt.copy({size: 24}), color: text2Color, wrap: true}),
                        }),
                    ],
                }),
                button('   prev   ', { tag: 'help.prev', xform: new XForm({right: .67, top: .8, bottom: .025 }) }),
                button('   back   ', { tag: 'help.back', xform: new XForm({left: .33, right: .33, top: .8, bottom: .025 }) }),
                button('   next   ', { tag: 'help.next', xform: new XForm({left: .67, top: .8, bottom: .025 }) }),
            ],
        });
        this.adopt(this.panel);
        let b = Hierarchy.find(this.panel, (v) => v.tag === 'help.back');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.destroy());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.prev');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doAttack());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.next');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doBars());
    }

    doBars() {
        if (this.panel) this.panel.destroy();
        this.panel = new UxPanel({
            sketch: Assets.get('help.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'health & power & fuel', color: titleColor}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({ top: .2, bottom: .2, left: .1, right: .1 }),
                    children: [
                        new UxText({
                            text: new Text({text: 
                            'the in game display has three bars in the upper left to show the player\'s current health, power, and fuel reserves. '+
                            'health: life points for the player.  if you dip below 0 you die and the game is over. '+
                            'power: power for ranged weapons. '+
                            'fuel: fuel consumed while performing actions. '+
                            'health & power will slowly regenerate over time (turn-based), linked to your reactor. '+
                            'fuel is slowly consumed over time, also linked to your reactor. '+
                            'running out of fuel will cause you to burn health instead of fuel. '+
                            'health/power gems/nodes and fuelcells can be looted',
                            font: Font.dflt.copy({size: 24}), color: text2Color, wrap: true}),
                        }),
                    ],
                }),
                button('   prev   ', { tag: 'help.prev', xform: new XForm({right: .67, top: .8, bottom: .025 }) }),
                button('   back   ', { tag: 'help.back', xform: new XForm({left: .33, right: .33, top: .8, bottom: .025 }) }),
                button('   next   ', { tag: 'help.next', xform: new XForm({left: .67, top: .8, bottom: .025 }) }),
            ],
        });
        this.adopt(this.panel);
        let b = Hierarchy.find(this.panel, (v) => v.tag === 'help.back');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.destroy());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.prev');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doRanged());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.next');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doTalents());
    }

    doTalents() {
        if (this.panel) this.panel.destroy();
        this.panel = new UxPanel({
            sketch: Assets.get('help.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'level up & talents', color: titleColor}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({ top: .2, bottom: .2, left: .1, right: .1 }),
                    children: [
                        new UxText({
                            text: new Text({text: 
                            'players level up by gaining experience.  xp is granted for every enemy defeated. '+
                            'for every level gained, a talent point is earned. '+
                            'spend talent points to unlock player buffs. talents are unlocked in tiers and there are three tiers altogether. '+
                            'you can spend up to 7 points in each tier, '+
                            'and you must fully spend all points in the lower tiers before unlocking the upper tiers.',
                            font: Font.dflt.copy({size: 24}), color: text2Color, wrap: true}),
                        }),
                    ],
                }),
                button('   prev   ', { tag: 'help.prev', xform: new XForm({right: .67, top: .8, bottom: .025 }) }),
                button('   back   ', { tag: 'help.back', xform: new XForm({left: .33, right: .33, top: .8, bottom: .025 }) }),
                //button('   next   ', { tag: 'help.next', xform: new XForm({left: .67, top: .8, bottom: .025 }) }),
            ],
        });
        this.adopt(this.panel);
        let b = Hierarchy.find(this.panel, (v) => v.tag === 'help.back');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.destroy());
        b = Hierarchy.find(this.panel, (v) => v.tag === 'help.prev');
        b.evt.listen( b.constructor.evtMouseClicked, (evt) => this.doBars());
    }

    destroy() {
        super.destroy();
        Events.ignore(Keys.evtDown, this.onKeyDown);
    }

    onKeyDown(evt) {
        this.destroy();
    }

}