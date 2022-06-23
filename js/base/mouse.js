export { Mouse }

import { Events }           from "./event.js";
import { Vect }             from "./vect.js";

class Mouse {
    // STATIC VARIABLES ----------------------------------------------------
    static x = 0;
    static y = 0;
    static down = false;

    static evtClicked = Events.get("mouse.clicked");
    static evtMoved = Events.get("mouse.moved");
    static evtEntered = Events.get("mouse.entered");
    static evtLeft = Events.get("mouse.left");

    // STATIC PROPERTIES ---------------------------------------------------
    static get pos() {
        return new Vect(this.x, this.y);
    }
}