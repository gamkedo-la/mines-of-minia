export { Hud };

import { Assets } from './base/assets.js';
import { Rect } from './base/rect.js';
import { Sketch } from './base/sketch.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxPanel } from './base/uxPanel.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';


class Hud extends UxView {
    cpost(spec) {
        super.cpost(spec);
        // build out hud
        this.adopt( new UxPanel({
            sketch: Assets.get('hud.border', true),
            //sketch: Sketch.zero,
            children: [
                new UxPanel({
                    sketch: Sketch.zero,
                    //dbg: { xform: true },
                    xform: new XForm({oleft: 10, otop: 10, origx: 0, origy: 0, right: .6, bottom: .8, width: 220, height: 100, lockRatio: true}),
                    children: [
                        new UxPanel({
                            sketch: Assets.get('hud.portrait', true, {lockRatio: true}),
                            xform: new XForm({right: .6,}),
                            //dbg: { xform: true },
                        }),
                        new UxPanel({
                            sketch: Sketch.zero,
                            xform: new XForm({left: .3, top: .2, bottom: .2}),
                            //dbg: { xform: true },
                            children: [

                                new UxPanel({
                                    sketch: Sketch.zero,
                                    xform: new XForm({bottom: .67}),
                                    children: [
                                        new UxPanel({
                                            tag: 'bar.health',
                                            //sketch: new Rect({color: "rgba(179,56,49,1)"}),
                                            sketch: new Rect({color: "red"}),
                                            xform: new XForm({left: .225, right: .225, top: .3, bottom: .3, }),
                                        }),
                                        new UxPanel({
                                            sketch: Assets.get('hud.bar', true, {lockRatio: true}),
                                        }),
                                    ],
                                }),

                                new UxPanel({
                                    sketch: Sketch.zero,
                                    xform: new XForm({bottom: .33, top: .33}),
                                    children: [
                                        new UxPanel({
                                            tag: 'bar.power',
                                            sketch: new Rect({color: "rgba(77,101,180,1)"}),
                                            xform: new XForm({left: .225, right: .225, top: .3, bottom: .3, }),
                                        }),
                                        new UxPanel({
                                            sketch: Assets.get('hud.bar', true, {lockRatio: true}),
                                        }),
                                    ],
                                }),

                                new UxPanel({
                                    sketch: Sketch.zero,
                                    xform: new XForm({top: .67}),
                                    children: [
                                        new UxPanel({
                                            tag: 'bar.fuel',
                                            sketch: new Rect({color: "rgba(247,150,23,1)"}),
                                            xform: new XForm({left: .225, right: .225, top: .3, bottom: .3, }),
                                        }),
                                        new UxPanel({
                                            sketch: Assets.get('hud.bar', true, {lockRatio: true}),
                                        }),
                                    ],
                                }),

                            ],
                        }),
                    ],
                }),
                
                new UxButton({
                    text: new Text({text: '    options    '}),
                    pressed: Assets.get('hud.button.pressed', true),
                    unpressed: Assets.get('hud.button.unpressed', true),
                    highlight: Assets.get('hud.button.highlight', true),
                    xform: new XForm({left: .9, bottom: .85, top: .025, right: .025, lockRatio: true, width: 10, height: 10}),
                    //dbg: { xform: true },
                }),

            ],
        }));
    }
}