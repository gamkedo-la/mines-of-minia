export { Sfx };

import { AudioSystem } from './systems/audioSystem.js';
import { Gizmo } from './gizmo.js';
import { EvtStream } from './event.js';

/** ========================================================================
 * Audio sound effect asset
 */
class Sfx extends Gizmo {
    // STATIC VARIABLES ----------------------------------------------------
    static evtDone = 'sfx.done';

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.asys = spec.hasOwnProperty('asys') ? spec.asys : AudioSystem.main;
        this.audio = spec.audio || new ArrayBuffer();
        this.decoded;
        this.initialized = false;
        this.loop = spec.hasOwnProperty('loop') ? spec.loop : false;
        this.volume = spec.volume || 1;
        // -- event handling
        this.evt = new EvtStream();
        this.onSfxDone = this.onSfxDone.bind(this);
    }
    destroy() {
        this.stop();
    }

    // EVENT HANDLERS ------------------------------------------------------
    onSfxDone(evt) {
        this.evt.trigger(this.constructor.evtDone, {actor: this});
    }

    // METHODS -------------------------------------------------------------
    initialize(play=false) {
        if (!this.initialized) {
            this.initialized = true;
            // make a copy of audio buffer (can't be decoded twice)
            let buffer = new ArrayBuffer(this.audio.byteLength);
            new Uint8Array(buffer).set(new Uint8Array(this.audio));
            // decode raw buffer to audio buffer source
            let p = this.asys.ctx.decodeAudioData(buffer);
            p.then((decoded) => {
                this.decoded = decoded;
                if (play) this._playDecoded();
            });
        }
    }

    _playDecoded() {
        this.src = this.asys.ctx.createBufferSource();
        this.src.buffer = this.decoded;
        this.src.loop = this.loop;
        this.src.addEventListener('ended', this.onSfxDone);
        // handle volume limiting by adding a gain node between source and channel
        if (this.volume !== 1) {
            let gainNode = this.asys.ctx.createGain()
            gainNode.gain.value = this.volume;
            this.link = gainNode;
        } else {
            this.link = this.src;
        }
        let channel = this.asys.getChannelForSfx(this);
        channel.connect(this);
        this.src.start(0);
    }

    play() {
        // skip play if audio system is not initialized
        if (!this.asys.initialized) {
            return false;
        }
        // connect audio to mgr
        if (!this.initialized) {
            this.initialize(true);
        } else {
            this._playDecoded();
        }
        return true;
    }

    stop() {
        if (this.src) this.src.stop(0);
    }

}
