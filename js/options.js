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

function button(which, spec) {
    let baseTag = (which === 'cancel') ? 'hud.cancel' : `options.${which}`;
    return new UxButton(Object.assign({}, {
        textXform: new XForm({offset: 25}),
        unpressed: Assets.get(`${baseTag}.unpressed`, true),
        pressed: Assets.get(`${baseTag}.pressed`, true),
        highlight: Assets.get(`${baseTag}.highlight`, true),
        text: Text.zero,
        mouseClickedSound: Assets.get('menu.click', true),
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
                    xform: new XForm({ left: 2/13, right: 4/13, top: 1.5/8, bottom: 5.5/8}),
                }),

                new UxText({
                    text: new Text({text: 'music volume', color: textColor}),
                    xform: new XForm({ left: 1.6/13, right: 8.5/13, top: 3.5/8, bottom: 3.5/8}),
                }),

                new UxText({
                    text: new Text({text: 'sfx volume', color: textColor}),
                    xform: new XForm({ left: 1.6/13, right: 8.4/13, top: 5.5/8, bottom: 1.5/8}),
                }),

                new UxSlider({
                    tag: 'music.slider',
                    value: AudioSystem.getVolume('music'),
                    xform: new XForm({left: 5.75/13, right: 3.75/13, top: 3.25/8, bottom: 3.25/8}),
                    knob: Assets.get('volume.knob', true, { lockRatio: true }),
                    bar: Sketch.zero,
                    knobWidthPct: .15,
                }),

                new UxSlider({
                    tag: 'sfx.slider',
                    value: AudioSystem.getVolume('sfx'),
                    xform: new XForm({left: 5.75/13, right: 3.75/13, top: 5.25/8, bottom: 1.25/8}),
                    knob: Assets.get('volume.knob', true, { lockRatio: true }),
                    bar: Sketch.zero,
                    knobWidthPct: .15,
                }),

                button('cancel', { tag: 'options.back', xform: new XForm({left: 10/13, right: 1/13, top: 5/8, bottom: 1/8}) }),

            ],
        });
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