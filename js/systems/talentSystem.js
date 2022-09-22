export { TalentSystem };

import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { System } from '../base/system.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { BonkersCharm } from '../charms/bonkers.js';
import { Charm } from '../charms/charm.js';
import { DarknessCharm } from '../charms/darkness.js';
import { EfficiencyCharm } from '../charms/efficiency.js';
import { FrostyCharm } from '../charms/frosty.js';
import { FuegoCharm } from '../charms/fuego.js';
import { HacketyCharm } from '../charms/hackety.js';
import { PointyCharm } from '../charms/pointy.js';
import { PowerageCharm } from '../charms/powerage.js';
import { ShieldCharm } from '../charms/shield.js';
import { ShockingCharm } from '../charms/shocking.js';

class TalentSystem extends System {
    static talents = {
        // -- TIER 1
        golddigger: {
            tag: 'golddigger',
            tier: 1,
            name: 'gold digger',
            description: 'when defeating enemies loot more gold (10/20/30%)',
        },
        efficiency: {
            tag: 'efficiency',
            tier: 1,
            name: 'efficiency',
            description: 'when at max health, player is more efficient, burning less fuel (10/20/30%)',
        },
        shielding: {
            tag: 'shielding',
            tier: 1,
            name: 'critical shielding',
            description: 'when landing a critical hit, add shielding that blocks all damage (5/10/15 damage)',
        },
        gems: {
            tag: 'gems',
            tier: 1,
            name: 'good gems',
            description: 'whenever the player consumes a gem, player is healed (5/10/15 damage)',
        },

        // -- TIER 2
        bonkers: {
            tag: 'bonkers',
            tier: 2,
            name: 'bonkers',
            description: 'adds bonus damage for any bonk weapons (5/10/15 damage)',
        },
        pointy: {
            tag: 'pointy',
            tier: 2,
            name: 'straight to the pointy',
            description: 'adds bonus critical hit chance for any poke weapons (5/10/15%)',
        },
        hackety: {
            tag: 'hackety',
            tier: 2,
            name: 'hackety hack hack',
            description: 'adds bonus hit chance for any hack weapons (5/10/15%)',
        },
        powerage: {
            tag: 'powerage',
            tier: 2,
            name: 'maxx powerage',
            description: 'when at max health, player power regenerates faster (10/20/30%)',
        },

        // -- TIER 3
        frosty: {
            tag: 'frosty',
            tier: 3,
            name: 'frosty',
            description: 'player resistance to ice damage increases (10/20/30%)',
        },
        fuego: {
            tag: 'fuego',
            tier: 3,
            name: 'fuego',
            description: 'player resistance to fire damage increases (10/20/30%)',
        },
        shocking: {
            tag: 'shocking',
            tier: 3,
            name: 'shocking',
            description: 'player resistance to shock damage increases (10/20/30%)',
        },
        darkness: {
            tag: 'darkness',
            tier: 3,
            name: 'Hello Darkness',
            description: 'player resistance to dark damage increases (10/20/30%)',
        },

    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.player;
        this.current = {};
        this.unspent = 0;
        this.onPlayerUpdate = this.onPlayerUpdate.bind(this);
        this.onCharacterDamaged = this.onCharacterDamaged.bind(this);
        this.onItemUsed = this.onItemUsed.bind(this);
        this.onEquipChanged = this.onEquipChanged.bind(this);
        Events.listen('character.damaged', this.onCharacterDamaged);
        Events.listen('item.use', this.onItemUsed);
        Events.listen('equip.changed', this.onEquipChanged);
    }
    destroy() {
        super.destroy();
        if (this.player) this.player.evt.ignore(this.player.constructor.evtUpdated, this.onPlayerUpdate);
        Events.ignore('character.damaged', this.onCharacterDamaged);
        Events.ignore('item.use', this.onItemUsed);
        Events.ignore('equip.changed', this.onEquipChanged);
    }

    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        // overrides instead of building onto super method as we really only care about system specific data here
        return {
            cls: this.cls,
            current: this.current,
            unspent: this.unspent,
        }
    }
    load(spec) {
        this.current = Object.assign({}, spec.current);
        this.unspent = spec.unspent;
    }

    // EVENT HANDLERS ------------------------------------------------------
    onEntityAdded(evt) {
        if (evt.actor && evt.actor.cls === 'Player') {
            this.player = evt.actor;
            this.player.evt.listen(this.player.constructor.evtUpdated, this.onPlayerUpdate);
            console.log(`-- ${this} player emerged: ${this.player}`);
            this.applyPlayerBuffs();
        }
        // -- GOLDDIGGER implementation
        if (evt.actor && evt.actor.cls === 'Token') {
            let loot = evt.actor;
            if (this.current.golddigger) {
                let lvl = this.current.golddigger || 0;
                let bonus = Math.round((loot.count * lvl)/10);
                if (this.dbg) console.log(`-- ${this} golddigger bonus: ${bonus}`);
                loot.count += bonus;
            }
        }
    }

    onCharacterDamaged(evt) {
        console.log(`onCharacterDamaged: ${Fmt.ofmt(evt)}`);
        if (evt.actor !== this.player) return;
        if (evt.critical && this.current.shielding) {
            this.addShieldCharm();
        }
    }

    onPlayerUpdate(evt) {
        // check for player health updates
        if (evt.update && evt.update.health) {
            if (this.current.efficiency && this.player.health === this.player.healthMax) {
                this.addEfficiencyCharm();
            }
            if (this.current.powerage && this.player.health === this.player.healthMax) {
                this.addPowerageCharm();
            }
        }
        if (evt.update && evt.update.lvl) {
            this.unspent++;
            this.evt.trigger('talents.updated', { update: { unspent: this.unspent }}, true);
        }
    }

    onItemUsed(evt) {
        // -- GEMS implementation
        if (this.current.gems && evt.actor && evt.actor.cls === 'Gem') {
            let actor = this.player;
            let amt = this.current.gems * 5;
            let health = Math.min(actor.healthMax, actor.health+amt);
            if (health !== actor.health) {
                console.log(`-- setting player health: ${health}`);
                UpdateSystem.eUpdate(actor, {health: health });
            }
        }
    }

    onEquipChanged(evt) {
        console.log(`${this} onEquipChanged: ${Fmt.ofmt(evt)}`);
        if (evt.actor !== this.player) return;
        if (evt.slot !== 'weapon') return;
        if (!evt.target) return;
        if (evt.target.kind === 'bonk' && this.current.bonkers) {
            this.addBonkersCharm();
        }
        if (evt.target.kind === 'poke' && this.current.pointy) {
            this.addPointyCharm();
        }
        if (evt.target.kind === 'hack' && this.current.hackety) {
            this.addHacketyCharm();
        }
    }

    // METHODS -------------------------------------------------------------
    levelUp(talent) {
        let tag = talent.tag;
        if (!this.unspent) {
            console.error(`attempted to level up talent ${tag} without unspent points`);
            return;
        }
        if (this.current[tag] >= 3) {
            console.error(`attempted to level up talent ${tag} past max`);
            return;
        }
        // update current level
        console.log(`current level: ${this.current[tag]}`);
        this.current[tag] = (this.current[tag] || 0) + 1;
        console.log(`new level: ${this.current[tag]}`);
        // decrement unspent points
        this.unspent--;
        this.evt.trigger('talents.updated', { update: { unspent: this.unspent }}, true);
        // reapply player buffs
        this.applyPlayerBuffs();
    }

    addShieldCharm() {
        let lvl = this.current.shielding;
        let amt = 5*lvl;
        let oldCharm = Charm.find(this.player, 'ShieldCharm');
        if (oldCharm) {
            oldCharm.replenish('critical', amt);
        } else {
            let charm = new ShieldCharm({ tag: 'critical', amounts: {'critical': amt} });
            console.log(`linking charm: ${charm}`);
            charm.link(this.player);
        }
    }

    addEfficiencyCharm() {
        let lvl = this.current.efficiency;
        let oldCharm = Charm.find(this.player, 'EfficiencyCharm');
        if (oldCharm) {
            if (oldCharm.lvl !== lvl) {
                oldCharm.unlink();
            } else {
                return;
            }
        }
        let charm = new EfficiencyCharm({ lvl: lvl});
        console.log(`linking charm: ${charm}`);
        charm.link(this.player);
    }

    addPowerageCharm() {
        let lvl = this.current.powerage;
        let oldCharm = Charm.find(this.player, 'PowerageCharm');
        if (oldCharm) {
            if (oldCharm.lvl !== lvl) {
                oldCharm.unlink();
            } else {
                return;
            }
        }
        let charm = new PowerageCharm({ lvl: lvl });
        console.log(`linking charm: ${charm}`);
        charm.link(this.player);
    }

    addBonkersCharm() {
        let lvl = this.current.bonkers;
        let oldCharm = Charm.find(this.player, 'BonkersCharm');
        if (oldCharm) {
            if (oldCharm.lvl !== lvl) {
                oldCharm.unlink();
            } else {
                return;
            }
        }
        let charm = new BonkersCharm({ lvl: lvl });
        console.log(`linking charm: ${charm}`);
        charm.link(this.player);
    }

    addPointyCharm() {
        let lvl = this.current.pointy;
        let oldCharm = Charm.find(this.player, 'PointyCharm');
        if (oldCharm) {
            if (oldCharm.lvl !== lvl) {
                oldCharm.unlink();
            } else {
                return;
            }
        }
        let charm = new PointyCharm({ lvl: lvl });
        console.log(`linking charm: ${charm}`);
        charm.link(this.player);
    }

    addHacketyCharm() {
        let lvl = this.current.hackety;
        let oldCharm = Charm.find(this.player, 'HacketyCharm');
        if (oldCharm) {
            if (oldCharm.lvl !== lvl) {
                oldCharm.unlink();
            } else {
                return;
            }
        }
        let charm = new HacketyCharm({ lvl: lvl });
        console.log(`linking charm: ${charm}`);
        charm.link(this.player);
    }

    addFrostyCharm() {
        let lvl = this.current.frosty;
        let oldCharm = Charm.find(this.player, 'FrostyCharm');
        if (oldCharm) {
            if (oldCharm.lvl !== lvl) {
                oldCharm.unlink();
            } else {
                return;
            }
        }
        let charm = new HacketyCharm({ lvl: lvl });
        console.log(`linking charm: ${charm}`);
        charm.link(this.player);
    }

    addCharm(lvl, cls) {
        let oldCharm = Charm.find(this.player, cls.constructor.name);
        if (oldCharm) {
            if (oldCharm.lvl !== lvl) {
                oldCharm.unlink();
            } else {
                return;
            }
        }
        let charm = new cls({ lvl: lvl });
        console.log(`linking charm: ${charm}`);
        charm.link(this.player);
    }

    applyPlayerBuffs() {
        // player at max health?
        if (this.player.health === this.player.healthMax) {
            // EFFICIENCY implementation
            if (this.current.efficiency) {
                this.addEfficiencyCharm();
            }
            // POWERAGE implementation
            if (this.current.powerage) {
                this.addPowerageCharm();
            }
        }
        if (this.player.inventory && this.player.inventory.weapon && this.player.inventory.weapon.kind === 'bonk') {
            // BONKERS implementation
            if (this.current.bonkers) {
                this.addBonkersCharm();
            }
        }
        if (this.player.inventory && this.player.inventory.weapon && this.player.inventory.weapon.kind === 'poke') {
            // BONKERS implementation
            if (this.current.pointy) {
                this.addPointyCharm();
            }
        }
        if (this.player.inventory && this.player.inventory.weapon && this.player.inventory.weapon.kind === 'hack') {
            // BONKERS implementation
            if (this.current.pointy) {
                this.addHacketyCharm();
            }
        }

        // FROSTY implementation
        if (this.current.frosty) {
            this.addCharm(this.current.frosty, FrostyCharm);
        }
        // FUEGO implementation
        if (this.current.fuego) {
            this.addCharm(this.current.fuego, FuegoCharm);
        }
        // SHOCKING implementation
        if (this.current.shocking) {
            this.addCharm(this.current.shocking, ShockingCharm);
        }
        // DARKNESS implementation
        if (this.current.darkness) {
            this.addCharm(this.current.darkness, DarknessCharm);
        }

    }

}