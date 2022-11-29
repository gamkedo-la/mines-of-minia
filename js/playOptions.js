export { PlayOptions };

import { Assets } from './base/assets.js';
import { Events } from './base/event.js';
import { Game } from './base/game.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
import { Sketch } from './base/sketch.js';
import { AudioSystem } from './base/systems/audioSystem.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxPanel } from './base/uxPanel.js';
import { UxSlider } from './base/uxSlider.js';
import { UxText } from './base/uxText.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';
import { Prompt } from './prompt.js';
import { Resurrect64 } from './resurrect64.js';
import { Serialization } from './serialization.js';

let titleColor = Resurrect64.colors[7];
let textColor = Resurrect64.colors[11];
let buttonTextColor = Resurrect64.colors[0];
let buttonTextHLColor = Resurrect64.colors[18];

function button(text, spec) {
    return new UxButton(Object.assign({}, {
        //textXform: new XForm({offset: 25}),
        highlight: Sketch.zero,
        unpressed: Sketch.zero,
        pressed: Sketch.zero,
        text: new Text({text: text, color: buttonTextColor}),
        hltext: new Text({text: text, color: buttonTextHLColor}),
        mouseClickedSound: Assets.get('menu.click', true),
    }, spec));
}

class PlayOptions extends UxView {

    cpost(spec) {
        super.cpost(spec);
        this.doSave = spec.doSave;
        this.adopt(new UxPanel({
            sketch: Assets.get('options-play.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'options', color: titleColor}),
                    xform: new XForm({ left: 2/13, right: 4/13, top: 1.5/10, bottom: 7.5/10}),
                }),

                button('   save   ', { tag: 'options.save', xform: new XForm({left: 1.5/13, right: 8.5/13, top: 3.5/10, bottom: 5.5/10}) }),
                button('   quit   ', { tag: 'options.quit', xform: new XForm({left: 6.5/13, right: 3.5/13, top: 3.5/10, bottom: 5.5/10}) }),

                new UxText({
                    text: new Text({text: 'music volume', color: textColor}),
                    xform: new XForm({ left: 1.6/13, right: 8.5/13, top: 5.5/10, bottom: 3.5/10}),
                }),
                new UxSlider({
                    tag: 'music.slider',
                    value: AudioSystem.getVolume('music'),
                    xform: new XForm({left: 5.75/13, right: 3.75/13, top: 5.25/10, bottom: 3.25/10}),
                    knob: Assets.get('volume.knob', true, { lockRatio: true }),
                    bar: Sketch.zero,
                    knobWidthPct: .15,
                }),

                new UxText({
                    text: new Text({text: 'sfx volume', color: textColor}),
                    xform: new XForm({ left: 1.6/13, right: 8.5/13, top: 7.5/10, bottom: 1.5/10}),
                }),
                new UxSlider({
                    tag: 'sfx.slider',
                    value: AudioSystem.getVolume('sfx'),
                    xform: new XForm({left: 5.75/13, right: 3.75/13, top: 7.25/10, bottom: 1.25/10}),
                    knob: Assets.get('volume.knob', true, { lockRatio: true }),
                    bar: Sketch.zero,
                    knobWidthPct: .15,
                }),

                new UxButton({
                    tag: 'options.back',
                    unpressed: Assets.get('hud.cancel.unpressed', true),
                    pressed: Assets.get('hud.cancel.pressed', true),
                    highlight: Assets.get('hud.cancel.highlight', true),
                    xform: new XForm({left: 10/13, right: 1/13, top: 7/10, bottom: 1/10}),
                    text: Text.zero,
                    mouseClickedSound: Assets.get('menu.click', true),
                }),

            ],
        }));
        // -- ui elements
        this.saveButton = Hierarchy.find(this, (v) => v.tag === 'options.save');
        this.quitButton = Hierarchy.find(this, (v) => v.tag === 'options.quit');
        this.musicSlider = Hierarchy.find(this, (v) => v.tag === 'music.slider');
        this.sfxSlider = Hierarchy.find(this, (v) => v.tag === 'sfx.slider');
        // -- bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onSaveClicked = this.onSaveClicked.bind(this);
        this.onQuitClicked = this.onQuitClicked.bind(this);
        this.onMusicVolumeUpdated = this.onMusicVolumeUpdated.bind(this);
        this.onSfxVolumeUpdated = this.onSfxVolumeUpdated.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        this.saveButton.evt.listen(this.saveButton.constructor.evtMouseClicked, this.onSaveClicked);
        this.quitButton.evt.listen(this.quitButton.constructor.evtMouseClicked, this.onQuitClicked);
        this.musicSlider.evt.listen(this.musicSlider.constructor.evtUpdated, this.onMusicVolumeUpdated);
        this.sfxSlider.evt.listen(this.sfxSlider.constructor.evtUpdated, this.onSfxVolumeUpdated);
        let optionsButton = Hierarchy.find(this, (v) => v.tag === 'options.back');
        if (optionsButton) optionsButton.evt.listen( optionsButton.constructor.evtMouseClicked, (evt) => this.destroy());
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
        if (this.doSave) this.doSave();
        this.destroy();
    }

    onQuitClicked(evt) {
        let prompt = new Prompt({
            xform: new XForm({ border: .3 }),
            title: 'confirm',
            prompt: `quit game? unsaved progress will be lost`,
            handleConfirm: () => {
                Events.trigger(Game.evtStateChanged, {state: 'menu'});
            },
        });
        this.parent.adopt(prompt);
    }

    onMusicVolumeUpdated(evt) {
        if (evt.update && evt.update.hasOwnProperty('value')) {
            console.log(`onMusicVolumeUpdated`);
            AudioSystem.setVolume('music', evt.update.value);
        }
    }

    onSfxVolumeUpdated(evt) {
        if (evt.update && evt.update.hasOwnProperty('value')) {
            console.log(`onSfxVolumeUpdated`);
            AudioSystem.setVolume('sfx', evt.update.value);
        }
    }


}