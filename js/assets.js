export { miniaAssets };

import { Animation, Cel } from './base/animation.js';
import { Animator } from './base/animator.js';
import { AssetRef, SheetRef, ImageRef, SfxRef } from './base/assets.js';
import { Rect } from './base/rect.js';
import { Sfx } from './base/sfx.js';
import { Shape } from './base/shape.js';
import { Sketch } from './base/sketch.js';
import { Sprite } from './base/sprite.js';
import { StretchSprite } from './base/stretchSprite.js';
import { Resurrect64 } from './resurrect64.js';
import { Template } from './template.js';

let miniaAssets = [

    Shape.xspec({
        tag: 'projectile.fire',
        fill: true,
        verts: [ {x:7, y:7}, {x:9, y:7}, {x:9, y:9}, {x:7, y:9} ],
        border: 1,
        color: 'orange',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'projectile.dark',
        fill: true,
        verts: [ {x:7, y:7}, {x:9, y:7}, {x:9, y:9}, {x:7, y:9} ],
        border: 1,
        color: 'purple',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'projectile.ice',
        fill: true,
        verts: [ {x:7, y:7}, {x:9, y:7}, {x:9, y:9}, {x:7, y:9} ],
        border: 1,
        color: 'aqua',
        borderColor: 'red',
    }),


    Shape.xspec({
        tag: 'projectile.shock',
        fill: true,
        verts: [ {x:7, y:7}, {x:9, y:7}, {x:9, y:9}, {x:7, y:9} ],
        border: 1,
        color: 'white',
        borderColor: 'red',
    }),

    Sprite.xspec({tag: 'stairs_down', img: new SheetRef({src: 'img/stairs.png', width: 16, height: 16, x: 2, y: 12})}),
    Sprite.xspec({tag: 'stairs_up', img: new SheetRef({src: 'img/stairs.png', width: 17, height: 19, x: 20, y: 8})}),

    Rect.xspec({tag: 'reticle.aim.ok', width: 12, height: 12, borderColor: 'green', border: 1, fill: false}),
    Rect.xspec({tag: 'reticle.aim.nok', width: 12, height: 12, borderColor: 'red', border: 1, fill: false}),

    Rect.xspec({tag: 'oframe.red', width: 16, height: 16, color: 'black', borderColor: 'red', border: 3}),
    Rect.xspec({tag: 'frame.red', width: 16, height: 16, borderColor: 'red', border: 3, fill: false}),
    Rect.xspec({tag: 'frame.red.2', width: 16, height: 16, borderColor: 'red', border: 6, fill: false}),
    Rect.xspec({tag: 'frame.blue', width: 16, height: 16, borderColor: 'blue', border: 3, fill: false}),
    Rect.xspec({tag: 'frame.blue.2', width: 16, height: 16, borderColor: 'blue', border: 6, fill: false}),
    Rect.xspec({tag: 'frame.yellow', width: 16, height: 16, borderColor: 'yellow', border: 3, fill: false}),
    Rect.xspec({tag: 'frame.yellow.2', width: 16, height: 16, borderColor: 'yellow', border: 6, fill: false}),
    Rect.xspec({tag: 'frame.green', width: 16, height: 16, borderColor: 'green', border: 3, fill: false}),
    Rect.xspec({tag: 'frame.green.2', width: 16, height: 16, borderColor: 'green', border: 6, fill: false}),


    Animator.xspec({
        tag: 'trap.test',
        sketches: {
            'armed': new Rect({ width: 10, height: 10, borderColor: 'rgba(255,255,0,.75)', fill: false, border: 1 }),
            'inactive': new Rect({ width: 10, height: 10, borderColor: 'rgba(127,127,127,.75)', fill: false, border: 1 }),
        },
        state: 'armed',
    }),

    Animator.xspec({
        tag: 'growth.test',
        sketches: {
            'armed': new Rect({ width: 10, height: 10, borderColor: 'rgba(0,150,0,.75)', fill: false, border: 1 }),
            'inactive': new Rect({ width: 10, height: 10, borderColor: 'rgba(127,127,127,.75)', fill: false, border: 1 }),
        },
        state: 'armed',
    }),

    Animation.xspec({tag: 'reactor.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'reactor.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'reactor.1',
        x_sketches: {
            'carry': new AssetRef({tag: 'reactor.1.carry'}),
            'free': new AssetRef({tag: 'reactor.1.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'reactor.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'reactor.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'reactor.2',
        x_sketches: {
            'carry': new AssetRef({tag: 'reactor.2.carry'}),
            'free': new AssetRef({tag: 'reactor.2.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'reactor.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'reactor.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'reactor.3',
        x_sketches: {
            'carry': new AssetRef({tag: 'reactor.3.carry'}),
            'free': new AssetRef({tag: 'reactor.3.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'poke.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*9, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'poke.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*9, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'poke.1',
        x_sketches: {
            'carry': new AssetRef({tag: 'poke.1.carry'}),
            'free': new AssetRef({tag: 'poke.1.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'poke.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*10, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'poke.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*10, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'poke.2',
        x_sketches: {
            'carry': new AssetRef({tag: 'poke.2.carry'}),
            'free': new AssetRef({tag: 'poke.2.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'poke.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*11, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'poke.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*11, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'poke.3',
        x_sketches: {
            'carry': new AssetRef({tag: 'poke.3.carry'}),
            'free': new AssetRef({tag: 'poke.3.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'hack.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*9, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'hack.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*9, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'hack.1',
        x_sketches: {
            'carry': new AssetRef({tag: 'hack.1.carry'}),
            'free': new AssetRef({tag: 'hack.1.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'hack.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*10, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'hack.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*10, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'hack.2',
        x_sketches: {
            'carry': new AssetRef({tag: 'hack.2.carry'}),
            'free': new AssetRef({tag: 'hack.2.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'hack.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*11, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'hack.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*11, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'hack.3',
        x_sketches: {
            'carry': new AssetRef({tag: 'hack.3.carry'}),
            'free': new AssetRef({tag: 'hack.3.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'bonk.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bonk-weapon.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
    ]}),
    Animation.xspec({tag: 'bonk.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bonk-weapon.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'bonk.2',
        x_sketches: {
            'carry': new AssetRef({tag: 'bonk.2.carry'}),
            'free': new AssetRef({tag: 'bonk.2.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'bonk.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bonk-weapon.png', width: 16, height: 16, x: 16, y: 0})}), ttl: 150 }),
    ]}),
    Animation.xspec({tag: 'bonk.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bonk-weapon.png', width: 16, height: 32, x: 16, y: 16})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'bonk.1',
        x_sketches: {
            'carry': new AssetRef({tag: 'bonk.1.carry'}),
            'free': new AssetRef({tag: 'bonk.1.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'bonk.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bonk-weapon.png', width: 16, height: 16, x: 32, y: 0})}), ttl: 150 }),
    ]}),
    Animation.xspec({tag: 'bonk.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bonk-weapon.png', width: 16, height: 32, x: 32, y: 16})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'bonk.3',
        x_sketches: {
            'carry': new AssetRef({tag: 'bonk.3.carry'}),
            'free': new AssetRef({tag: 'bonk.3.free'}),
        },
        state: 'free',
    }),

    Sprite.xspec({tag: 'chest.brown.close', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*0, y: 0})}),
    Sprite.xspec({tag: 'chest.brown.open', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*1, y: 0})}),
    Animation.xspec({tag: 'chest.brown.opening', loop: false, x_cels: [
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.brown.open'}), ttl: 300 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.brown.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.brown.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'chest.brown',
        x_sketches: {
            'close': new AssetRef({tag: 'chest.brown.close'}),
            'open': new AssetRef({tag: 'chest.brown.opening'}),
        },
        state: 'close',
    }),

    Sprite.xspec({tag: 'chest.blue.close', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*0, y: 32})}),
    Sprite.xspec({tag: 'chest.blue.open', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*1, y: 32})}),
    Animation.xspec({tag: 'chest.blue.opening', loop: false, x_cels: [
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.blue.open'}), ttl: 300 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.blue.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.blue.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'chest.blue',
        x_sketches: {
            'close': new AssetRef({tag: 'chest.blue.close'}),
            'open': new AssetRef({tag: 'chest.blue.opening'}),
        },
        state: 'close',
    }),

    Sprite.xspec({tag: 'chest.dark.close', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*0, y: 64})}),
    Sprite.xspec({tag: 'chest.dark.open', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*1, y: 64})}),
    Animation.xspec({tag: 'chest.dark.opening', loop: false, x_cels: [
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.dark.open'}), ttl: 300 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.dark.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.dark.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'chest.dark',
        x_sketches: {
            'close': new AssetRef({tag: 'chest.dark.close'}),
            'open': new AssetRef({tag: 'chest.dark.opening'}),
        },
        state: 'close',
    }),

    Sprite.xspec({tag: 'chest.green.close', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*0, y: 96})}),
    Sprite.xspec({tag: 'chest.green.open', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*1, y: 96})}),
    Animation.xspec({tag: 'chest.green.opening', loop: false, x_cels: [
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.green.open'}), ttl: 300 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.green.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.green.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'chest.green',
        x_sketches: {
            'close': new AssetRef({tag: 'chest.green.close'}),
            'open': new AssetRef({tag: 'chest.green.opening'}),
        },
        state: 'close',
    }),

    Sprite.xspec({tag: 'key.blue', img: new SheetRef({src: 'img/chest.png', width: 16, height: 16, x: 32, y: 32})}),
    Sprite.xspec({tag: 'key.dark', img: new SheetRef({src: 'img/chest.png', width: 16, height: 16, x: 32, y: 64})}),
    Sprite.xspec({tag: 'key.green', img: new SheetRef({src: 'img/chest.png', width: 16, height: 16, x: 32, y: 96})}),

    Sprite.xspec({tag: 'player_portrait', img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 32*0, y: 0})}),
    Animation.xspec({tag: 'player_idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 0, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'player_idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 250 }),
    ]}),

    Animation.xspec({tag: 'player_mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'player_movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 250 }),
    ]}),
    Animator.xspec({
        tag: 'player',
        x_sketches: {
            'idler': new AssetRef({tag: 'player_idler'}),
            'idlel': new AssetRef({tag: 'player_idlel'}),
            'mover': new AssetRef({tag: 'player_mover'}),
            'movel': new AssetRef({tag: 'player_movel'}),
        },
        state: 'idler',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    Animation.xspec({tag: 'player_idler.s1', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s1.png', width: 16, height: 32, x: 0, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s1.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'player_idlel.s1', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s1.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s1.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'player_mover.s1', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s1.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s1.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'player_movel.s1', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s1.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s1.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 250 }),
    ]}),
    Animator.xspec({
        tag: 'player.s1',
        x_sketches: {
            'idler': new AssetRef({tag: 'player_idler.s1'}),
            'idlel': new AssetRef({tag: 'player_idlel.s1'}),
            'mover': new AssetRef({tag: 'player_mover.s1'}),
            'movel': new AssetRef({tag: 'player_movel.s1'}),
        },
        state: 'idler',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    Animation.xspec({tag: 'player_idler.s2', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s2.png', width: 16, height: 32, x: 0, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s2.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'player_idlel.s2', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s2.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s2.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'player_mover.s2', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s2.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s2.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'player_movel.s2', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s2.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s2.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 250 }),
    ]}),
    Animator.xspec({
        tag: 'player.s2',
        x_sketches: {
            'idler': new AssetRef({tag: 'player_idler.s2'}),
            'idlel': new AssetRef({tag: 'player_idlel.s2'}),
            'mover': new AssetRef({tag: 'player_mover.s2'}),
            'movel': new AssetRef({tag: 'player_movel.s2'}),
        },
        state: 'idler',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    Animation.xspec({tag: 'player_idler.s3', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s3.png', width: 16, height: 32, x: 0, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s3.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'player_idlel.s3', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s3.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s3.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'player_mover.s3', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s3.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s3.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'player_movel.s3', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s3.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player-s3.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 250 }),
    ]}),
    Animator.xspec({
        tag: 'player.s3',
        x_sketches: {
            'idler': new AssetRef({tag: 'player_idler.s3'}),
            'idlel': new AssetRef({tag: 'player_idlel.s3'}),
            'mover': new AssetRef({tag: 'player_mover.s3'}),
            'movel': new AssetRef({tag: 'player_movel.s3'}),
        },
        state: 'idler',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    Animation.xspec({tag: 'golem_idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 0, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'golem_mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*8, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*9, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*10, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*11, y: 0})}), ttl: 50 }),
    ]}),

    Animation.xspec({tag: 'golem_idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*12, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*13, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*14, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*15, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'golem_movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*16, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*17, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*18, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*19, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*20, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*21, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*22, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*23, y: 0})}), ttl: 50 }),
    ]}),

    Animation.xspec({tag: 'golem_dyingr', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*24, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*25, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*26, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*27, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*28, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*29, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*30, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*29, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*30, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*29, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*30, y: 0})}), ttl: 150 }),
    ]}),

    Animation.xspec({tag: 'golem_dyingl', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*31, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*32, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*33, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*34, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*35, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*36, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*37, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*36, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*37, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*36, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*37, y: 0})}), ttl: 150 }),
    ]}),

    Animator.xspec({
        tag: 'golem',
        x_sketches: {
            'idler': new AssetRef({tag: 'golem_idler'}),
            'idlel': new AssetRef({tag: 'golem_idlel'}),
            'mover': new AssetRef({tag: 'golem_mover'}),
            'movel': new AssetRef({tag: 'golem_movel'}),
            'dyingr': new AssetRef({tag: 'golem_dyingr'}),
            'dyingl': new AssetRef({tag: 'golem_dyingl'}),
        },
        state: 'idler',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    Animation.xspec({tag: 'machine.gear', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/brass_cog.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/brass_cog.png', width: 16, height: 16, x: 16, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/brass_cog.png', width: 16, height: 16, x: 32, y: 0})}), ttl: 150 }),
    ]}),

    Template.varsprite('img/crystal-clutter.png', 'machine.crystal', [[0,0], [1,0],[0,1],[1,1],[0,2],[1,2]], {width: 32, height: 32}),

    // -- DOORS
    Sprite.xspec({tag: 'door.ns.brown.close', img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 0, y: 0})}), 
    Animation.xspec({tag: 'door.ns.brown.open', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 0, y: 32*1})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 0, y: 32*2})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 0, y: 32*3})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 0, y: 32*4})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'door.ns.brown',
        x_sketches: {
            'close': new AssetRef({tag: 'door.ns.brown.close'}),
            'open': new AssetRef({tag: 'door.ns.brown.open'}),
        },
        state: 'close',
    }),
    Sprite.xspec({tag: 'door.ew.brown.close', img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*4, y: 0})}), 
    Animation.xspec({tag: 'door.ew.brown.open', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*4, y: 32*1})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*4, y: 32*2})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*4, y: 32*3})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*4, y: 32*4})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'door.ew.brown',
        x_sketches: {
            'close': new AssetRef({tag: 'door.ew.brown.close'}),
            'open': new AssetRef({tag: 'door.ew.brown.open'}),
        },
        state: 'close',
    }),

    Sprite.xspec({tag: 'door.ns.blue.close', img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16, y: 0})}), 
    Animation.xspec({tag: 'door.ns.blue.open', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16, y: 32*1})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16, y: 32*2})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16, y: 32*3})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16, y: 32*4})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'door.ns.blue',
        x_sketches: {
            'close': new AssetRef({tag: 'door.ns.blue.close'}),
            'open': new AssetRef({tag: 'door.ns.blue.open'}),
        },
        state: 'close',
    }),
    Sprite.xspec({tag: 'door.ew.blue.close', img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*5, y: 0})}), 
    Animation.xspec({tag: 'door.ew.blue.open', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*5, y: 32*1})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*5, y: 32*2})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*5, y: 32*3})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*5, y: 32*4})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'door.ew.blue',
        x_sketches: {
            'close': new AssetRef({tag: 'door.ew.blue.close'}),
            'open': new AssetRef({tag: 'door.ew.blue.open'}),
        },
        state: 'close',
    }),

    Sprite.xspec({tag: 'door.ns.dark.close', img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 48, y: 0})}), 
    Animation.xspec({tag: 'door.ns.dark.open', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 48, y: 32*1})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 48, y: 32*2})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 48, y: 32*3})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 48, y: 32*4})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'door.ns.dark',
        x_sketches: {
            'close': new AssetRef({tag: 'door.ns.dark.close'}),
            'open': new AssetRef({tag: 'door.ns.dark.open'}),
        },
        state: 'close',
    }),
    Sprite.xspec({tag: 'door.ew.dark.close', img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*7, y: 0})}), 
    Animation.xspec({tag: 'door.ew.dark.open', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*7, y: 32*1})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*7, y: 32*2})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*7, y: 32*3})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*7, y: 32*4})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'door.ew.dark',
        x_sketches: {
            'close': new AssetRef({tag: 'door.ew.dark.close'}),
            'open': new AssetRef({tag: 'door.ew.dark.open'}),
        },
        state: 'close',
    }),

    Sprite.xspec({tag: 'door.ns.green.close', img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 32, y: 0})}), 
    Animation.xspec({tag: 'door.ns.green.open', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 32, y: 32*1})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 32, y: 32*2})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 32, y: 32*3})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 32, y: 32*4})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'door.ns.green',
        x_sketches: {
            'close': new AssetRef({tag: 'door.ns.green.close'}),
            'open': new AssetRef({tag: 'door.ns.green.open'}),
        },
        state: 'close',
    }),
    Sprite.xspec({tag: 'door.ew.green.close', img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*6, y: 0})}), 
    Animation.xspec({tag: 'door.ew.green.open', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*6, y: 32*1})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*6, y: 32*2})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*6, y: 32*3})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/doors.png', width: 16, height: 32, x: 16*6, y: 32*4})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'door.ew.green',
        x_sketches: {
            'close': new AssetRef({tag: 'door.ew.green.close'}),
            'open': new AssetRef({tag: 'door.ew.green.open'}),
        },
        state: 'close',
    }),

    Rect.xspec({tag: 'idle', width: 12, height: 12, color: 'green'}),
    Rect.xspec({tag: 'melee', width: 12, height: 12, color: 'red'}),
    Rect.xspec({tag: 'dying', width: 12, height: 12, color: 'black'}),
    Animator.xspec({
        tag: 'enemy',
        x_sketches: {
            'idle': new AssetRef({tag: 'idle'}),
            'melee': new AssetRef({tag: 'melee'}),
            'dying': new AssetRef({tag: 'dying'}),
        },
        state: 'idle',
    }),

    Animation.xspec({tag: 'bull.idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*0, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*1, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*2, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*3, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'bull.movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*4, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*5, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*6, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*7, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*8, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'bull.energizel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*9, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*10, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*11, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*12, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*13, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*14, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'bull.chargel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*15, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*16, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*17, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*18, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*19, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*20, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*21, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'bull.stunl', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*22, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*23, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*24, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*25, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'bull.dyingl', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*26, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*27, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*28, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*29, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*30, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*31, y: 0})}), ttl: 100 }),
    ]}),

    Animation.xspec({tag: 'bull.idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*32, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*33, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*34, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*35, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'bull.mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*36, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*37, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*38, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*39, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*40, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'bull.energizer', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*41, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*42, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*43, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*44, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*45, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*46, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'bull.charger', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*47, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*48, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*49, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*50, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*51, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*52, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*53, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'bull.stunr', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*54, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*55, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*56, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*57, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'bull.dyingr', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*58, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*59, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*60, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*61, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*62, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bull.png', width: 39, height: 32, x: 39*63, y: 0})}), ttl: 100 }),
    ]}),

    Animator.xspec({
        tag: 'bull',
        x_sketches: {
            'idlel': new AssetRef({tag: 'bull.idlel'}),
            'idler': new AssetRef({tag: 'bull.idler'}),
            'movel': new AssetRef({tag: 'bull.movel'}),
            'mover': new AssetRef({tag: 'bull.mover'}),
            'stunl': new AssetRef({tag: 'bull.stunl'}),
            'stunr': new AssetRef({tag: 'bull.stunr'}),
            'energizel': new AssetRef({tag: 'bull.energizel'}),
            'energizer': new AssetRef({tag: 'bull.energizer'}),
            'chargel': new AssetRef({tag: 'bull.chargel'}),
            'charger': new AssetRef({tag: 'bull.charger'}),
            'dyingl': new AssetRef({tag: 'bull.dyingl'}),
            'dyingr': new AssetRef({tag: 'bull.dyingr'}),
        },
        state: 'idle',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    Animation.xspec({tag: 'stealthbot.idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*0, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*1, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 200 }),
    ]}),
    Sprite.xspec({tag: 'vendor_portrait', img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*0, y: 0})}),

    Animation.xspec({tag: 'stealthbot.mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*8, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*9, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*10, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*11, y: 0})}), ttl: 50 }),
    ]}),

    Animation.xspec({tag: 'stealthbot.dyingr', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*12, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*13, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*14, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*15, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*16, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*17, y: 0})}), ttl: 100 }),
    ]}),

    Animation.xspec({tag: 'stealthbot.idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*18, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*19, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*20, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*21, y: 0})}), ttl: 200 }),
    ]}),

    Animation.xspec({tag: 'stealthbot.movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*22, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*23, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*24, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*25, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*26, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*27, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*28, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*29, y: 0})}), ttl: 50 }),
    ]}),

    Animation.xspec({tag: 'stealthbot.dyingl', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*30, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*31, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*32, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*33, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*34, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/stealthbot.png', width: 16, height: 32, x: 16*35, y: 0})}), ttl: 100 }),
    ]}),

    Animator.xspec({
        tag: 'stealthbot',
        x_sketches: {
            'idlel': new AssetRef({tag: 'stealthbot.idlel'}),
            'idler': new AssetRef({tag: 'stealthbot.idler'}),
            'movel': new AssetRef({tag: 'stealthbot.movel'}),
            'mover': new AssetRef({tag: 'stealthbot.mover'}),
            'dyingl': new AssetRef({tag: 'stealthbot.dyingl'}),
            'dyingr': new AssetRef({tag: 'stealthbot.dyingr'}),
        },
        state: 'idle',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    Sprite.xspec({tag: 'thumpbot.idle.w', img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*0})}),
    Animation.xspec({tag: 'thumpbot.thump.w', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(0+0)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(0+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(0+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(0+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(0+4)})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(0+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(0+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(0+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(0+0)})}), ttl: 50 }),
    ]}),

    Sprite.xspec({tag: 'thumpbot.idle.nw', img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*5})}),
    Animation.xspec({tag: 'thumpbot.thump.nw', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(5+0)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(5+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(5+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(5+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(5+4)})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(5+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(5+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(5+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(5+0)})}), ttl: 50 }),
    ]}),

    Sprite.xspec({tag: 'thumpbot.idle.n', img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*10})}),
    Animation.xspec({tag: 'thumpbot.thump.n', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(10+0)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(10+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(10+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(10+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(10+4)})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(10+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(10+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(10+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(10+0)})}), ttl: 50 }),
    ]}),

    Sprite.xspec({tag: 'thumpbot.idle.ne', img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*15})}),
    Animation.xspec({tag: 'thumpbot.thump.ne', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(15+0)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(15+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(15+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(15+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(15+4)})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(15+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(15+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(15+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(15+0)})}), ttl: 50 }),
    ]}),

    Sprite.xspec({tag: 'thumpbot.idle.e', img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*20})}),
    Animation.xspec({tag: 'thumpbot.thump.e', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(20+0)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(20+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(20+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(20+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(20+4)})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(20+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(20+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(20+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(20+0)})}), ttl: 50 }),
    ]}),

    Sprite.xspec({tag: 'thumpbot.idle.se', img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*25})}),
    Animation.xspec({tag: 'thumpbot.thump.se', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(25+0)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(25+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(25+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(25+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(25+4)})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(25+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(25+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(25+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(25+0)})}), ttl: 50 }),
    ]}),

    Sprite.xspec({tag: 'thumpbot.idle.s', img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*30})}),
    Animation.xspec({tag: 'thumpbot.thump.s', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(30+0)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(30+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(30+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(30+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(30+4)})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(30+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(30+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(30+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(30+0)})}), ttl: 50 }),
    ]}),

    Sprite.xspec({tag: 'thumpbot.idle.sw', img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*35})}),
    Animation.xspec({tag: 'thumpbot.thump.sw', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(35+0)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(35+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(35+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(35+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(35+4)})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(35+3)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(35+2)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(35+1)})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/thumper.png', width: 48, height: 64, x: 48*(35+0)})}), ttl: 50 }),
    ]}),

    Animator.xspec({
        tag: 'thumpBot',
        x_sketches: {
            'idle.west': new AssetRef({tag: 'thumpbot.idle.w'}),
            'idle.northWest': new AssetRef({tag: 'thumpbot.idle.nw'}),
            'idle.north': new AssetRef({tag: 'thumpbot.idle.n'}),
            'idle.northEast': new AssetRef({tag: 'thumpbot.idle.ne'}),
            'idle.east': new AssetRef({tag: 'thumpbot.idle.e'}),
            'idle.southEast': new AssetRef({tag: 'thumpbot.idle.se'}),
            'idle.south': new AssetRef({tag: 'thumpbot.idle.s'}),
            'idle.southWest': new AssetRef({tag: 'thumpbot.idle.sw'}),
            'thump.west': new AssetRef({tag: 'thumpbot.thump.w'}),
            'thump.northWest': new AssetRef({tag: 'thumpbot.thump.nw'}),
            'thump.north': new AssetRef({tag: 'thumpbot.thump.n'}),
            'thump.northEast': new AssetRef({tag: 'thumpbot.thump.ne'}),
            'thump.east': new AssetRef({tag: 'thumpbot.thump.e'}),
            'thump.southEast': new AssetRef({tag: 'thumpbot.thump.se'}),
            'thump.south': new AssetRef({tag: 'thumpbot.thump.s'}),
            'thump.southWest': new AssetRef({tag: 'thumpbot.thump.sw'}),
        },
        state: 'idle.west',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),


    Animation.xspec({tag: 'overbearer.idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*0, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*1, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 200 }),
    ]}),

    Animation.xspec({tag: 'overbearer.mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*8, y: 0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*9, y: 0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*10, y: 0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*11, y: 0})}), ttl: 75 }),
    ]}),

    Animation.xspec({tag: 'overbearer.idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*12, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*13, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*14, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*15, y: 0})}), ttl: 200 }),
    ]}),

    Animation.xspec({tag: 'overbearer.movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*16, y: 0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*17, y: 0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*18, y: 0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*19, y: 0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*20, y: 0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*21, y: 0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*22, y: 0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/overbearer.png', width: 16, height: 32, x: 16*23, y: 0})}), ttl: 75 }),
    ]}),

    Animator.xspec({
        tag: 'overbearer',
        x_sketches: {
            'idlel': new AssetRef({tag: 'overbearer.idlel'}),
            'idler': new AssetRef({tag: 'overbearer.idler'}),
            'movel': new AssetRef({tag: 'overbearer.movel'}),
            'mover': new AssetRef({tag: 'overbearer.mover'}),
        },
        state: 'idle',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    Sfx.xspec({ tag: 'test.sound', audio: new SfxRef({src: 'snd/test.mp3'}) }),
    Sfx.xspec({ tag: 'gem.break', audio: new SfxRef({src: 'snd/gem-break.mp3'}) }),
    Sfx.xspec({ tag: 'trap.trigger', audio: new SfxRef({src: 'snd/trap_triggered_short.mp3'}), volume: .5 }),
    Sfx.xspec({ tag: 'growth.trigger', audio: new SfxRef({src: 'snd/step-thud.mp3'}), volume: .5 }),
    Sfx.xspec({ tag: 'player.pickup', audio: new SfxRef({src: 'snd/pickup-ding.mp3'}), volume: .25 }),
    Sfx.xspec({ tag: 'blip.1', audio: new SfxRef({src: 'snd/blip-1.mp3'}) }),
    Sfx.xspec({ tag: 'player.step', audio: new SfxRef({src: 'snd/step-motor-whir-3.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'player.damaged', audio: new SfxRef({src: 'snd/player-hurt-2.mp3'}), volume: .2, loop: false }),
    Sfx.xspec({ tag: 'menu.click', audio: new SfxRef({src: 'snd/click.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'item.drop', audio: new SfxRef({src: 'snd/wet-thud.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'item.throw', audio: new SfxRef({src: 'snd/arrow-shoot.mp3'}), volume: .3, loop: false }),
    Sfx.xspec({ tag: 'item.throwHit', audio: new SfxRef({src: 'snd/hit-bolt.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'item.loot', audio: new SfxRef({src: 'snd/uncork-flask.mp3'}), volume: .4, loop: false }),
    Sfx.xspec({ tag: 'item.lootThud', audio: new SfxRef({src: 'snd/hard-bump.mp3'}), volume: .4, loop: false }),
    Sfx.xspec({ tag: 'action.failed', audio: new SfxRef({src: 'snd/failed_action_short.mp3'}), volume: .4, loop: false }),
    Sfx.xspec({ tag: 'cog.use', audio: new SfxRef({src: 'snd/cog_use.mp3'}), volume: .4, loop: false }),
    Sfx.xspec({ tag: 'currency.pickup', audio: new SfxRef({src: 'snd/currency-pickup2.mp3'}), volume: .4, loop: false }),
    Sfx.xspec({ tag: 'chest.open', audio: new SfxRef({src: 'snd/open-chest.mp3'}), volume: .4, loop: false }),
    Sfx.xspec({ tag: 'door.open', audio: new SfxRef({src: 'snd/open_door_1.mp3'}), volume: .4, loop: false }),
    Sfx.xspec({ tag: 'door.close', audio: new SfxRef({src: 'snd/close_average_door.mp3'}), volume: .5}),
    Sfx.xspec({ tag: 'bomb.blast', audio: new SfxRef({src: 'snd/fire-ball.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'bomb.shoot', audio: new SfxRef({src: 'snd/boom2.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'bomb.lands', audio: new SfxRef({src: 'snd/push-block.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'scarab.attack', audio: new SfxRef({src: 'snd/scarab-beetle.mp3'}), volume: .1, loop: false }),
    Sfx.xspec({ tag: 'attack.miss', audio: new SfxRef({src: 'snd/beep.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'attack.hit', audio: new SfxRef({src: 'snd/flip-switch.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'scarab.move', audio: new SfxRef({src: 'snd/scarab-scritter-move.mp3'}), volume: .3}),
    Sfx.xspec({ tag: 'weapon.swap', audio: new SfxRef({src: 'snd/swap-weapon.mp3'}), volume: .3}),
    Sfx.xspec({ tag: 'shoot.ice', audio: new SfxRef({src: 'snd/ice-weapon.mp3'}), volume: .3}),
    Sfx.xspec({ tag: 'shoot.dark', audio: new SfxRef({src: 'snd/dark-weapon.mp3'}), volume: .3}),
    Sfx.xspec({ tag: 'shoot.fire', audio: new SfxRef({src: 'snd/flame-weapon.mp3'}), volume: .3}),
    Sfx.xspec({ tag: 'shoot.shock', audio: new SfxRef({src: 'snd/shock_weapon_short.mp3'}), volume: .3}),
    Sfx.xspec({ tag: 'switch.toggle', audio: new SfxRef({src: 'snd/lever-clank.mp3'}), volume: .3}),
    Sfx.xspec({ tag: 'bonk.hit', audio: new SfxRef({src: 'snd/bonk1.wav'}), volume: .3}),
    Sfx.xspec({ tag: 'bonk.miss', audio: new SfxRef({src: 'snd/bonk0.wav'}), volume: .3}),
    Sfx.xspec({ tag: 'hack.hit', audio: new SfxRef({src: 'snd/hack3.wav'}), volume: .3}),
    Sfx.xspec({ tag: 'hack.miss', audio: new SfxRef({src: 'snd/hack1.wav'}), volume: .3}),
    Sfx.xspec({ tag: 'poke.hit', audio: new SfxRef({src: 'snd/poke5.wav'}), volume: .3}),
    Sfx.xspec({ tag: 'poke.miss', audio: new SfxRef({src: 'snd/poke1.wav'}), volume: .3}),
    Sfx.xspec({ tag: 'music.menu', audio: new SfxRef({src: 'snd/Minia_menu_2.mp3'}), volume: .3, channel: 'music', loop: true}),
    Sfx.xspec({ tag: 'music.play', audio: new SfxRef({src: 'snd/music/battleTheme.mp3'}), volume: .3, channel: 'music', loop: true}),

    // -- rock area
    ...Template.walls('img/rock-walls.png', 'rock.wall'),
    ...Template.tiles('img/rock-floor.png', 'rock.floor', {vars: { z: [[3,1],[3,2],[3,3],[3,4],[3,5]]}}),
    ...Template.tiles('img/rock-pit.png', 'rock.pit'),
    ...Template.tiles('img/rock-pit-border.png', 'rock.pit.border', {vars: { z: [[3,1],[3,2],[3,3],[3,4],[3,5]]}}),
    ...Template.walls('img/rock-outcrop.png', 'rock.outcrop', { vars: { z: [[3,1],[3,2],[3,3],[3,4]]}}),
    ...Template.tiles('img/rock-outcrop-border.png', 'rock.outcrop.border', {vars: { z: [[3,1],[3,2],[3,3],[3,4],[3,5]]}}),

    // -- punk area
    ...Template.walls('img/punk-walls.png', 'punk.wall'),
    ...Template.tiles('img/punk-floor.png', 'punk.floor', {vars: { z: [[3,1],[3,2],[3,3],[3,4],[3,5]]}}),
    ...Template.tiles('img/punk-pit-border.png', 'punk.pit.border', {vars: { z: [[3,1],[3,2],[3,3],[3,4],[3,5]]}}),

    // -- bio area
    ...Template.tiles('img/bio-pit.png', 'bio.pit', {vars: { z: [[3,1],[3,2],[3,3],[3,4],[1,3],[2,3],[4,3],[5,3]]}}),
    ...Template.tiles('img/bio-floor.png', 'bio.floor', {vars: { z: [[3,1],[3,2],[3,3],[3,4],[3,5]]}}),
    ...Template.tiles('img/bio-pit-border.png', 'bio.pit.border', {vars: { z: [[3,1],[3,2],[3,3],[3,4],[3,5]]}}),
    ...Template.walls('img/bio-walls.png', 'bio.wall', {vars: {f: [[1,1],[2,2]], g: [[4,2],[5,1]], n: [[1,3],[1,5]], j: [[2,3],[2,4]], k:[[4,3],[4,4]], q: [[5,3],[5,5]], o: [[3,4],[3,5],[3,7]]}}),
    Template.varsprite('img/bio-clutter.png', 'bio.clutter', [[0,0], [1,0], [2,0], [3,0], [4,0]], {width: 16, height: 16}),

    StretchSprite.xspec({tag: 'hud.border', border: 27, img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 0, y: 16*4, scalex: 3, scaley: 3})}),
    Sprite.xspec({tag: 'hud.portrait', img: new SheetRef({src: 'img/hud.png', width: 48, height: 48, x: 0, y: 0})}),
    Sprite.xspec({tag: 'hud.bar', img: new SheetRef({src: 'img/hud.png', width: 80, height: 16, x: 16*3, y: 0})}),
    Sprite.xspec({tag: 'hud.cancel.unpressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*8, y: 16*0})}),
    Sprite.xspec({tag: 'hud.cancel.pressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*8, y: 16*2})}),
    Sprite.xspec({tag: 'hud.cancel.highlight', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*8, y: 16*4})}),

    Sprite.xspec({tag: 'equip.slot.trans', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*10, y: 16*0})}),
    Sprite.xspec({tag: 'equip.slot.green', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*10, y: 16*2})}),
    Sprite.xspec({tag: 'equip.slot.yellow', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*10, y: 16*4})}),
    Sprite.xspec({tag: 'equip.slot.blue', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*10, y: 16*6})}),

    Sprite.xspec({tag: 'equip.slotc.trans', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*36, y: 16*0})}),
    Sprite.xspec({tag: 'equip.slotc.green', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*38, y: 16*0})}),
    Sprite.xspec({tag: 'equip.slotc.yellow', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*36, y: 16*2})}),
    Sprite.xspec({tag: 'equip.slotc.blue', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*38, y: 16*2})}),

    Sprite.xspec({tag: 'hud.scan.unpressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*14, y: 16*0})}),
    Sprite.xspec({tag: 'hud.scan.pressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*14, y: 16*2})}),
    Sprite.xspec({tag: 'hud.scan.highlight', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*14, y: 16*4})}),
    Sprite.xspec({tag: 'hud.wait.unpressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*16, y: 16*0})}),
    Sprite.xspec({tag: 'hud.wait.pressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*16, y: 16*2})}),
    Sprite.xspec({tag: 'hud.wait.highlight', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*16, y: 16*4})}),
    Sprite.xspec({tag: 'hud.sbutton.unpressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*12, y: 16*0})}),
    Sprite.xspec({tag: 'hud.sbutton.highlight', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*12, y: 16*2})}),
    Sprite.xspec({tag: 'hud.sbutton.bg', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*12, y: 16*4})}),
    Sprite.xspec({tag: 'hud.player.bg', img: new SheetRef({src: 'img/hud.png', width: 16*15, height: 16*9, x: 16*22, y: 16*0})}),
    Sprite.xspec({tag: 'hud.switch.unpressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*20, y: 16*0})}),
    Sprite.xspec({tag: 'hud.switch.pressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*20, y: 16*2})}),
    Sprite.xspec({tag: 'hud.switch.highlight', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*20, y: 16*4})}),
    Sprite.xspec({tag: 'hud.options.panel', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*18, y: 16*0})}),
    Sprite.xspec({tag: 'hud.talents.panel', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*18, y: 16*2})}),
    Sprite.xspec({tag: 'hud.equip.panel', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*18, y: 16*4})}),
    Sprite.xspec({tag: 'hud.bar.panel', img: new SheetRef({src: 'img/hud.png', width: 16*7, height: 16*4, x: 16*22, y: 16*0})}),
    Sprite.xspec({tag: 'hud.button.panel', img: new SheetRef({src: 'img/hud.png', width: 16*16, height: 16*3, x: 16*22, y: 16*7})}),
    Sprite.xspec({tag: 'hud.toggle.panel', img: new SheetRef({src: 'img/hud.png', width: 16*5, height: 16*7, x: 16*29, y: 16*0})}),
    Sprite.xspec({tag: 'hud.stats.unpressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*34, y: 16*0})}),
    Sprite.xspec({tag: 'hud.stats.pressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*34, y: 16*2})}),
    Sprite.xspec({tag: 'hud.stats.highlight', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*34, y: 16*4})}),

    Sprite.xspec({tag: 'hud.plus.unpressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*2, y: 16*6})}),
    Sprite.xspec({tag: 'hud.plus.pressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*2, y: 16*8})}),
    Sprite.xspec({tag: 'hud.plus.highlight', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*2, y: 16*10})}),

    Animation.xspec({tag: 'hud.talents.flash', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*18, y: 16*2})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*22, y: 16*4})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*24, y: 16*4})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*26, y: 16*4})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*24, y: 16*4})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*22, y: 16*4})}), ttl: 100 }),
    ]}),

    Sprite.xspec({tag: 'hud.green.unpressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*0, y: 16*6})}),
    Sprite.xspec({tag: 'hud.green.pressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*0, y: 16*8})}),
    Sprite.xspec({tag: 'hud.green.highlight', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*0, y: 16*10})}),

    Sprite.xspec({tag: 'hud.greenc.unpressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*4, y: 16*6})}),
    Sprite.xspec({tag: 'hud.greenc.pressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*4, y: 16*8})}),
    Sprite.xspec({tag: 'hud.greenc.highlight', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*4, y: 16*10})}),

    Sprite.xspec({tag: 'hud.health', img: new SheetRef({src: 'img/hud.png', width: 16, height: 16, x: 16*12, y: 16*6})}),
    Animation.xspec({tag: 'hud.health.flash', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hud.png', width: 16, height: 16, x: 16*12, y: 16*6})}), ttl: 170 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hud.png', width: 16, height: 16, x: 16*13, y: 16*6})}), ttl: 170 }),
    ]}),
    Sprite.xspec({tag: 'hud.fuel', img: new SheetRef({src: 'img/hud.png', width: 16, height: 16, x: 16*14, y: 16*6})}),
    Animation.xspec({tag: 'hud.fuel.flash', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hud.png', width: 16, height: 16, x: 16*14, y: 16*6})}), ttl: 225 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hud.png', width: 16, height: 16, x: 16*15, y: 16*6})}), ttl: 225 }),
    ]}),
    Sprite.xspec({tag: 'hud.power', img: new SheetRef({src: 'img/hud.png', width: 16, height: 16, x: 16*16, y: 16*6})}),
    Animation.xspec({tag: 'hud.power.flash', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hud.png', width: 16, height: 16, x: 16*16, y: 16*6})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hud.png', width: 16, height: 16, x: 16*17, y: 16*6})}), ttl: 250 }),
    ]}),

    Sprite.xspec({tag: 'equip.bg', img: new SheetRef({src: 'img/equip.png', width: 16*22, height: 16*19, x: 16*4, y: 16*1})}),
    Sprite.xspec({tag: 'equip.pop.bg', img: new SheetRef({src: 'img/equip.png', width: 16*11, height: 16*13, x: 16*26, y: 16*5})}),
    Sprite.xspec({tag: 'stats.bg', img: new SheetRef({src: 'img/stats.png', width: 16*12, height: 16*13, x: 16*0, y: 16*0})}),
    Sprite.xspec({tag: 'prompt.bg', img: new SheetRef({src: 'img/prompt.png', width: 16*15, height: 16*8, x: 16*13, y: 16*7})}),
    Sprite.xspec({tag: 'talents.bg', img: new SheetRef({src: 'img/talents-bg.png', width: 16*14, height: 16*17, x: 16*0, y: 16*0})}),
    Sprite.xspec({tag: 'talents.popup.bg', img: new SheetRef({src: 'img/talents-bg.png', width: 16*12, height: 16*12, x: 16*14, y: 16*3})}),
    Sprite.xspec({tag: 'vendor.bg', img: new SheetRef({src: 'img/vendor.png', width: 16*22, height: 16*16, x: 16*0, y: 16*0})}),
    Sprite.xspec({tag: 'vendor.popup.bg', img: new SheetRef({src: 'img/vendor.png', width: 16*11, height: 16*13, x: 16*22, y: 16*1})}),

    Animation.xspec({tag: 'funguy.mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*1, y: 0})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*8, y: 0})}), ttl: 25 }),
    ]}),

    Animation.xspec({tag: 'funguy.movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*1, y: 32})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*2, y: 32})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*3, y: 32})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*4, y: 32})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*5, y: 32})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*6, y: 32})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*7, y: 32})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*8, y: 32})}), ttl: 25 }),
    ]}),

    Animation.xspec({tag: 'funguy.dyingr', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*1, y: 32*2})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*2, y: 32*2})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*3, y: 32*2})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*4, y: 32*2})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*5, y: 32*2})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*6, y: 32*2})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*7, y: 32*2})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*8, y: 32*2})}), ttl: 50 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*8, y: 32*2})}), ttl: 50 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*8, y: 32*2})}), ttl: 50 }),
    ]}),

    Animation.xspec({tag: 'funguy.dyingl', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*1, y: 32*3})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*2, y: 32*3})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*3, y: 32*3})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*4, y: 32*3})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*5, y: 32*3})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*6, y: 32*3})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*7, y: 32*3})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*8, y: 32*3})}), ttl: 50 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*8, y: 32*3})}), ttl: 50 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*8, y: 32*3})}), ttl: 50 }),
    ]}),

    Animation.xspec({tag: 'funguy.idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*0, y: 32*5})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*1, y: 32*5})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*2, y: 32*5})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*3, y: 32*5})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*4, y: 32*5})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*5, y: 32*5})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*6, y: 32*5})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*7, y: 32*5})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*8, y: 32*5})}), ttl: 100 }),
    ]}),

    Animation.xspec({tag: 'funguy.idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*0, y: 32*4})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*1, y: 32*4})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*2, y: 32*4})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*3, y: 32*4})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*4, y: 32*4})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*5, y: 32*4})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*6, y: 32*4})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*7, y: 32*4})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*8, y: 32*4})}), ttl: 100 }),
    ]}),

    Animator.xspec({
        tag: 'funguy',
        x_sketches: {
            'idler': new AssetRef({tag: 'funguy.idler'}),
            'idlel': new AssetRef({tag: 'funguy.idlel'}),
            'mover': new AssetRef({tag: 'funguy.mover'}),
            'movel': new AssetRef({tag: 'funguy.movel'}),
            'dyingr': new AssetRef({tag: 'funguy.dyingr'}),
            'dyingl': new AssetRef({tag: 'funguy.dyingl'}),
        },
        state: 'idler',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    Animation.xspec({tag: 'token.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 150 }),
    ]}),
    Animation.xspec({tag: 'token.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'token',
        x_sketches: {
            'carry': new AssetRef({tag: 'token.carry'}),
            'free': new AssetRef({tag: 'token.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'dark.gun.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*9, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'dark.gun.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*9, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'dark.gun.1',
        x_sketches: {
            'carry': new AssetRef({tag: 'dark.gun.1.carry'}),
            'free': new AssetRef({tag: 'dark.gun.1.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'dark.gun.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*10, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'dark.gun.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*10, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'dark.gun.2',
        x_sketches: {
            'carry': new AssetRef({tag: 'dark.gun.2.carry'}),
            'free': new AssetRef({tag: 'dark.gun.2.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'dark.gun.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*11, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'dark.gun.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*11, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'dark.gun.3',
        x_sketches: {
            'carry': new AssetRef({tag: 'dark.gun.3.carry'}),
            'free': new AssetRef({tag: 'dark.gun.3.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'ice.gun.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*9, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'ice.gun.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*9, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'ice.gun.1',
        x_sketches: {
            'carry': new AssetRef({tag: 'ice.gun.1.carry'}),
            'free': new AssetRef({tag: 'ice.gun.1.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'ice.gun.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*10, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'ice.gun.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*10, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'ice.gun.2',
        x_sketches: {
            'carry': new AssetRef({tag: 'ice.gun.2.carry'}),
            'free': new AssetRef({tag: 'ice.gun.2.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'ice.gun.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*11, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'ice.gun.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*11, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'ice.gun.3',
        x_sketches: {
            'carry': new AssetRef({tag: 'ice.gun.3.carry'}),
            'free': new AssetRef({tag: 'ice.gun.3.free'}),
        },
        state: 'free',
    }),


    Animation.xspec({tag: 'fire.gun.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*9, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'fire.gun.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*9, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'fire.gun.1',
        x_sketches: {
            'carry': new AssetRef({tag: 'fire.gun.1.carry'}),
            'free': new AssetRef({tag: 'fire.gun.1.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'fire.gun.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*10, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'fire.gun.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*10, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'fire.gun.2',
        x_sketches: {
            'carry': new AssetRef({tag: 'fire.gun.2.carry'}),
            'free': new AssetRef({tag: 'fire.gun.2.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'fire.gun.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*11, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'fire.gun.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*11, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'fire.gun.3',
        x_sketches: {
            'carry': new AssetRef({tag: 'fire.gun.3.carry'}),
            'free': new AssetRef({tag: 'fire.gun.3.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'shock.gun.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*9, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'shock.gun.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*9, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'shock.gun.1',
        x_sketches: {
            'carry': new AssetRef({tag: 'shock.gun.1.carry'}),
            'free': new AssetRef({tag: 'shock.gun.1.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'shock.gun.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*10, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'shock.gun.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*10, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'shock.gun.2',
        x_sketches: {
            'carry': new AssetRef({tag: 'shock.gun.2.carry'}),
            'free': new AssetRef({tag: 'shock.gun.2.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'shock.gun.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*11, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'shock.gun.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*11, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'shock.gun.3',
        x_sketches: {
            'carry': new AssetRef({tag: 'shock.gun.3.carry'}),
            'free': new AssetRef({tag: 'shock.gun.3.free'}),
        },
        state: 'free',
    }),

    Template.varsprite('img/rock-area-clutter.png', 'rock.clutter', [[0,0], [1,0]], {width: 16, height: 16}),
    Template.varsprite('img/punk-clutter.png', 'punk.clutter', [[0,0], [1,0], [2,0], [3,0], [0,1]], {width: 16, height: 16}),

    // -- gems
    Shape.xspec({
        tag: 'gem.gold',
        fill: true,
        verts: [ 
            {x:8, y:2}, {x:14, y:8}, {x:8, y:14}, {x:2, y:8},
        ],
        border: 1,
        color: 'gold',
        borderColor: 'red',
    }),
    Animation.xspec({tag: 'node.power', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 32, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 150 }),
    ]}),
    Animation.xspec({tag: 'node.health', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 150 }),
    ]}),
    Animation.xspec({tag: 'node.fuel', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 32, x: 16*8, y: 0})}), ttl: 150 }),
    ]}),

    Animation.xspec({tag: 'gem.red.carry', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 80*0, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 80*1, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 80*2, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 80*3, y: 0})}), ttl: 167 }),
    ]}),
    Animation.xspec({tag: 'gem.red.free', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 80*0, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 80*1, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 80*2, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 80*3, y: 16})}), ttl: 167 }),
    ]}),
    Animator.xspec({
        tag: 'gem.red',
        x_sketches: {
            'carry': new AssetRef({tag: 'gem.red.carry'}),
            'free': new AssetRef({tag: 'gem.red.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'gem.purple.carry', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 16+80*0, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 16+80*1, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 16+80*2, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 16+80*3, y: 0})}), ttl: 167 }),
    ]}),
    Animation.xspec({tag: 'gem.purple.free', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 16+80*0, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 16+80*1, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 16+80*2, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 16+80*3, y: 16})}), ttl: 167 }),
    ]}),
    Animator.xspec({
        tag: 'gem.purple',
        x_sketches: {
            'carry': new AssetRef({tag: 'gem.purple.carry'}),
            'free': new AssetRef({tag: 'gem.purple.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'gem.green.carry', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 32+80*0, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 32+80*1, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 32+80*2, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 32+80*3, y: 0})}), ttl: 167 }),
    ]}),
    Animation.xspec({tag: 'gem.green.free', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 32+80*0, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 32+80*1, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 32+80*2, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 32+80*3, y: 16})}), ttl: 167 }),
    ]}),
    Animator.xspec({
        tag: 'gem.green',
        x_sketches: {
            'carry': new AssetRef({tag: 'gem.green.carry'}),
            'free': new AssetRef({tag: 'gem.green.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'gem.aqua.carry', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 48+80*0, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 48+80*1, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 48+80*2, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 48+80*3, y: 0})}), ttl: 167 }),
    ]}),
    Animation.xspec({tag: 'gem.aqua.free', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 48+80*0, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 48+80*1, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 48+80*2, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 48+80*3, y: 16})}), ttl: 167 }),
    ]}),
    Animator.xspec({
        tag: 'gem.aqua',
        x_sketches: {
            'carry': new AssetRef({tag: 'gem.aqua.carry'}),
            'free': new AssetRef({tag: 'gem.aqua.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'gem.blue.carry', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 64+80*0, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 64+80*1, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 64+80*2, y: 0})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 16, x: 64+80*3, y: 0})}), ttl: 167 }),
    ]}),
    Animation.xspec({tag: 'gem.blue.free', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 64+80*0, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 64+80*1, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 64+80*2, y: 16})}), ttl: 167 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem3.png', width: 16, height: 32, x: 64+80*3, y: 16})}), ttl: 167 }),
    ]}),
    Animator.xspec({
        tag: 'gem.blue',
        x_sketches: {
            'carry': new AssetRef({tag: 'gem.blue.carry'}),
            'free': new AssetRef({tag: 'gem.blue.free'}),
        },
        state: 'free',
    }),


    // -- trap
    Animation.xspec({ tag: 'trap.armed', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*0, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*10, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*12, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*14, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({ tag: 'trap.inactive', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 100 }),
    ]}),
    Animator.xspec({
        tag: 'trap',
        x_sketches: {
            'armed': new AssetRef({tag: 'trap.armed'}),
            'inactive': new AssetRef({tag: 'trap.inactive'}),
        },
        state: 'armed',
    }),

    Animator.xspec({
        tag: 'rock.growth',
        x_sketches: {
            'armed': Template.varsprite('img/shroom-growth.png', 'rock.growth.armed', [[0,0], [1,0], [2,0], [3,0]], {width: 20, height: 32}),
            'inactive': Sprite.xspec({img: new SheetRef({src: 'img/shroom-growth.png', width: 20, height: 32, x: 20*4, y: 0})}),
        },
        state: 'armed',
    }),

    Animator.xspec({
        tag: 'vine.growth',
        x_sketches: {
            'armed': Template.varsprite('img/vine-growth.png', 'vine.growth.armed', [[0,0], [1,0], [2,0], [3,0]], {width: 20, height: 32}),
            'inactive': Sprite.xspec({img: new SheetRef({src: 'img/vine-growth.png', width: 20, height: 32, x: 20*4, y: 0})}),
        },
        state: 'armed',
    }),

    Animation.xspec({tag: 'magma.idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 150 }),
    ]}),
    Animation.xspec({tag: 'magma.idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 150 }),
    ]}),
    Animation.xspec({tag: 'magma.mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*8, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*9, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*10, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*11, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'magma.movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*12, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*13, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*14, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*15, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'magma.dyingr', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*16, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*17, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*18, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*19, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*20, y: 0})}), ttl: 50 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*20, y: 0})}), ttl: 50 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*20, y: 0})}), ttl: 50 }),
    ]}),
    Animation.xspec({tag: 'magma.dyingl', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*21, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*22, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*23, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*24, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*25, y: 0})}), ttl: 100 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*25, y: 0})}), ttl: 100 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*25, y: 0})}), ttl: 100 }),
    ]}),
    Animator.xspec({
        tag: 'magma',
        x_sketches: {
            'idler': new AssetRef({tag: 'magma.idler'}),
            'idlel': new AssetRef({tag: 'magma.idlel'}),
            'mover': new AssetRef({tag: 'magma.mover'}),
            'movel': new AssetRef({tag: 'magma.movel'}),
            'dyingr': new AssetRef({tag: 'magma.dyingr'}),
            'dyingl': new AssetRef({tag: 'magma.dyingl'}),
        },
        state: 'idler',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    // -- menu
    //Rect.xspec({tag: 'options.bg', width: 16, height: 16, color: Resurrect64.colors[0]}),
    //Rect.xspec({tag: 'help.bg', width: 16, height: 16, color: Resurrect64.colors[0]}),
    //Rect.xspec({tag: 'credits.bg', width: 16, height: 16, color: Resurrect64.colors[0]}),
    //Rect.xspec({tag: 'gameover.bg', width: 16, height: 16, color: Resurrect64.colors[0]}),

    // -- vfx
    Animation.xspec({tag: 'vfx.reveal', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*3, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*4, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*5, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*7, y: 0})}), ttl: 150 }),
    ]}),

    Animation.xspec({tag: 'vfx.hide', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*7, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*5, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*4, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*3, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
    ]}),

    Animation.xspec({tag: 'vfx.alert', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 850 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 150 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 150 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 150 }),
    ]}),

    Animation.xspec({tag: 'vfx.aggroLoss', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 32, y: 0})}), ttl: 850 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 32, y: 0})}), ttl: 150 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 32, y: 0})}), ttl: 150 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 32, y: 0})}), ttl: 150 }),
    ]}),

    Animation.xspec({tag: 'vfx.shield', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 64*1, y: 16})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 64*2, y: 16})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 64*3, y: 16})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 64*4, y: 16})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 64*5, y: 16})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 64*6, y: 16})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 64*7, y: 16})}), ttl: 100 }),
    ]}),

    Animation.xspec({tag: 'vfx.dazed', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 16, y: 32})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 16+64*1, y: 32})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 16+64*2, y: 32})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 16+64*3, y: 32})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 16+64*4, y: 32})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 16+64*5, y: 32})}), ttl: 100 }),
    ]}),

    Animation.xspec({tag: 'vfx.invulnerability', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 32, y: 32})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 32+64*1, y: 32})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 32+64*2, y: 32})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 32+64*3, y: 32})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 32+64*4, y: 32})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 32+64*5, y: 32})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 32+64*6, y: 32})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 32+64*7, y: 32})}), ttl: 100 }),
    ]}),

    Sprite.xspec({tag: 'vfx.frozen', img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 48, y: 0})}),
    // FIXME: placeholder
    Rect.xspec({tag: 'vfx.drain', width: 14, height: 14, color: 'rgba(131,28,93,.3)'}),
    Rect.xspec({tag: 'vfx.poison', width: 14, height: 14, color: 'rgba(162,169,71,.3)'}),

    Animation.xspec({tag: 'vfx.enflamed', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx-fire.png', width: 16, height: 32, x: 0, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx-fire.png', width: 16, height: 32, x: 16*1, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx-fire.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx-fire.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx-fire.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx-fire.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx-fire.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx-fire.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 50 }),
    ]}),

    Animation.xspec({tag: 'fuelcell.free', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*0, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*1, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*2, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*3, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*4, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*5, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*6, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*7, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'fuelcell.carry', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*0+16, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*1+16, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*2+16, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*3+16, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*4+16, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*5+16, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*6+16, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fuel-cell.png', width: 16, height: 16, x: 64*7+16, y: 0})}), ttl: 100 }),
    ]}),
    Animator.xspec({
        tag: 'fuelcell',
        x_sketches: {
            'carry': new AssetRef({tag: 'fuelcell.carry'}),
            'free': new AssetRef({tag: 'fuelcell.free'}),
        },
        state: 'free',
    }),

    // energy sprite: shock
    Animation.xspec({tag: 'energy-shock.idle', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*0, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*1, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*8, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*9, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*10, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'energy-shock.dying', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*11, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*12, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*13, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*14, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*15, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*16, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*17, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*18, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'energy-shock.move', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*19, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*20, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*21, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*22, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*23, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/energy-shock.png', width: 16, height: 32, x: 16*24, y: 0})}), ttl: 100 }),
    ]}),
    Animator.xspec({
        tag: 'energy-shock',
        x_sketches: {
            'idle': new AssetRef({tag: 'energy-shock.idle'}),
            'move': new AssetRef({tag: 'energy-shock.move'}),
            'dying': new AssetRef({tag: 'energy-shock.dying'}),
        },
        state: 'idle',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    // -- cogs
    Sprite.xspec({tag: 'cog.four.carry', img: new SheetRef({src: 'img/cogs.png', width: 16, height: 16, x: 0, y: 0})}),
    Animation.xspec({tag: 'cog.four.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 16*5*1, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 16*5*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 16*5*3, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'cog.four',
        x_sketches: {
            'carry': new AssetRef({tag: 'cog.four.carry'}),
            'free': new AssetRef({tag: 'cog.four.free'}),
        },
        state: 'free',
    }),

    Sprite.xspec({tag: 'cog.three.carry', img: new SheetRef({src: 'img/cogs.png', width: 16, height: 16, x: 16, y: 0})}),
    Animation.xspec({tag: 'cog.three.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 16, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 16+16*5*1, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 16+16*5*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 16+16*5*3, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'cog.three',
        x_sketches: {
            'carry': new AssetRef({tag: 'cog.three.carry'}),
            'free': new AssetRef({tag: 'cog.three.free'}),
        },
        state: 'free',
    }),

    Sprite.xspec({tag: 'cog.six.carry', img: new SheetRef({src: 'img/cogs.png', width: 16, height: 16, x: 32, y: 0})}),
    Animation.xspec({tag: 'cog.six.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 32, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 32+16*5*1, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 32+16*5*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 32+16*5*3, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'cog.six',
        x_sketches: {
            'carry': new AssetRef({tag: 'cog.six.carry'}),
            'free': new AssetRef({tag: 'cog.six.free'}),
        },
        state: 'free',
    }),

    Sprite.xspec({tag: 'cog.cam.carry', img: new SheetRef({src: 'img/cogs.png', width: 16, height: 16, x: 48, y: 0})}),
    Animation.xspec({tag: 'cog.cam.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 48, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 48+16*5*1, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 48+16*5*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 48+16*5*3, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'cog.cam',
        x_sketches: {
            'carry': new AssetRef({tag: 'cog.cam.carry'}),
            'free': new AssetRef({tag: 'cog.cam.free'}),
        },
        state: 'free',
    }),

    Sprite.xspec({tag: 'cog.five.carry', img: new SheetRef({src: 'img/cogs.png', width: 16, height: 16, x: 64, y: 0})}),
    Animation.xspec({tag: 'cog.five.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 64, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 64+16*5*1, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 64+16*5*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs.png', width: 16, height: 32, x: 64+16*5*3, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'cog.five',
        x_sketches: {
            'carry': new AssetRef({tag: 'cog.five.carry'}),
            'free': new AssetRef({tag: 'cog.five.free'}),
        },
        state: 'free',
    }),

    Sprite.xspec({tag: 'cog.fours.carry', img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 16, x: 0, y: 0})}),
    Animation.xspec({tag: 'cog.fours.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 16*5*1, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 16*5*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 16*5*3, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'cog.fours',
        x_sketches: {
            'carry': new AssetRef({tag: 'cog.fours.carry'}),
            'free': new AssetRef({tag: 'cog.fours.free'}),
        },
        state: 'free',
    }),

    Sprite.xspec({tag: 'cog.threes.carry', img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 16, x: 16, y: 0})}),
    Animation.xspec({tag: 'cog.threes.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 16, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 16+16*5*1, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 16+16*5*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 16+16*5*3, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'cog.threes',
        x_sketches: {
            'carry': new AssetRef({tag: 'cog.threes.carry'}),
            'free': new AssetRef({tag: 'cog.threes.free'}),
        },
        state: 'free',
    }),

    Sprite.xspec({tag: 'cog.sixs.carry', img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 16, x: 32, y: 0})}),
    Animation.xspec({tag: 'cog.sixs.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 32, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 32+16*5*1, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 32+16*5*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 32+16*5*3, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'cog.sixs',
        x_sketches: {
            'carry': new AssetRef({tag: 'cog.sixs.carry'}),
            'free': new AssetRef({tag: 'cog.sixs.free'}),
        },
        state: 'free',
    }),

    Sprite.xspec({tag: 'cog.cams.carry', img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 16, x: 48, y: 0})}),
    Animation.xspec({tag: 'cog.cams.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 48, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 48+16*5*1, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 48+16*5*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 48+16*5*3, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'cog.cams',
        x_sketches: {
            'carry': new AssetRef({tag: 'cog.cams.carry'}),
            'free': new AssetRef({tag: 'cog.cams.free'}),
        },
        state: 'free',
    }),

    Sprite.xspec({tag: 'cog.fives.carry', img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 16, x: 64, y: 0})}),
    Animation.xspec({tag: 'cog.fives.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 64, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 64+16*5*1, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 64+16*5*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/cogs-steel.png', width: 16, height: 32, x: 64+16*5*3, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'cog.fives',
        x_sketches: {
            'carry': new AssetRef({tag: 'cog.fives.carry'}),
            'free': new AssetRef({tag: 'cog.fives.free'}),
        },
        state: 'free',
    }),
    
    Animation.xspec({tag: 'bomb.idle', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bomb.png', width: 16, height: 32, x: 16*0})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bomb.png', width: 16, height: 32, x: 16*1})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bomb.png', width: 16, height: 32, x: 16*2})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bomb.png', width: 16, height: 32, x: 16*3})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bomb.png', width: 16, height: 32, x: 16*4})}), ttl: 75 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bomb.png', width: 16, height: 32, x: 16*5})}), ttl: 75 }),
    ]}),

    Animation.xspec({tag: 'bomb.explode', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bomb-explode.png', width: 64, height: 48, x: 64*0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bomb-explode.png', width: 64, height: 48, x: 64*1})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bomb-explode.png', width: 64, height: 48, x: 64*2})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bomb-explode.png', width: 64, height: 48, x: 64*3})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bomb-explode.png', width: 64, height: 48, x: 64*4})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bomb-explode.png', width: 64, height: 48, x: 64*5})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/bomb-explode.png', width: 64, height: 48, x: 64*6})}), ttl: 50 }),
    ]}),

    Animator.xspec({
        tag: 'bomb',
        x_sketches: {
            'idle': new AssetRef({tag: 'bomb.idle'}),
            'explode': new AssetRef({tag: 'bomb.explode'}),
        },
        state: 'idle',
    }),

    Animation.xspec({tag: 'scarab.idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 0, y: 14})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*1, y: 14})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*2, y: 14})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*3, y: 14})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*4, y: 14})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*5, y: 14})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'scarab.mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*0, y: 14*3})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*1, y: 14*3})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*2, y: 14*3})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*3, y: 14*3})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*4, y: 14*3})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*5, y: 14*3})}), ttl: 30 }),
    ]}),

    Animation.xspec({tag: 'scarab.idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 0, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*1, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*2, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*3, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*4, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*5, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'scarab.movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*0, y: 14*2})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*1, y: 14*2})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*2, y: 14*2})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*3, y: 14*2})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*4, y: 14*2})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*5, y: 14*2})}), ttl: 30 }),
    ]}),

    Animation.xspec({tag: 'scarab.dyingl', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 0, y: 14*4})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*1, y: 14*4})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*2, y: 14*4})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*3, y: 14*4})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*4, y: 14*4})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*5, y: 14*4})}), ttl: 50 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*5, y: 14*4})}), ttl: 50 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*5, y: 14*4})}), ttl: 50 }),
    ]}),
    Animation.xspec({tag: 'scarab.dyingr', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 0, y: 14*5})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*1, y: 14*5})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*2, y: 14*5})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*3, y: 14*5})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*4, y: 14*5})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*5, y: 14*5})}), ttl: 50 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*5, y: 14*5})}), ttl: 50 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/scarab.png', width: 14, height: 14, x: 14*5, y: 14*5})}), ttl: 50 }),
    ]}),

    Animator.xspec({
        tag: 'scarab',
        x_sketches: {
            'idler': new AssetRef({tag: 'scarab.idler'}),
            'idlel': new AssetRef({tag: 'scarab.idlel'}),
            'mover': new AssetRef({tag: 'scarab.mover'}),
            'movel': new AssetRef({tag: 'scarab.movel'}),
            'dyingr': new AssetRef({tag: 'scarab.dyingr'}),
            'dyingl': new AssetRef({tag: 'scarab.dyingl'}),
        },
        state: 'idler',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    //Rect.xspec({tag: 'talent.active', width: 12, height: 12, color: 'red', borderColor: 'gold', border: 1}),
    //Rect.xspec({tag: 'talent.inactive', width: 12, height: 12, color: 'rgba(55,55,55,1)', borderColor: 'rgba(127,127,127,1)', border: 1}),

    Sprite.xspec({tag: 'talent.golddigger', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*0, y: 16*0})}),
    Sprite.xspec({tag: 'talent.efficiency', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*2, y: 16*0})}),
    Sprite.xspec({tag: 'talent.shielding', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*4, y: 16*0})}),
    Sprite.xspec({tag: 'talent.gems', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*6, y: 16*0})}),
    Sprite.xspec({tag: 'talent.bonkers', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*0, y: 16*2})}),
    Sprite.xspec({tag: 'talent.pointy', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*2, y: 16*2})}),
    Sprite.xspec({tag: 'talent.hackety', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*4, y: 16*2})}),
    Sprite.xspec({tag: 'talent.powerage', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*6, y: 16*2})}),
    Sprite.xspec({tag: 'talent.frosty', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*0, y: 16*4})}),
    Sprite.xspec({tag: 'talent.fuego', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*2, y: 16*4})}),
    Sprite.xspec({tag: 'talent.shocking', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*4, y: 16*4})}),
    Sprite.xspec({tag: 'talent.darkness', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*6, y: 16*4})}),

    Sprite.xspec({tag: 'talent.active', img: new SheetRef({src: 'img/talents.png', width: 4, height: 4, x: 16*8, y: 16*0})}),
    Sprite.xspec({tag: 'talent.inactive', img: new SheetRef({src: 'img/talents.png', width: 4, height: 4, x: 16*8+4, y: 16*0})}),

    Sprite.xspec({tag: 'talent.button', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*9, y: 16*0})}),
    Sprite.xspec({tag: 'talent.button.hl', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*9, y: 16*2})}),
    Sprite.xspec({tag: 'talent.button.pressed', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*9, y: 16*4})}),
    Sprite.xspec({tag: 'talent.frame', img: new SheetRef({src: 'img/talents.png', width: 32, height: 32, x: 16*11, y: 16*0})}),

    Sprite.xspec({tag: 'talent.inactive.lg', img: new SheetRef({src: 'img/talents.png', width: 16, height: 16, x: 16*11, y: 16*2})}),
    Sprite.xspec({tag: 'talent.active.lg', img: new SheetRef({src: 'img/talents.png', width: 16, height: 16, x: 16*12, y: 16*2})}),

    Sprite.xspec({tag: 'pillar.poison', img: new SheetRef({src: 'img/pillars.png', width: 16, height: 32, x: 16*0, y: 16*0})}),
    Sprite.xspec({tag: 'pillar.fire', img: new SheetRef({src: 'img/pillars.png', width: 16, height: 32, x: 16*1, y: 16*0})}),
    Sprite.xspec({tag: 'pillar.ice', img: new SheetRef({src: 'img/pillars.png', width: 16, height: 32, x: 16*2, y: 16*0})}),
    Sprite.xspec({tag: 'pillar.dark', img: new SheetRef({src: 'img/pillars.png', width: 16, height: 32, x: 16*3, y: 16*0})}),
    Sprite.xspec({tag: 'pillar.dormant', img: new SheetRef({src: 'img/pillars.png', width: 16, height: 32, x: 16*4, y: 16*0})}),

    Animation.xspec({tag: 'slimer.idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*21, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*22, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*23, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*24, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*25, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*26, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*27, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'slimer.mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*28, y: 0})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*29, y: 0})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*30, y: 0})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*31, y: 0})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*32, y: 0})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*33, y: 0})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*34, y: 0})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*35, y: 0})}), ttl: 30 }),
    ]}),

    Animation.xspec({tag: 'slimer.idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 0, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*1, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*2, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*3, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*4, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*5, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*6, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'slimer.movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*7, y: 0})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*8, y: 0})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*9, y: 0})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*10, y: 0})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*11, y: 0})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*12, y: 0})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*13, y: 0})}), ttl: 30 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*14, y: 0})}), ttl: 30 }),
    ]}),

    Animation.xspec({tag: 'slimer.dyingl', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*15, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*16, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*17, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*18, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*19, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*20, y: 0})}), ttl: 50 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*20, y: 0})}), ttl: 50 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*20, y: 0})}), ttl: 50 }),
    ]}),
    Animation.xspec({tag: 'slimer.dyingr', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*36, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*37, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*38, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*39, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*40, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*41, y: 0})}), ttl: 100 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*41, y: 0})}), ttl: 100 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/slimer.png', width: 26, height: 25, x: 26*41, y: 0})}), ttl: 100 }),
    ]}),

    Animator.xspec({
        tag: 'slimer',
        x_sketches: {
            'idler': new AssetRef({tag: 'slimer.idler'}),
            'idlel': new AssetRef({tag: 'slimer.idlel'}),
            'mover': new AssetRef({tag: 'slimer.mover'}),
            'movel': new AssetRef({tag: 'slimer.movel'}),
            'dyingr': new AssetRef({tag: 'slimer.dyingr'}),
            'dyingl': new AssetRef({tag: 'slimer.dyingl'}),
        },
        state: 'idler',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    Animation.xspec({tag: 'rous.idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*3, y: 32})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*4, y: 32})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*5, y: 32})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'rous.mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*3, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*4, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*5, y: 0})}), ttl: 100 }),
    ]}),

    Animation.xspec({tag: 'rous.idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*0, y: 32})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*1, y: 32})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*2, y: 32})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'rous.movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*0, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*1, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*2, y: 0})}), ttl: 100 }),
    ]}),

    Animation.xspec({tag: 'rous.dyingl', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*1, y: 32*2})}), ttl: 100 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*1, y: 32*2})}), ttl: 100 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*1, y: 32*2})}), ttl: 100 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'rous.dyingr', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*4, y: 32*2})}), ttl: 100 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*4, y: 32*2})}), ttl: 100 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rous.png', width: 32, height: 32, x: 32*4, y: 32*2})}), ttl: 100 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
    ]}),

    Animator.xspec({
        tag: 'rous',
        x_sketches: {
            'idler': new AssetRef({tag: 'rous.idler'}),
            'idlel': new AssetRef({tag: 'rous.idlel'}),
            'mover': new AssetRef({tag: 'rous.mover'}),
            'movel': new AssetRef({tag: 'rous.movel'}),
            'dyingr': new AssetRef({tag: 'rous.dyingr'}),
            'dyingl': new AssetRef({tag: 'rous.dyingl'}),
        },
        state: 'idler',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    Sprite.xspec({tag: 'rock.carry', img: new SheetRef({src: 'img/rock.png', width: 16, height: 16, x: 0, y: 32})}),
    Animation.xspec({tag: 'rock.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rock.png', width: 16, height: 32, x: 0, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rock.png', width: 16, height: 32, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rock.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/rock.png', width: 16, height: 32, x: 16*1, y: 0})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'rock',
        x_sketches: {
            'carry': new AssetRef({tag: 'rock.carry'}),
            'free': new AssetRef({tag: 'rock.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'sneak.idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*0, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*1, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*2, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*4, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*5, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*6, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*7, y: 0})}), ttl: 200 }),
    ]}),

    Animation.xspec({tag: 'sneak.movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*8, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*9, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*10, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*11, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*12, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*13, y: 0})}), ttl: 50 }),
    ]}),

    Animation.xspec({tag: 'sneak.dyingl', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*14, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*15, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*16, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*17, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*18, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*19, y: 0})}), ttl: 100 }),
    ]}),

    Animation.xspec({tag: 'sneak.idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*20, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*21, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*22, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*23, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*24, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*25, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*26, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*27, y: 0})}), ttl: 200 }),
    ]}),

    Animation.xspec({tag: 'sneak.mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*28, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*29, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*30, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*31, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*32, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*33, y: 0})}), ttl: 50 }),
    ]}),

    Animation.xspec({tag: 'sneak.dyingr', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*34, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*35, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*36, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*37, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*38, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/sneak.png', width: 27, height: 32, x: 27*39, y: 0})}), ttl: 100 }),
    ]}),

    Animator.xspec({
        tag: 'sneak',
        x_sketches: {
            'idlel': new AssetRef({tag: 'sneak.idlel'}),
            'idler': new AssetRef({tag: 'sneak.idler'}),
            'movel': new AssetRef({tag: 'sneak.movel'}),
            'mover': new AssetRef({tag: 'sneak.mover'}),
            'dyingl': new AssetRef({tag: 'sneak.dyingl'}),
            'dyingr': new AssetRef({tag: 'sneak.dyingr'}),
        },
        state: 'idle',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    Sprite.xspec({tag: 'machine.cart', img: new SheetRef({src: 'img/mineProps.png', width: 16, height: 32, x: 16*0, y: 0})}),
    Sprite.xspec({tag: 'machine.tnt', img: new SheetRef({src: 'img/mineProps.png', width: 16, height: 32, x: 16*1, y: 0})}),

    Animation.xspec({tag: 'digger.idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*0, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*1, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 200 }),
    ]}),

    Animation.xspec({tag: 'digger.idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*0, y: 32*1})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*1, y: 32*1})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*2, y: 32*1})}), ttl: 200 }),
    ]}),

    Animation.xspec({tag: 'digger.movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*0, y: 32*2})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*1, y: 32*2})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*2, y: 32*2})}), ttl: 200 }),
    ]}),

    Animation.xspec({tag: 'digger.mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*0, y: 32*3})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*1, y: 32*3})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*2, y: 32*3})}), ttl: 200 }),
    ]}),

    Animation.xspec({tag: 'digger.dyingl', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*0, y: 32*4})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*1, y: 32*4})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*2, y: 32*4})}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*2, y: 32*4})}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*2, y: 32*4})}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
    ]}),

    Animation.xspec({tag: 'digger.dyingr', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*0, y: 32*5})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*1, y: 32*5})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*2, y: 32*5})}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*2, y: 32*5})}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/diggerBot.png', width: 16, height: 32, x: 16*2, y: 32*5})}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
    ]}),

    Animator.xspec({
        tag: 'digger',
        x_sketches: {
            'idlel': new AssetRef({tag: 'digger.idlel'}),
            'idler': new AssetRef({tag: 'digger.idler'}),
            'movel': new AssetRef({tag: 'digger.movel'}),
            'mover': new AssetRef({tag: 'digger.mover'}),
            'dyingl': new AssetRef({tag: 'digger.dyingl'}),
            'dyingr': new AssetRef({tag: 'digger.dyingr'}),
        },
        state: 'idle',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
        stateAccessor: (e) => e.animState,
    }),

    Animation.xspec({tag: 'gadget.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 150 }),
    ]}),
    Animation.xspec({tag: 'gadget.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'gadget.1',
        x_sketches: {
            'carry': new AssetRef({tag: 'gadget.1.carry'}),
            'free': new AssetRef({tag: 'gadget.1.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'gadget.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 150 }),
    ]}),
    Animation.xspec({tag: 'gadget.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'gadget.2',
        x_sketches: {
            'carry': new AssetRef({tag: 'gadget.2.carry'}),
            'free': new AssetRef({tag: 'gadget.2.free'}),
        },
        state: 'free',
    }),

    Animation.xspec({tag: 'gadget.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 150 }),
    ]}),
    Animation.xspec({tag: 'gadget.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gizmo1.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'gadget.3',
        x_sketches: {
            'carry': new AssetRef({tag: 'gadget.3.carry'}),
            'free': new AssetRef({tag: 'gadget.3.free'}),
        },
        state: 'free',
    }),

    Sprite.xspec({tag: 'shielding.1.carry', img: new SheetRef({src: 'img/shielding.png', width: 16, height: 16, x: 0, y: 0})}), 
    Animation.xspec({tag: 'shielding.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shielding.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shielding.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shielding.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shielding.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'shielding.1',
        x_sketches: {
            'carry': new AssetRef({tag: 'shielding.1.carry'}),
            'free': new AssetRef({tag: 'shielding.1.free'}),
        },
        state: 'free',
    }),

    Sprite.xspec({tag: 'shielding.2.carry', img: new SheetRef({src: 'img/shielding.png', width: 16, height: 16, x: 16*1, y: 0})}), 
    Animation.xspec({tag: 'shielding.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shielding.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shielding.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shielding.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shielding.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'shielding.2',
        x_sketches: {
            'carry': new AssetRef({tag: 'shielding.2.carry'}),
            'free': new AssetRef({tag: 'shielding.2.free'}),
        },
        state: 'free',
    }),

    Sprite.xspec({tag: 'shielding.3.carry', img: new SheetRef({src: 'img/shielding.png', width: 16, height: 16, x: 16*2, y: 0})}), 
    Animation.xspec({tag: 'shielding.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shielding.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shielding.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shielding.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shielding.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'shielding.3',
        x_sketches: {
            'carry': new AssetRef({tag: 'shielding.3.carry'}),
            'free': new AssetRef({tag: 'shielding.3.free'}),
        },
        state: 'free',
    }),

    Sprite.xspec({tag: 'title.bg', img: new ImageRef({src: 'img/Title_320x240.png'})}), 

    Sprite.xspec({tag: 'cog2', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 16*2, height: 16*2, x: 0, y: 16*2})}),
    Sprite.xspec({tag: 'cog4', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 16*4, height: 16*4, x: 16*2, y: 16*0})}),
    Sprite.xspec({tag: 'cog6', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 16*6, height: 16*6, x: 16*6, y: 16*0})}),
    Sprite.xspec({tag: 'cog8', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 16*8-3, height: 16*8-1, x: 16*12+4, y: 16*0})}),
    Sprite.xspec({tag: 'cog12', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 16*12+1, height: 16*12+1, x: 16*20+1, y: 16*0})}),
    Sprite.xspec({tag: 'cog14', img: new SheetRef({src: 'img/cog14.png', width: 16*14, height: 16*14, x: 0, y: 0})}),
    Sprite.xspec({tag: 'cog22', img: new SheetRef({src: 'img/cog22.png', width: 16*22, height: 16*22, x: 0, y: 0})}),
    /*
    Sprite.xspec({tag: 'cog2', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 49, height: 49, x: 64, y: 0})}),
    Sprite.xspec({tag: 'cog3', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 65, height: 65, x: 128, y: 0})}),
    Sprite.xspec({tag: 'cog4', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 17, height: 17, x: 0, y: 64})}),
    Sprite.xspec({tag: 'cog5', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 17, height: 17, x: 16, y: 64})}),
    Sprite.xspec({tag: 'cog6', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 32, height: 32, x: 32, y: 64})}),
    Sprite.xspec({tag: 'cog7', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 32, height: 32, x: 64, y: 64})}),

    Sprite.xspec({tag: 'cog8', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 32, height: 32, x: 0, y: 16*8})}),
    Sprite.xspec({tag: 'cog9', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 32, height: 32, x: 16*2, y: 16*8})}),
    Sprite.xspec({tag: 'cog10', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 16*4, height: 16*4, x: 16*4, y: 16*6})}),
    Sprite.xspec({tag: 'cog11', img: new SheetRef({src: 'img/menu-bg-cogwheels.png', width: 16*4, height: 16*4, x: 16*8, y: 16*6})}),
    */

    StretchSprite.xspec({tag: 'menu.button', border: 30, img: new SheetRef({src: 'img/menu-button.png', width: 24, height: 24, scalex: 3, scaley: 3})}),
    Sprite.xspec({tag: 'menu.bg', img: new SheetRef({src: 'img/menu-layout.png', width: 16*11, height: 16*16, x: 16*13, y: 16*3})}),
    Sprite.xspec({tag: 'tcog.gray', img: new SheetRef({src: 'img/menu-layout.png', width: 32, height: 32, x: 16*24, y: 16*3})}),
    Sprite.xspec({tag: 'tcog.blue', img: new SheetRef({src: 'img/menu-layout.png', width: 32, height: 32, x: 16*26, y: 16*3})}),
    Sprite.xspec({tag: 'tcog.orange', img: new SheetRef({src: 'img/menu-layout.png', width: 32, height: 32, x: 16*28, y: 16*3})}),
    Sprite.xspec({tag: 'tcog.green', img: new SheetRef({src: 'img/menu-layout.png', width: 32, height: 32, x: 16*30, y: 16*3})}),

    Sprite.xspec({tag: 'help.bg', img: new SheetRef({src: 'img/help-layout.png', width: 16*21, height: 16*17, x: 16*10, y: 16*2})}),
    Sprite.xspec({tag: 'help.next.unpressed', img: new SheetRef({src: 'img/help-layout.png', width: 32, height: 32, x: 16*0, y: 16*0})}),
    Sprite.xspec({tag: 'help.next.pressed', img: new SheetRef({src: 'img/help-layout.png', width: 32, height: 32, x: 16*0, y: 16*2})}),
    Sprite.xspec({tag: 'help.next.highlight', img: new SheetRef({src: 'img/help-layout.png', width: 32, height: 32, x: 16*0, y: 16*4})}),
    Sprite.xspec({tag: 'help.prev.unpressed', img: new SheetRef({src: 'img/help-layout.png', width: 32, height: 32, x: 16*2, y: 16*0})}),
    Sprite.xspec({tag: 'help.prev.pressed', img: new SheetRef({src: 'img/help-layout.png', width: 32, height: 32, x: 16*2, y: 16*2})}),
    Sprite.xspec({tag: 'help.prev.highlight', img: new SheetRef({src: 'img/help-layout.png', width: 32, height: 32, x: 16*2, y: 16*4})}),

    Sprite.xspec({tag: 'options.bg', img: new SheetRef({src: 'img/options-layout.png', width: 16*13, height: 16*8, x: 16*14, y: 16*2})}),
    Sprite.xspec({tag: 'options-play.bg', img: new SheetRef({src: 'img/options-layout.png', width: 16*13, height: 16*10, x: 16*14, y: 16*10})}),
    Sprite.xspec({tag: 'volume.knob', img: new SheetRef({src: 'img/options-layout.png', width: 8, height: 13, x: 4, y: 2})}),
    
    Sprite.xspec({tag: 'gameover.bg', img: new SheetRef({src: 'img/gameover-layout.png', width: 16*15, height: 16*10, x: 16*10, y: 16*2})}),
    Sprite.xspec({tag: 'gameover.crack', img: new SheetRef({src: 'img/gameover-layout.png', width: 16*4, height: 16*4, x: 0, y: 0})}),
    
    Sprite.xspec({tag: 'story.bg', img: new SheetRef({src: 'img/story-layout.png', width: 16*15, height: 16*10, x: 16*10, y: 16*2})}),

];