export { Gizmo }

import { Events } from './event.js';
import { Fmt } from './fmt.js';

// __var    => non-serialized value
// _var     => indicates backing store
// var      => standard variable


/** ========================================================================
 * Gizmo is the base class for all game state objects, including game model and view components.
 * - global gizmo events are triggered on creation/destruction
 */
class Gizmo {

    // STATIC VARIABLES ----------------------------------------------------
    static cat = 'Gizmo';
    static _id = 1;
    static _initialized = false;
    static evtCreated = 'gizmo.created';
    static evtDestroyed = 'gizmo.destroyed';
    static _serialize_skip_parent = true;

    // STATIC PROPERTIES ---------------------------------------------------
    static get gid() {
        return Gizmo._id++;
    }
    static set gid(v) {
        if (v >= Gizmo._id) Gizmo._id = v+1;
    }
    static get spec() {
        return {
            cls: this.name,
        }
    }

    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        return Object.assign(this.spec, spec);
    }

    static _init() {
        this.init();
        this._initialized = true;
    }

    static init() {
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpre(spec={}) {
    }
    constructor(spec={}) {
        if (!this.constructor._initialized) this.constructor._init();
        // -- gizmo category
        this.cat = this.constructor.cat;
        // -- cls
        this.cls = this.constructor.name;
        // -- pre constructor actions
        this.cpre(spec);
        // -- id
        if (spec.hasOwnProperty('gid')) {
            this.gid = spec.gid;
            this.constructor.gid = this.gid;
        } else {
            this.gid = this.constructor.gid;
        }
        // -- tags
        this.tag = spec.tag || `${this.cls}.${this.gid}`;
        if (spec.assetTag) this.assetTag = spec.assetTag;
        // -- post constructor actions
        this.cpost(spec);
        this.cfinal(spec);
        // -- trigger creation event
        Events.trigger(this.constructor.evtCreated, {actor: this});
    }
    cpost(spec) {
    }
    cfinal(spec) {
    }
    destroy() {
        Events.trigger(this.constructor.evtDestroyed, {actor: this});
    }

    // METHODS -------------------------------------------------------------
    toString() {
        return Fmt.toString(this.cls, this.gid, this.tag);
    }

}