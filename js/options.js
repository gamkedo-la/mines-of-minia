export { Options };

import { Events } from './base/event.js';
import { Keys } from './base/keys.js';
import { Rect } from './base/rect.js';
import { Sketch } from './base/sketch.js';
import { Text } from './base/text.js';
import { UxPanel } from './base/uxPanel.js';
import { UxText } from './base/uxText.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';

class Options extends UxView {

    cpost(spec) {
        super.cpost(spec);
        this.adopt(new UxPanel({
            children: [
                new UxText({
                    text: new Text({text: 'Options', color: 'red'}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),
                new UxPanel({
                    xform: new XForm({ top: .2, bottom: .6}),
                    children: [
                        new UxText({
                            text: new Text({text: 'Music Volume', color: 'red'}),
                            xform: new XForm({ top: .1, bottom: .1, left: .1, right: .6}),
                        }),
                    ],
                }),
                new UxPanel({
                    xform: new XForm({ top: .6, bottom: .2}),
                    children: [
                        new UxText({
                            text: new Text({text: 'Sfx Volume', color: 'red'}),
                            xform: new XForm({ top: .1, bottom: .1, left: .1, right: .6}),
                        }),
                    ],
                }),
            ],
        }));
        // -- bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
    }

    destroy() {
        super.destroy();
        Events.ignore(Keys.evtDown, this.onKeyDown);
    }

    onKeyDown(evt) {
        this.destroy();
    }

}