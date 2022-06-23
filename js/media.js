export { FiddleAssets };

import { Sprite } from "./base/sprite.js";
import { Sfx } from "./base/sfx.js";
import { VarSprite } from "./base/varSprite.js";
import { AssetRef, Assets, ImageRef, SfxRef, SheetRef } from "./base/assets.js";
import { Animation, Cel } from "./base/animation.js";
import { Animator } from "./base/animator.js";
import { Rect } from "./base/rect.js";
import { Shape } from "./base/shape.js";
import { Model } from "./base/model.js";

class FiddleAssets extends Assets {

    static init() {
        // static/simple assets
        this.refs.push( Rect.xspec({tag: 'one', width: 20, height: 20, color: 'cyan'})),
        this.refs.push( Rect.xspec({tag: 'two', width: 20, height: 20, color: 'orange'})),
        this.refs.push( Shape.xspec({tag: 'square', borderColor: 'firebrick', fill: false, border: 4})),

        // an audio sfx
        this.refs.push( Sfx.xspec({ tag: "test.sound", audio: new SfxRef({src: 'snd/test.mp3'}) }));

        // an image imported from a media reference
        this.refs.push( Sprite.xspec({tag: 'fairy.static', img: new ImageRef({src: 'img/single.png'})}));
        
        // an image imported from from a sheet media reference
        this.refs.push( Sprite.xspec({tag: 'fairy.one', img: new SheetRef({src: 'img/fairy.png', width: 48, height: 32, x: 0, y: 0})}));

        // a variable sprite...
        this.refs.push( VarSprite.xspec({tag: 'road', variations: [
            new SheetRef({src: 'img/terrain.png', width: 16, height: 16, x: 0, y: 0}),
            new SheetRef({src: 'img/terrain.png', width: 16, height: 16, x: 16, y: 0}),
        ]}));

        // an animation...
        this.refs.push( Animation.xspec({tag: 'torch', x_cels: [
            Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/torch.png', width: 50, height: 100, x: 0, y: 0})}), ttl: 150 }),
            Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/torch.png', width: 50, height: 100, x: 50, y: 0})}), ttl: 150 }),
            Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/torch.png', width: 50, height: 100, x: 100, y: 0})}), ttl: 150 }),
            Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/torch.png', width: 50, height: 100, x: 150, y: 0})}), ttl: 150 }),
        ]}));

        // an animator
        this.refs.push(Animator.xspec({
            tag: 'one.two',
            sketches: {
                'one': new AssetRef({tag: 'one'}),
                'two': new AssetRef({tag: 'two'}),
            },
            state: 'one',
        }));

        // -- placeholder assets

        // a cryo chamber
        this.refs.push(Animator.xspec({
            tag: 'cryo',
            state: 'empty',
            sketches: {
                'empty': new Rect({tag: 'cryo.empty', width: 32, height: 32, fill: false, border: 5, borderColor: 'cyan'}),
                'occupied': new Rect({tag: 'cryo.occupied', width: 32, height: 32, color: 'cyan'}),
            }
        }));

        //this.refs.push(Rect.xspec({tag: 'FLOR', width: 16, height: 16, color: 'rgba(55,148,110,1)'}));
        this.refs.push(Rect.xspec({tag: 'WALL', width: 16, height: 16, color: 'rgba(63,63,116,1)'}));

        this.refs.push(Animator.xspec({
            tag: 'DOOR',
            state: 'closed',
            sketches: {
                'open': new Rect({tag: 'door.open', width: 16, height: 16, color: 'rgba(203,219,252,1)', border: 3, borderColor: 'green', dash: [3,5]}),
                'closed': new Rect({tag: 'door.closed', width: 16, height: 16, color: 'rgba(203,219,252,1)', border: 3, borderColor: 'red'}),
            }
        }));

        this.refs.push(Model.xspec({
            tag: 'FLOR',
            gview: (model) => UxModel.xspec({
                sketch: Rect.xspec({tag: 'FLOR.rect', width: 16, height: 16, color: 'rgba(55,148,110,1)'}),
            }),
        }));

        console.log(`media.init done`);


    }
}