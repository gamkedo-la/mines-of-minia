export { Keys }
import { Events } from './event.js';

class Keys {
    // STATIC VARIABLES ----------------------------------------------------
    static pressed = new Map();
    static evt = Events.main;
    static evtDown = 'key.down';
    static evtUp = 'key.up';
    static dbg = false;

    // STATIC METHODS ------------------------------------------------------
    static init(spec={}) {
        if (spec.hasOwnProperty('dbg')) this.dbg = spec.dbg;
        this.evt = spec.evt || Events.main;
        // register event handlers
        document.addEventListener('keydown', this.onKeyDown.bind(this))
        document.addEventListener('keyup', this.onKeyUp.bind(this))
    }

    static get(key) {
        return (this.pressed.has(key)) ? 1 : 0;
    }

    static onKeyDown(evt) {
        evt.preventDefault();
        if (!this.pressed.has(evt.key)) {
            if (this.dbg) console.log('evt.key down: ' + evt.key);
            this.pressed.set(evt.key);
            this.evt.trigger(this.evtDown, {evt: evt, key:evt.key});
        }
    }

    static onKeyUp(evt) {
        if (this.pressed.has(evt.key)) {
            if (this.dbg) console.log('evt.key up: ' + evt.key);
            this.pressed.delete(evt.key);
            this.evt.trigger(this.evtUp, {evt: evt, key:evt.key});
        }
    }

}