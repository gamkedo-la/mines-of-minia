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
let textColor = Resurrect64.colors[11];
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
                    xform: new XForm({ top: .05, bottom: .85}),
                }),
                new UxText({
                    text: new Text({text: 'lost contact with subject, reboot required', color: textColor}),
                    xform: new XForm({ top: .45, bottom: .45}),
                }),

                button('   reboot   ', { tag: 'options.quit', xform: new XForm({top: .75, bottom: .05}) }),

            ],
        });
        this.adopt(panel);
        // -- ui elements
        this.quitButton = Hierarchy.find(this, (v) => v.tag === 'options.quit');
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