export { PlayOptions };

import { Assets } from './base/assets.js';
import { Events } from './base/event.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
import { Sketch } from './base/sketch.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxCanvas } from './base/uxCanvas.js';
import { UxPanel } from './base/uxPanel.js';
import { UxSlider } from './base/uxSlider.js';
import { UxText } from './base/uxText.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';
import { Resurrect64 } from './resurrect64.js';

let titleColor = Resurrect64.colors[7];
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

class PlayOptions extends UxView {

    cpost(spec) {
        super.cpost(spec);
        this.adopt(new UxPanel({
            sketch: Assets.get('options.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'options', color: titleColor}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),
                button('   save   ', { tag: 'options.save', xform: new XForm({top: .2, bottom: .6}) }),
                button('   quit   ', { tag: 'options.quit', xform: new XForm({top: .4, bottom: .4}) }),
                new UxPanel({
                    xform: new XForm({ top: .6, bottom: .2}),
                    children: [
                        new UxText({
                            text: new Text({text: 'music volume', color: 'red'}),
                            xform: new XForm({ top: .1, bottom: .1, left: .1, right: .6}),
                        }),
                    ],
                }),
                new UxPanel({
                    xform: new XForm({ top: .8, bottom: 0}),
                    children: [
                        new UxText({
                            text: new Text({text: 'sfx volume', color: 'red'}),
                            xform: new XForm({ top: .1, bottom: .1, left: .1, right: .6}),
                        }),
                        new UxSlider({
                            xform: new XForm({ top: .1, bottom: .1, left: .4, right: .1}),
                            //dbg: { xform: true},
                        }),
                    ],
                }),
            ],
        }));
        // -- ui elements
        this.saveButton = Hierarchy.find(this, (v) => v.tag === 'options.save');
        this.quitButton = Hierarchy.find(this, (v) => v.tag === 'options.quit');
        // -- bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onSaveClicked = this.onSaveClicked.bind(this);
        this.onQuitClicked = this.onQuitClicked.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        this.saveButton.evt.listen(this.saveButton.constructor.evtMouseClicked, this.onSaveClicked);
        this.quitButton.evt.listen(this.quitButton.constructor.evtMouseClicked, this.onQuitClicked);
    }

    destroy() {
        super.destroy();
        Events.ignore(Keys.evtDown, this.onKeyDown);
    }

    onKeyDown(evt) {
        this.destroy();
    }

    onSaveClicked(evt) {
        console.log(`onSaveClicked`);
    }

    onQuitClicked(evt) {
        console.log(`onQuitClicked`);
    }

}