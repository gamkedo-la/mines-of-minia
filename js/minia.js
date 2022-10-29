export { Minia };


import { Fmt } from "./base/fmt.js";
import { Game } from "./base/game.js";
import { RenderSystem } from "./base/systems/renderSystem.js";
import { Config } from "./base/config.js";
import { Util } from './base/util.js';
import { Registry } from './base/registry.js';
import { TitleState } from './titleState.js';
import { FiddleState } from './fiddleState.js';
import { Systems } from './base/system.js';
import { TestProcState } from "./testProcState.js";
import { PlayState } from "./playState.js";
import { TestNoiseState } from "./testNoiseState.js";
import { Tile } from "./entities/tile.js";
import { Level } from "./level.js";
import { Enemy } from "./entities/enemy.js";
import { Character } from "./entities/character.js";
import { Weapon } from "./entities/weapon.js";
import { miniaAssets } from "./assets.js";
import { Player } from "./entities/player.js";
import { Stairs } from "./entities/stairs.js";
import { Rous } from "./entities/rous.js";
import { Door } from "./entities/door.js";
import { Inventory, InventoryData } from "./inventory.js";
import { Gem } from "./entities/gem.js";
import { Node } from "./entities/node.js";
import { Shielding } from "./entities/shielding.js";
import { Cog } from "./entities/cog.js";
import { Key } from "./entities/key.js";
import { Token } from "./entities/token.js";
import { Reactor } from "./entities/reactor.js";
import { Gadget } from "./entities/gadget.js";
import { Chest } from "./entities/chest.js";
import { Fuelcell } from "./entities/fuelcell.js";
import { Font } from "./base/font.js";
import { Golem } from "./entities/golem.js";
import { Hud } from "./hud.js";
import { RangedWeapon } from "./entities/rangedWeapon.js";
import { Projectile } from "./entities/projectile.js";
import { Funguy } from "./entities/funguy.js";
import { Trap } from "./entities/trap.js";
import { SpikeTrap } from "./entities/spikeTrap.js";
import { Growth } from "./entities/growth.js";
import { Clutter } from "./entities/clutter.js";
import { Prompt } from "./prompt.js";
import { Magma } from "./entities/magma.js";
import { MenuState } from "./menuState.js";
import { AudioSystem } from "./base/systems/audioSystem.js";
import { Facade } from "./entities/facade.js";
import { Machinery } from "./entities/machinery.js";
import { Energy } from "./entities/energy.js";
import { MiniaTemplates } from "./procgen/templates.js";
import { RagingBull } from "./entities/ragingBull.js";
import { StealthBot } from "./entities/stealthBot.js";
import { ThumpBot } from "./entities/thumpBot.js";
import { Bomb } from "./entities/bomb.js";
import { Reticle } from "./entities/reticle.js";
import { Overbearer } from "./entities/overbearer.js";
import { Scarab } from "./entities/scarab.js";
import { Talents } from "./talents.js";
import { Dummy } from "./entities/dummy.js";
import { Pillar } from "./entities/pillar.js";
import { Slimer } from "./entities/slimer.js";
import { BonkersCharm } from "./charms/bonkers.js";
import { BooCharm } from "./charms/boo.js";
import { Charm } from "./charms/charm.js";
import { DarknessCharm } from "./charms/darkness.js";
import { DazedCharm } from "./charms/dazed.js";
import { EfficiencyCharm } from "./charms/efficiency.js";
import { EnflamedCharm } from "./charms/enflamed.js";
import { FieryCharm } from "./charms/fiery.js";
import { FrostyCharm } from "./charms/frosty.js";
import { FrozenCharm } from "./charms/frozen.js";
import { FuegoCharm } from "./charms/fuego.js";
import { HacketyCharm } from "./charms/hackety.js";
import { InvulnerabilityCharm } from "./charms/invulnerability.js";
import { PointyCharm } from "./charms/pointy.js";
import { PoisonCharm } from "./charms/poison.js";
import { PoisonedCharm } from "./charms/poisoned.js";
import { PowerageCharm } from "./charms/powerage.js";
import { ShieldCharm } from "./charms/shield.js";
import { ShockingCharm } from "./charms/shocking.js";
import { StealthCharm } from "./charms/stealth.js";
import { DrainCharm } from "./charms/drain.js";


class Minia extends Game {
    static states = {
        'title': new TitleState(),
        'menu': new MenuState(),
        'play': new PlayState(),
        // -- test states
        'fiddle': new FiddleState(),
        'testproc': new TestProcState(),
        'testnoise': new TestNoiseState(),
    }
    static startStateTag = 'title';
    static assetRefs = miniaAssets;

    static config = {
        dbg: {
            system: {
                los: {
                    console: false,
                },
                ctrl: false,
                update: false,
                mouse: false,
                render: false,
                move: true,
                aggro: false,
                turn: true,
                close: false,
            },
            keys: false,
        },
        losEnabled: true,
        fowEnabled: true,
        tileSize: 16,
        scale: 4,
        maxLvl: 21,

        //template: MiniaTemplates.rockBoss,
        template: MiniaTemplates.bioLvl.copy(),
    };

    static init() {
        console.log(`${this.name}.init`);
        Registry.extend([
            Bomb,
            BonkersCharm,
            BooCharm,
            Character,
            Charm,
            Chest,
            Clutter,
            Cog,
            DarknessCharm,
            DazedCharm,
            Door,
            DrainCharm,
            Dummy,
            EfficiencyCharm,
            Enemy,
            EnflamedCharm,
            Energy,
            Facade,
            FieryCharm,
            FrostyCharm,
            FrozenCharm,
            FuegoCharm,
            Fuelcell,
            Funguy,
            Gadget,
            Gem,
            Golem,
            Growth,
            HacketyCharm,
            Hud,
            Key,
            Inventory,
            InventoryData,
            InvulnerabilityCharm,
            Level,
            Machinery,
            Magma,
            Node,
            Overbearer,
            Pillar,
            Player,
            PointyCharm,
            PoisonCharm,
            PoisonedCharm,
            PowerageCharm,
            Projectile,
            Prompt,
            RagingBull,
            RangedWeapon,
            Reactor,
            Reticle,
            Rous,
            Scarab,
            ShieldCharm,
            Shielding,
            ShockingCharm,
            Slimer,
            SpikeTrap,
            Stairs,
            StealthBot,
            StealthCharm,
            Talents,
            Tile,
            ThumpBot,
            Token,
            Trap,
            Weapon,
        ]);
        //Font.dfltFamily = "Medula One";
        Font.dfltFamily = "Gugi";
        //Font.dfltFamily = "Rubik Moonrocks";
        //Font.dfltFamily = "Aldrich";
        AudioSystem.createChannel('sfx');
        AudioSystem.createChannel('music');
    }

    static ready() {
        // -- global game systems (run for all game states)
        Systems.add('render', new RenderSystem({dbg: Util.getpath(Config, 'dbg.system.render')}));
    }

    static onTock(evt) {
        //Stats.count('game.tock')
        //Stats.update(evt);
    }
}