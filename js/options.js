export { Options };

import { Assets } from './base/assets.js';
import { Events } from './base/event.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
import { Rect } from './base/rect.js';
import { Sketch } from './base/sketch.js';
import { AudioSystem } from './base/systems/audioSystem.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxPanel } from './base/uxPanel.js';
import { UxSlider } from './base/uxSlider.js';
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

class Options extends UxView {

    cpost(spec) {
        super.cpost(spec);
        this.panel = new UxPanel({
            sketch: Assets.get('options.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'options', color: titleColor}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),

                new UxPanel({
                    sketch: Sketch.zero, 
                    xform: new XForm({ top: .2, bottom: .6}),
                    children: [
                        new UxText({
                            text: new Text({text: 'music volume', color: textColor}),
                            xform: new XForm({ top: .1, bottom: .1, left: .1, right: .6}),
                        }),
                        new UxSlider({
                            tag: 'music.slider',
                            value: AudioSystem.getVolume('music'),
                            xform: new XForm({ top: .2, bottom: .2, left: .45, right: .1}),
                        }),
                    ],
                }),

                new UxPanel({
                    sketch: Sketch.zero, 
                    xform: new XForm({ top: .4, bottom: .4}),
                    children: [
                        new UxText({
                            text: new Text({text: '  sfx volume', color: textColor}),
                            xform: new XForm({ top: .1, bottom: .1, left: .1, right: .6}),
                        }),
                        new UxSlider({
                            tag: 'sfx.slider',
                            value: AudioSystem.getVolume('sfx'),
                            xform: new XForm({ top: .2, bottom: .2, left: .45, right: .1}),
                        }),
                    ],
                }),

                button('   back   ', { tag: 'options.back', xform: new XForm({top: .7, bottom: .1}) }),
            ],
        });
        console.log(`${this} before adopt`);
        this.adopt(this.panel);
        // -- bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        let optionsButton = Hierarchy.find(this.panel, (v) => v.tag === 'options.back');
        if (optionsButton) optionsButton.evt.listen( optionsButton.constructor.evtMouseClicked, (evt) => this.destroy());
    }

    destroy() {
        super.destroy();
        Events.ignore(Keys.evtDown, this.onKeyDown);
    }

    onKeyDown(evt) {
        this.destroy();
    }

}