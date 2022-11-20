export { Prompt };

import { Assets } from './base/assets.js';
import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
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

const textColor = Resurrect64.colors[18];

class Prompt extends UxView {

    cpost(spec) {
        super.cpost(spec);
        this.handleConfirm = spec.handleConfirm;
        this.handleCancel = spec.handleCancel;
        let title = spec.title || 'confirm';
        let prompt = spec.prompt || 'prompt';

        this.panel = new UxPanel({
            sketch: Assets.get('prompt.bg', true),
            children: [
                // title
                new UxText({
                    tag: 'title',
                    xform: new XForm({left: 1.5/15, right: 11/15, top: 3.5/8, bottom: 3.5/8}),
                    text: new Text({ text: title, color: textColor}),
                }),

                // prompt
                new UxPanel({
                    xform: new XForm({left: 5/15, right: 4/15, top: 2/8, bottom: 2/8}),
                    sketch: Sketch.zero,
                    children: [
                        new UxText({
                            tag: 'prompt',
                            text: new Text({wrap: true, text: prompt, color: textColor}),
                        }),
                    ]
                }),

                new UxButton({
                    tag: 'confirm',
                    xform: new XForm({left: 12/15, right: 1/15, top: 1/8, bottom: 5/8}),
                    text: new Text({text: '    ok    '}),
                    unpressed: Assets.get('hud.green.unpressed', true),
                    pressed: Assets.get('hud.green.pressed', true),
                    highlight: Assets.get('hud.green.highlight', true),
                    mouseClickedSound: Assets.get('menu.click', true),
                }),

                new UxButton({
                    tag: 'cancel',
                    xform: new XForm({left: 12/15, right: 1/15, top: 5/8, bottom: 1/8}),
                    text: Text.zero,
                    unpressed: Assets.get('hud.cancel.unpressed', true),
                    pressed: Assets.get('hud.cancel.pressed', true),
                    highlight: Assets.get('hud.cancel.highlight', true),
                    mouseClickedSound: Assets.get('menu.click', true),
                }),

            ]
        });
        this.adopt(this.panel);

        // ui elements
        this.title = Hierarchy.find(this, (v) => v.tag === 'title');
        this.prompt = Hierarchy.find(this, (v) => v.tag === 'prompt');
        this.confirmButton = Hierarchy.find(this, (v) => v.tag === 'confirm');
        this.cancelButton = Hierarchy.find(this, (v) => v.tag === 'cancel');

        // event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onConfirmClicked = this.onConfirmClicked.bind(this);
        this.onCancelClicked = this.onCancelClicked.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        this.confirmButton.evt.listen(this.confirmButton.constructor.evtMouseClicked, this.onConfirmClicked);
        this.cancelButton.evt.listen(this.cancelButton.constructor.evtMouseClicked, this.onCancelClicked);

        this.item = spec.item;
        if (spec.item && !this.wantTarget) this.setItem(spec.item);

    }

    destroy() {
        super.destroy();
        Events.ignore(Keys.evtDown, this.onKeyDown);
    }

    onKeyDown(evt) {
        if (!this.active) return;
        console.log(`-- ${this.constructor.name} onKeyDown: ${Fmt.ofmt(evt)}`);
        switch (evt.key) {
            case 'Escape': {
                this.destroy();
                break;
            }
        }
    }

    onConfirmClicked(evt) {
        this.destroy();
        if (this.handleConfirm) this.handleConfirm();
    }

    onCancelClicked(evt) {
        if (this.handleCancel) this.handleCancel();
        this.destroy();
    }

}