export { UxText };

import { Text }         from './text.js';
import { UxView }       from './uxView.js';

class UxText extends UxView {
    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltText() { return new Text({ text: 'default text' }); }

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.sketch = spec.text || this.constructor.dfltText;
    }

    // PROPERTIES ----------------------------------------------------------
    get text() {
        return this.sketch.text;
    }
    set text(v) {
        this.sketch.text = v;
        this.evt.trigger(this.constructor.evtUpdated, {actor: this, update: { value: v }});
    }

    // METHODS -------------------------------------------------------------
    show() {
        this.sketch.show();
    }
    hide() {
        this.sketch.hide();
    }

    _render(ctx) {
        // render active sketch
        this.sketch.width = this.xform.width;
        this.sketch.height = this.xform.height;
        this.sketch.render(ctx, this.xform.minx, this.xform.miny);
    }

}
