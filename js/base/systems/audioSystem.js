export { AudioSystem };

import { Events } from '../event.js';
import { Game } from '../game.js';
import { Gizmo } from '../gizmo.js';
import { Mathf } from '../math.js';

class AudioChannel extends Gizmo {
    static dfltVolume = 1;
    cpost(spec) {
        super.cpost();
        this.initialized = false;
        this.asys = spec.hasOwnProperty('asys') ? spec.asys : AudioSystem.main;
        this._volume = spec.hasOwnProperty('volume') ? spec.volume : this.constructor.dfltVolume;
        if (this.asys.initialized) this.link();
    }

    get volume() {
        return this._volume;
    }

    set volume(v) {
        v = Mathf.clamp(v, 0, 1);
        if (v !== this._volume) {
            this._volume = v;
            if (this.initialized) this.sink.gain.value = v;
        }
    }

    /**
     * initialize to audio system
     */
    initialize() {
        if (!this.initialized) {
            this.initialized = true;
            this.sink = this.asys.ctx.createGain();
            this.sink.connect(this.asys.ctx.destination);
            this.sink.gain.value = this._volume;
        }
    }

    connect(sfx) {
        sfx.link.connect(this.sink);
    }

}

class AudioSystem extends Gizmo {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltVolume = 1;
    static _main;

    // STATIC PROPERTIES ---------------------------------------------------
    static get main() {
        if (!this._main) this._main = new AudioSystem();
        return this._main;
    }

    static set main(v) {
        if (this._main !== v) {
            if (this._main) this._main.destroy();
            this._main = v;
        }
    }

    static createChannel(tag, volume=1) {
        this.main.createChannel(tag, volume);
    }

    static getVolume(tag) {
        return this.main.getVolume(tag);
    }

    static setVolume(tag, value) {
        this.main.setVolume(tag, value);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.initialized = false;
        // -- reserve variables
        this.ctx;
        // -- setup channels
        this.channels = {};
        let dfltChannel = spec.dfltChannel || new AudioChannel({asys: this, tag: 'channel.dflt'});
        this.dfltChannelTag = dfltChannel.tag;
        this.channels[dfltChannel.tag] = dfltChannel;

        // -- event handling
        const evtInteracted = Game.evtInteracted;
        if (Events.count(evtInteracted) === 0) {
            this.onGameInteracted = this.onGameInteracted.bind(this);
            Events.listen(evtInteracted, this.onGameInteracted, Events.once);
        } else {
            this.initialize();
        }
        if (!this.constructor._main) this.constructor._main = this;

    }

    destroy() {
        super.destroy();
    }

    // EVENT HANDLERS ------------------------------------------------------
    onGameInteracted(evt) {
        this.initialize();
    }


    // METHODS -------------------------------------------------------------
    initialize() {
        if (!this.initialized) {
            this.initialized = true;
            this.ctx = new AudioContext();
            for (const channel of Object.values(this.channels)) {
                channel.initialize();
            }
        }
    }

    createChannel(tag, volume=1) {
        if (this.channels[tag]) return;
        this.channels[tag] = new AudioChannel({
            asys: this,
            tag: tag,
            volume: volume,
        });
    }

    getChannelForSfx(sfx) {
        let tag = (sfx) ? sfx.channel : undefined;
        let channel = this.channels[tag];
        if (!channel) channel = this.channels[this.dfltChannelTag];
        return channel;
    }

    getVolume(tag) {
        let channel = this.channels[tag];
        return (channel) ? channel.volume : 0;
    }

    setVolume(tag, value) {
        let channel = this.channels[tag];
        if (channel) channel.volume = value;
    }

}
