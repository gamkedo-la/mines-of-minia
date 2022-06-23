export { Weapon };

import { Fmt } from '../base/fmt.js';
import { Rect } from '../base/rect.js';
import { MiniaModel } from './miniaModel.js';

class Weapon extends MiniaModel {
    // STATIC VARIABLES ----------------------------------------------------
    static kinds = [
        'bonk',
        'poke',
        'hack',
        'chuck',
        'fling',
        'strung',
        'charged',
    ];
    static dfltKind = 'bonk';
    static dfltTier = 1;
    static dfltLvl = 1;
    static dfltBrawn = 10;
    static dfltBaseDamageMin = 1;
    static dfltBaseDamageMax = 2;
    static dfltDescription = 'a rather basic weapon';
    static damageScaleByTier = {
        1: 1.5,
        2: 2,
        3: 2.5,
    };

    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltSketch() {
        return new Rect({ width: 16, height: 16, color: 'rgba(255,255,0,.75)' });
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // -- general properties
        this.kind = spec.kind || this.constructor.dfltKind;
        this.tier = spec.tier || this.constructor.dfltTier;
        this.lvl = spec.lvl || this.constructor.dfltLvl;
        this.description = spec.description || this.constructor.dfltDescription;
        this.identified = spec.hasOwnProperty('identified') ? spec.identified : false;
        this.slot = 'weapon';
        // -- required strength
        this.brawn = spec.brawn || this.constructor.dfltBrawn;
        // -- damage
        this.baseDamageMin = spec.baseDamageMin || this.constructor.dfltBaseDamageMin;
        this.baseDamageMax = spec.baseDamageMax || this.constructor.dfltBaseDamageMax;
        this.damageScalePerLvl = spec.damageScale || this.constructor.damageScaleByTier[this.tier];
        // -- enhancement
        this.enhancement = spec.enhancement || null;
        // -- sketch
        this._linkSketch('_sketch', spec.sketch || this.constructor.dfltSketch, false);
        this._sketch.link(this);
        // -- sync xform to match sketch dimensions
        this.xform.width = this.sketch.width;
        this.xform.height = this.sketch.height;
    }

    destroy() {
        this._unlinkSketch('_sketch');
        super.destroy();
    }

    // PROPERTIES ----------------------------------------------------------
    get sketch() {
        return this._sketch;
    }
    set sketch(v) {
        if (!v) return;
        if (v !== this._sketch) {
            this._linkSketch('_sketch', v);
        }
    }

    get damageMin() {
        return Math.round(this.baseDamageMin*this.lvl*(this.damageScalePerLvl-1));
    }
    get damageMax() {
        return Math.round(this.baseDamageMax*this.lvl*(this.damageScalePerLvl-1));
    }

    // METHODS -------------------------------------------------------------
    show() {
        this._sketch.show();
    }

    hide() {
        this._sketch.hide();
    }

    _render(ctx) {
        // update sketch dimensions
        this._sketch.width = this.xform.width;
        this._sketch.height = this.xform.height;
        // render
        if (this._sketch && this._sketch.render) this._sketch.render(ctx, this.xform.minx, this.xform.miny);
    }

}