export { Credits };

import { Assets } from './base/assets.js';
import { Events } from './base/event.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
import { Sketch } from './base/sketch.js';
import { AudioSystem } from './base/systems/audioSystem.js';
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

class Credits extends UxView {

    cpost(spec) {
        super.cpost(spec);
        this.panel = new UxPanel({
            sketch: Assets.get('credits.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'credits', color: titleColor}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),

                new UxPanel({
                    sketch: Sketch.zero, 
                    xform: new XForm({ top: .01, bottom: .1}),
                    children: [
                        new UxText({
                            text: new Text({text: 'Contributor 1', color: textColor}),
                            xform: new XForm({ top: .01, bottom: .1, left: .05, right: .7}),
                        }),
                    ],
                }),

                new UxPanel({
                    sketch: Sketch.zero, 
                    xform: new XForm({ top: .4, bottom: .4}),
                    children: [
                        new UxText({
                          text: new Text({text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ', color: textColor}),
                          xform: new XForm({ top: .01, bottom: .1, left: .05, right: .01}),
                      })
                    ],
                }),

                new UxPanel({
                  sketch: Sketch.zero, 
                  xform: new XForm({ top: .5, bottom: .3}),
                  children: [
                    new UxText({
                      text: new Text({text: 'Contributor 2', color: textColor}),
                      xform: new XForm({ top: .01, bottom: .1, left: .05, right: .7}),
                    }),
                  ],
                 }),

                button('   back   ', { tag: 'credits.back', xform: new XForm({top: .8, bottom: .05}) }),
            ],
        });
        console.log(`${this} before adopt`);
        this.adopt(this.panel);
        // -- bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        let creditsButton = Hierarchy.find(this.panel, (v) => v.tag === 'credits.back');
        if (creditsButton) creditsButton.evt.listen( creditsButton.constructor.evtMouseClicked, (evt) => this.destroy());
    }

    destroy() {
        super.destroy();
        Events.ignore(Keys.evtDown, this.onKeyDown);
    }

    onKeyDown(evt) {
        this.destroy();
    }

}