export { Talents }

import { Assets } from './base/assets.js';
import { UxPanel } from './base/uxPanel.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';


class Talents extends UxView {
    cpost(spec) {
        super.cpost(spec);
        this.bg = new UxPanel({
            sketch: Assets.get('oframe.red', true),
            xform: new XForm({offset: 10, right:.3}),
        });
        this.adopt(this.bg);
    }
}