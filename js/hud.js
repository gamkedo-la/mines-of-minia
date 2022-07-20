export { Hud };

import { Assets } from './base/assets.js';
import { Sketch } from './base/sketch.js';
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
                        }),
                        new UxPanel({
                            sketch: Sketch.zero,
                            xform: new XForm({left: .4, top: .2, bottom: .2}),
                            children: [
                                new UxPanel({
                                    sketch: Assets.get('hud.healthbar', true, {lockRatio: true}),
                                    xform: new XForm({bottom: .67, stretch: false, width: 160, height: 32}),
                                }),
                                new UxPanel({
                                    sketch: Assets.get('hud.healthbar', true, {lockRatio: true}),
                                    xform: new XForm({top: .33, bottom: .33, stretch: false, width: 160, height: 32}),
                                }),
                                new UxPanel({
                                    sketch: Assets.get('hud.healthbar', true, {lockRatio: true}),
                                    xform: new XForm({top: .67, stretch: false, width: 160, height: 32}),
                                }),
                            ],
                        }),
                    ],
                }),
                /*
                new UxPanel({
                    xform: new XForm({left: .125, right: .7, top: .075, bottom: .875}),
                }),
                */
            ],
        }));
    }
}