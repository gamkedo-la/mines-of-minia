export { Credits };

import { Assets } from './base/assets.js';
import { Events } from './base/event.js';
import { Font } from './base/font.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
import { Sketch } from './base/sketch.js';
import { AudioSystem } from './base/systems/audioSystem.js';
import { Text } from './base/text.js';
import { Mathf } from './base/math.js';
import { UxButton } from './base/uxButton.js';
import { UxPanel } from './base/uxPanel.js';
import { UxText } from './base/uxText.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';
import { Resurrect64 } from './resurrect64.js';

let titleColor = Resurrect64.colors[7];
let textColor = Resurrect64.colors[11];
let nameColor = Resurrect64.colors[18];
let detailsColor = Resurrect64.colors[43];
let buttonTextColor = Resurrect64.colors[1];
let buttonTextHLColor = Resurrect64.colors[18];

function button(which, spec) {
    let baseTag = (which === 'cancel') ? 'hud.cancel' : `help.${which}`;
    return new UxButton(Object.assign({}, {
        textXform: new XForm({offset: 25}),
        unpressed: Assets.get(`${baseTag}.unpressed`, true),
        pressed: Assets.get(`${baseTag}.pressed`, true),
        highlight: Assets.get(`${baseTag}.highlight`, true),
        text: Text.zero,
        mouseClickedSound: Assets.get('menu.click', true),
    }, spec));
}

class Credits extends UxView {
    static credits = [
        ['Tylor Allison', 'Project lead, core gameplay, ap turn system, level procedural generation, story, combat, environment titles, enemies (art and AI) and boss, talents, charms, door functionality, pillar interactions, player sprites, inventory, fuel system, asset integration, title screen, UI, vfx, assorted bug fixes, help screens, vendor, menu cogs layout'],
        ['Vince McKeown', 'Fuel cells, treasure chest art, keys, funguy sprite with animations, rock clutter, door animations, scarab, gem colors, digger bot, bonk weapon, mace and club, crystals, mine props'],
        ['Patrick McKeown', 'Player armor sprite variations (including reactor green), gem sprite, sounds (gem break, item pickup, player step, motor whir, household devices, boss footstep, currency pickup, failed action, cog use, trap, open ches, door open, vendor transaction, beetle, thump bot, shock, menu action, poke, swing), darker bot variations'],
        ['Roxcon', 'Bio floor, giant rat, Rou\'s sprite update, uthoring additional weapon names'],
        ['Ashleigh M.', 'Playtesting organizer, translated test responses into action items, organized live testing'],
        ['Jonathan Peterson', 'Stair picture, crash fix on using unusable item, new gizmo sprite, menu button art'],
        ['Christer "McFunkypants" Kaitila', 'Sound effects (pokes, hacks, bonks, ice/dark/flame weapons, doors closing, assorted retro fantasy sounds), vine obstacle art'],
        ['FightEXP', 'Title art, game over prompt concept'],
        ['Gonzalo Delgado', 'Menu background cogs'],
        ['Tor Andreas Johnsen', 'In-game options menu toggle, quick slot key hookups'],
        ['Johan Östling', 'Brass cog sprite'],
        ['H Trayford', 'Credits scene setup'],
        ['Abhishek @akhmin_ak', 'Early song draft (adapted to a different game)'],
        ['Jiho Yoo', 'Practice commit'],
    ]


