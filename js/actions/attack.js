export { Attack, AttackRollAction, MeleeAttackAction, RangeAttackRollAction, RangeAttackAction };

import { Action } from '../base/actions/action.js';
import { MoveAction } from '../base/actions/move.js';
import { Timer } from '../base/timer.js';
import { Mathf } from '../base/math.js';
import { Weapon } from '../entities/weapon.js';
import { Random } from '../base/random.js';
import { SerialAction } from '../base/actions/serialAction.js';
import { Direction } from '../base/dir.js';
import { SpawnAction } from './spawn.js';
import { XForm } from '../base/xform.js';
import { Projectile } from '../entities/projectile.js';
import { Generator } from '../base/generator.js';
import { ThrowToAction } from './throw.js';
import { DestroyTargetAction } from '../base/actions/destroy.js';

class Attack {

    static getWeaponProficiency(actor, weapon) {
        let xps = actor.weaponxps || {};
        let kind = weapon.kind || Weapon.dfltKind;
        let xp = xps[kind] || 1;
        // arbitrary number here to calculate proficiency from xp
        // -- this gives a proficiency of 100 at xp of 1000... may need to tweak this...
        let prof = Math.min(100, Math.floor(Math.pow(xp, 1/1.5)));
        return prof;
    }
    static computeWeaponProfiencyWeight(wpnp) {
        if (wpnp < 50) {
            return 1;
        } else if (wpnp < 90) {
            return 2;
        } else {
            return 3;
        }
    }

    /**
     * determine if attack from actor can hit target w/ given weapon
     * Rules:
     * - an attack should always have a chance to hit and a chance to miss
     * - an attack can cause a critical hit
     * - an attack compares a hit value vs. a defense value (hit>defense the attack succeeds)
     * - hit factors: weapon accuracy, weapon proficiency, weapon agility/strength requirements, +/- accuracy actor effects (blindness, awareness, etc.)
     * - defense factors: target defense rating, +/- target awareness effects (surprise, blindess, etc.)
     *   - armor lowers defense rating (more bulky, more easy to hit) but
     * - how to handle dodge, block, glance, parry, crit?
     * @param {*} actor 
     * @param {*} target 
     * @param {*} weapon 
     */
    static hit(actor, target, weapon) {
        // compute actor attack rating
        let atkr = 0;
        if (actor.attackRating) {
            atkr = actor.attackRating;
        } else {
            let atkw = 0;
            let atkt = 0;
            // -- weapon proficiency
            let wpnp = this.getWeaponProficiency(actor, weapon);
            let wpnw = this.computeWeaponProfiencyWeight(wpnp);
            atkt += wpnp*wpnw;
            atkw += wpnw;
            // -- spry
            let spry = actor.spry || 1;
            atkt += spry*4;
            atkw += 1;
            // attack rating is weight-based average
            atkr = Math.round(atkt/atkw);
        }
        // apply attack bonuses/penalties
        let lvld = Mathf.clamp((actor.lvl || 10) - (target.lvl || 5), -5, 5);
        // -- level differential
        atkr += lvld*5;
        // -- hit bonus/penalty
        let hitbp = actor.hitbp || 0;
        atkr += hitbp;
        // -- strength to wield
        if (weapon) {
            let brawn = actor.brawn || 1;
            let wpnBrawn = weapon.brawn || 1;
            if (wpnBrawn > brawn) {
                let diff = Math.min(wpnBrawn-brawn, 4);
                let penalty = diff*diff*5;
                atkr -= penalty;
            }
        }
        // -- clamp to attack rating range
        atkr = Mathf.clamp(atkr, 1, 100);

        // compute target defense rating
        let defr = 0;
        if (target.defenseRating) {
            defr = target.defenseRating;
        } else {
            let defw = 0;
            let deft = 0;
            // -- spry (1-25)
            let tspry = target.spry || 1;     // target spryness
            deft += tspry*4;
            defw += 1;
            // -- block rating (1-100)
            let blkr = target.blockRating || 1;     // block
            deft += blkr;
            defw += 1;
            // defense rating is weight-based average
            defr = Math.round(deft/defw);
        }
        // apply defense bonuses/penalties
        defr -= lvld*5;
        defr = Math.max(1,defr);

        // compute attack roll
        let atkRolls = actor.attackRolls || 1;
        let batk = 0;
        for (let i=0; i<atkRolls; i++) {
            let roll = Mathf.distSample(1, atkr, 100);
            if (roll > batk) batk = roll;
        }

        // compute defense roll
        let defRolls = target.defenseRolls || 1;
        let bdef = 0;
        for (let i=0; i<defRolls; i++) {
            let roll = Mathf.distSample(1, defr, 100);
            if (roll > bdef) bdef = roll;
        }

        //console.log(`${(batk>bdef) ? "== HIT" : "-- miss"}, atkr: ${atkr} defr: ${defr} lvld: ${lvld} batk: ${batk} bdef: ${bdef}`);

        // hit compares attack vs. defense
        return batk>bdef;
    }

