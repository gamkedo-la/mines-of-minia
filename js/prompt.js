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

const textColor = "yellow";

class Prompt extends UxView {

    cpost(spec) {
        super.cpost(spec);
        this.handleConfirm = spec.handleConfirm;
        this.handleCancel = spec.handleCancel;
        let title = spec.title || 'confirm';
        let prompt = spec.prompt || 'prompt';

        this.panel = new UxPanel({
            sketch: Assets.get('oframe.red', true),
            children: [
                // title
                new UxText({
                    tag: 'title',
                    xform: new XForm({offset: 5, bottom: .9}),
                    text: new Text({ text: title, color: textColor}),
                }),

                // prompt
                new UxPanel({
                    xform: new XForm({top: .325, bottom: .325}),
                    sketch: Sketch.zero,
                    children: [
                        new UxText({
                            tag: 'prompt',
                            xform: new XForm({offset: 15}),
                            text: new Text({wrap: true, text: prompt, color: textColor}),
                        }),
                    ]
                }),

                // buttons
                new UxPanel({
                    xform: new XForm({top: .8}),
                    sketch: Sketch.zero,
                    children: [
                        new UxButton({
                            tag: 'confirm',
                            xform: new XForm({offset: 10, right:.67}),
                            text: new Text({text: ' confirm '}),
                        }),
                        new UxButton({
                            tag: 'cancel',
                            xform: new XForm({offset: 10, left:.67}),
                            text: new Text({text: ' cancel '}),
                        }),
                    ]
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