    cpost(spec) {
        super.cpost(spec);
        this.nextIndex = 0;
        this.prevIdxs = [];
        this.nameFont = Font.dflt.copy({size: 24});
        this.detailsFont = Font.dflt.copy({size: 18});
        this.panel = new UxPanel({
            sketch: Assets.get('help.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'credits', color: titleColor}),
                    xform: new XForm({ top: 1.5/17, bottom: 14.5/17, left: 1/21, right: 3/21}),
                }),
                new UxPanel({
                    tag: 'credits.panel',
                    sketch: Sketch.zero,
                    xform: new XForm({ top: 4/17, bottom: 2/17, left: 2/21, right: 4/21 }),
                }),

                button('next', { tag: 'credits.next', xform: new XForm({left: 18/21, right: 1/21, top: 10/17, bottom: 5/17}) }),
                button('prev', { tag: 'credits.prev', xform: new XForm({left: 18/21, right: 1/21, top: 12/17, bottom: 3/17}) }),
                button('cancel', { tag: 'credits.back', xform: new XForm({left: 18/21, right: 1/21, top: 14/17, bottom: 1/17}) }),
            ],
        });
        this.adopt(this.panel);
        this.txts = [];
        // -- ui elements
        this.nextButton = Hierarchy.find(this.panel, (v) => v.tag === 'credits.next');
        this.prevButton = Hierarchy.find(this.panel, (v) => v.tag === 'credits.prev');
        this.cancelButton = Hierarchy.find(this.panel, (v) => v.tag === 'credits.back');
        this.fillPanel = Hierarchy.find(this.panel, (v) => v.tag === 'credits.panel');
        // -- bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onPrev = this.onPrev.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        this.nextButton.evt.listen( this.nextButton.constructor.evtMouseClicked, this.onNext);
        this.prevButton.evt.listen( this.prevButton.constructor.evtMouseClicked, this.onPrev);
        this.cancelButton.evt.listen( this.cancelButton.constructor.evtMouseClicked, (evt) => this.destroy());
        this.evt.listen(this.constructor.evtRooted, () => this.genCredits());
    }

    onNext(evt) {
        this.genCredits();
    }

    onPrev(evt) {
        this.prevIdxs.pop();
        let index = (this.prevIdxs.length) ? this.prevIdxs.pop() : 0;
        this.nextIndex = index;
        this.genCredits();
    }

    onKeyDown(evt) {
        this.destroy();
    }

    genCredits() {
        let allowedHeight = this.fillPanel.xform.height;
        let index = this.nextIndex;
        let startIndex = index;
        let entries = 0;
        let top = 0;
        let leadingPct = .25;

        for (const txt of this.txts) {
            txt.destroy();
        }
        this.txts = [];

        while (allowedHeight > 0) {
            let [name, details] = this.constructor.credits[index];
            // measure
            let nameHeight = Mathf.round(Text.measureWrapHeight(this.nameFont, name, this.fillPanel.xform.width), 2);
            let detailsHeight = Mathf.round(Text.measureWrapHeight(this.detailsFont, details, this.fillPanel.xform.width), 2);
            let leadingHeight = Mathf.round(nameHeight * leadingPct, 2);
            let height = nameHeight + leadingHeight + detailsHeight;
            if (entries > 0) height += leadingHeight;
            // create text elements if there is room
            if (entries === 0 || height < allowedHeight) {
                let namePct = Mathf.round(nameHeight/this.fillPanel.xform.height, 2);
                let leadPct = Mathf.round(namePct*leadingPct, 2);
                let tname = new UxText({
                    text: new Text({text: name, color: nameColor, font: this.nameFont, wrap: true}),
                    xform: new XForm({ top: top, bottom: 1-(top+namePct), left: .05, right: .01}),
                });
                top += namePct + leadPct;
                this.txts.push(tname);
                this.fillPanel.adopt(tname);

                let detailsPct = Mathf.round(detailsHeight/this.fillPanel.xform.height, 2);
                let tdetails = new UxText({
                    text: new Text({text: details, color: detailsColor, font: this.detailsFont, wrap: true}),
                    xform: new XForm({ top: top, bottom: 1-(top+detailsPct), left: .05, right: .01}),
                });
                top += detailsPct + leadPct;
                allowedHeight -= height;
                this.txts.push(tdetails);
                this.fillPanel.adopt(tdetails);

                index++;
                entries++;
                if (index >= this.constructor.credits.length) break;
            } else {
                break
            }

        }
        this.nextIndex = index;

        if (this.prevIdxs.length) {
            this.prevButton.active = this.prevButton.visible = true;
        } else {
            this.prevButton.active = this.prevButton.visible = false;
        }
        if (this.nextIndex < this.constructor.credits.length) {
            this.nextButton.active = this.nextButton.visible = true;
        } else {
            this.nextButton.active = this.nextButton.visible = false;
        }
        this.prevIdxs.push(startIndex);

    }

    destroy() {
        super.destroy();
        Events.ignore(Keys.evtDown, this.onKeyDown);
    }

}