    static damage(actor, target, weapon) {
        // roll for base damage
        let min = (weapon) ? weapon.damageMin : actor.damageMin || 1;
        let max = (weapon) ? weapon.damageMax : actor.damageMax || 1;
        let baseDamage = Random.rangeInt(min, max);
        let damageReduction = target.damageReduction || 0;
        let kind = ((weapon) ? weapon.kind : actor.attackKind) || 'bonk';
        let resistance = (target.resistances) ? target.resistances[kind] || 0 : 0;
        // -- damage reduction is taken off the top
        let damage = baseDamage - damageReduction;
        // -- damage resistance is a percent reduction
        if (resistance) {
            let v = Math.round(damage * resistance);
            damage -= v;
        }
        if (damage < 0) damage = 0;
        console.log(`== damage: base: [${min}-${max}]:${baseDamage} final: ${damage}`);
        return damage;
    }
    
}

class AttackRollAction extends Action {
    static dfltTTL = 100;
    constructor(spec) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || this.constructor.dfltTTL;
    }

    setup() {
        this.timer = new Timer({ttl: this.ttl, cb: () => this.finish() });
        let weapon = this.actor.weapon;
        // roll for hit
        let hit = Attack.hit(this.actor, this.target, weapon);
        if (hit) {
            this.actor.evt.trigger(this.actor.constructor.evtAttacked, { actor: this.actor, target: this.target, weapon: weapon });
            let damage = Attack.damage(this.actor, this.target, weapon);
            if (damage) {
                this.target.evt.trigger(this.target.constructor.evtDamaged, { actor: this.actor, target: this.target, damage: damage });
            }
        }
    }
}

class MeleeAttackAction extends SerialAction {
    static dfltTTL = 100;
    static dfltNudge = 8;
    static dfltNudgeSpeed = .05;
    static dfltNudgeAccel = .001;

    constructor(spec) {
        super(spec);
        this.target = spec.target;
        this.nudge = spec.nudge || this.constructor.dfltNudge;
        this.nudgeSpeed = spec.nudgeSpeed || this.constructor.dfltNudgeSpeed;
        this.nudgeAccel = spec.nudgeAccel || this.constructor.dfltNudgeAccel;
        this.ttl = spec.ttl || this.constructor.dfltTTL;
    }

    destroy() {
        if (!this.done) this.ok = false;
        if (this.timer) this.timer.destroy();
    }

    // METHODS -------------------------------------------------------------
    setup() {
        if (this.dbg) console.log(`starting ${this} action w ttl: ${this.ttl}`);
        // -- nudge towards target
        if (this.nudge) {
            let angle = Mathf.angle(this.actor.xform.x, this.actor.xform.y, this.target.xform.x, this.target.xform.y, true);
            let x = Math.round(this.actor.xform.x + Math.cos(angle) * this.nudge);
            let y = Math.round(this.actor.xform.y + Math.sin(angle) * this.nudge);
            let facing = (x > this.actor.xform.x) ? Direction.east : (x < this.actor.xform.x) ? Direction.west : 0;
            this.subs.push( new MoveAction({
                x: x,
                y: y,
                speed: this.nudgeSpeed,
                accel: this.nudgeAccel,
                range: 2,
                stopAtTarget: true,
                snap: true,
                facing: facing,
            }));
        }
        this.subs.push( new AttackRollAction({
            target: this.target,
            ttl: this.ttl,
        }));

        if (this.nudge) {
            this.subs.push( new MoveAction({
                x: this.actor.xform.x,
                y: this.actor.xform.y,
                speed: this.nudgeSpeed,
                accel: this.nudgeAccel,
                range: 2,
                stopAtTarget: true,
                snap: true,
            }));
        }
    }
}

