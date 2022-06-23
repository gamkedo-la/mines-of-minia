export { ProcModel };

import { Fmt } from "../base/fmt.js";

class ProcModel {
    draw(ctx) {
    }

    toString() {
        return Fmt.ofmt(this, this.constructor.name);
    }
}