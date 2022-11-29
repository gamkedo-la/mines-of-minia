export { GameOver };

import { Assets } from './base/assets.js';
import { Events } from './base/event.js';
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
let textColor = Resurrect64.colors[18];
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

class GameOver extends UxView {

    cpost(spec) {
        super.cpost(spec);
        let panel = new UxPanel({
            sketch: Assets.get('gameover.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'game over', color: titleColor}),
                    xform: new XForm({left: 1/15, right: 1/15, top: 1.5/10, bottom: 7.5/10}),
                }),
                new UxText({
                    text: new Text({text: 'lost contact with subject, reboot required', color: textColor}),
                    xform: new XForm({left: 1.75/15, right: 3.75/15, top: 5/10, bottom: 3/10}),
                }),
                new UxPanel({
                    sketch: Assets.get('gameover.crack', true),
                    xform: new XForm({left: 7/15, right: 4/15, top: 4/10, bottom: 2/10}),
                }),

                //button('   reboot   ', { tag: 'options.quit', xform: new XForm({top: .75, bottom: .05}) }),

                new UxButton({
                    tag: 'gameover.back',
                    unpressed: Assets.get('hud.cancel.unpressed', true),
                    pressed: Assets.get('hud.cancel.pressed', true),
                    highlight: Assets.get('hud.cancel.highlight', true),
                    xform: new XForm({left: 12/15, right: 1/15, top: 3/10, bottom: 5/10}),
                    text: Text.zero,
                    mouseClickedSound: Assets.get('menu.click', true),
                }),

            ],
        });
        this.adopt(panel);
        // -- ui elements
        this.quitButton = Hierarchy.find(this, (v) => v.tag === 'gameover.back');
        // -- bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onQuitClicked = this.onQuitClicked.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        this.quitButton.evt.listen(this.quitButton.constructor.evtMouseClicked, this.onQuitClicked);
    }

    destroy() {
        super.destroy();
        Events.ignore(Keys.evtDown, this.onKeyDown);
    }

    onKeyDown(evt) {
        this.destroy();
    }

    onQuitClicked(evt) {
        this.destroy();
    }


}