class RangeAttackRollAction extends Action {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec) {
        super(spec);
        this.weapon = spec.weapon;
        this.target = spec.target;
    }

    // METHODS -------------------------------------------------------------
    setup() {
        // this is an instant action
        this.done = true;
        //this.actor.evt.trigger(this.actor.constructor.evtAttacked, { actor: this.actor, target: this.target, weapon: weapon });
        // -- roll for damage
        let damage = Attack.damage(this.actor, this.target, this.weapon);
        console.log(`${this} damage ${damage}`);
        if (damage) {
            this.target.evt.trigger(this.target.constructor.evtDamaged, { actor: this.actor, target: this.target, damage: damage });
        }
    }
}

class RangeAttackAction extends SerialAction {
    static dfltTTL = 100;
    static dfltNudge = 8;
    static dfltNudgeSpeed = .05;
    static dfltNudgeAccel = .001;

    constructor(spec) {
        super(spec);
        this.target = spec.target;
        this.weapon = spec.weapon;
        this.nudge = spec.nudge || this.constructor.dfltNudge;
        this.nudgeSpeed = spec.nudgeSpeed || this.constructor.dfltNudgeSpeed;
        this.nudgeAccel = spec.nudgeAccel || this.constructor.dfltNudgeAccel;
        this.ttl = spec.ttl || this.constructor.dfltTTL;
        this.projectileSpec = spec.projectileSpec || Projectile.xspec();
        this.shootsfx = spec.shootsfx;
        this.hitsfx = spec.hitsfx;
    }

    destroy() {
        if (!this.done) this.ok = false;
        if (this.timer) this.timer.destroy();
    }

    // METHODS -------------------------------------------------------------
    setup() {
        if (this.dbg) console.log(`starting ${this} action w ttl: ${this.ttl}`);
        // -- nudge towards target
        if (this.nudge) {
            let angle = Mathf.angle(this.actor.xform.x, this.actor.xform.y, this.target.xform.x, this.target.xform.y, true);
            let x = Math.round(this.actor.xform.x + Math.cos(angle) * this.nudge);
            let y = Math.round(this.actor.xform.y + Math.sin(angle) * this.nudge);
            let facing = (x > this.actor.xform.x) ? Direction.east : (x < this.actor.xform.x) ? Direction.west : 0;
            this.subs.push( new MoveAction({
                x: x,
                y: y,
                speed: this.nudgeSpeed,
                accel: this.nudgeAccel,
                range: 2,
                stopAtTarget: true,
                snap: true,
                facing: facing,
            }));
        }

        // -- spawn the projectile
        let projectile = Generator.generate(this.projectileSpec);
        this.subs.push(new SpawnAction({
            target: this.actor,
            spawn: projectile,
            sfx: this.shootsfx,
            z: 3,
        }));

        // -- move to target
        this.subs.push( new ThrowToAction({
            item: projectile,
            x: this.target.xform.x,
            y: this.target.xform.y,
            idx: this.target.idx,
            throwsfx: null,
            hitsfx: this.hitsfx,
        }));

        this.subs.push( new RangeAttackRollAction({
            target: this.target,
            weapon: this.weapon,
        }));

        if (this.nudge) {
            this.subs.push( new MoveAction({
                x: this.actor.xform.x,
                y: this.actor.xform.y,
                speed: this.nudgeSpeed,
                accel: this.nudgeAccel,
                range: 2,
                stopAtTarget: true,
                snap: true,
            }));
        }

        // -- destroy projectile
        this.subs.push( new DestroyTargetAction({
            target: projectile,
        }));
    }
}