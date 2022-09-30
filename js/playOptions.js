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
        this.doSave = spec.doSave;
        this.adopt(new UxPanel({
            sketch: Assets.get('options.bg', true),
            children: [
                new UxText({
                    text: new Text({text: 'options', color: titleColor}),
                    xform: new XForm({ top: .05, bottom: .85}),
                }),
                new UxPanel({
                    sketch: Sketch.zero,
                    xform: new XForm({ top: .2 }),
                    children: [
                        button('   save   ', { tag: 'options.save', xform: new XForm({top: .0, bottom: .8}) }),
                        button('   quit   ', { tag: 'options.quit', xform: new XForm({top: .2, bottom: .6}) }),

                        new UxPanel({
                            sketch: Sketch.zero, 
                            xform: new XForm({ top: .4, bottom: .4}),
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
                            xform: new XForm({ top: .6, bottom: .2}),
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

                        button('   back   ', { tag: 'options.back', xform: new XForm({top: .8, bottom: 0}) }),
                    ],
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