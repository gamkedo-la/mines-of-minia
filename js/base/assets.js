export { 
    Assets,
    AssetRef,
    ImageRef,
    SfxRef,
    SheetRef,
};

import { FileLoader } from "./fileLoader.js";
import { Fmt } from "./fmt.js";
import { Generator } from "./generator.js";
import { Util } from "./util.js";

class BaseRef {
    constructor(spec={}) {
        if (spec.src) this.src = spec.src;
    }

    resolve(media) {
        return Promise.resolve(media);
    }

    resolveImage(media, encode=true) {
        let promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.addEventListener('load', () => { 
                return resolve( img );
            });
            img.addEventListener('error', err => { console.error('error: ' + Fmt.ofmt(err)); reject(err) });
            let src = (encode) ? `data:image/png;base64,${Util.arrayBufferToBase64(media)}` : media;
            img.src = src;
        });
        return promise;
    }
}

class SfxRef extends BaseRef {}

class ImageRef extends BaseRef {
    static _canvas;
    static _ctx;

    static get canvas() {
        if (!this._canvas) this.init();
        return this._canvas;
    }

    static get ctx() {
        if (!this._ctx) this.init();
        return this._ctx;
    }

    static init() {
        this._canvas = document.createElement('canvas');
        this._ctx = this.canvas.getContext('2d');
    }

    constructor(spec={}) {
        super(spec);
        this.scalex = spec.scalex || 1;
        this.scaley = spec.scaley || 1;
        if (spec.scale) {
            this.scalex = spec.scale;
            this.scaley = spec.scale;
        }
    }
    resolve(media) {
        let promise = this.resolveImage(media);
        if (this.scalex === 1 || this.scaley === 1) {
            return promise;
        } else {
            return promise.then(img => {
                let canvas = this.constructor.canvas;
                let ctx = this.constructor.ctx;
                canvas.width = this.width*this.scalex;
                canvas.height = this.height*this.scaley;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
                return this.resolveImage(canvas.toDataURL(), false);
            });
        }
    }
}

class SheetRef extends BaseRef {
    static _canvas;
    static _ctx;

    static get canvas() {
        if (!this._canvas) this.init();
        return this._canvas;
    }

    static get ctx() {
        if (!this._ctx) this.init();
        return this._ctx;
    }

    static init() {
        this._canvas = document.createElement('canvas');
        this._ctx = this.canvas.getContext('2d');
    }

    constructor(spec={}) {
        super(spec);
        if (spec.dbg) this.dbg = spec.dbg;
        this.width = spec.width || 0;
        this.height = spec.height || 0;
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        this.scalex = spec.scalex || 1;
        this.scaley = spec.scaley || 1;
        if (spec.scale) {
            this.scalex = spec.scale;
            this.scaley = spec.scale;
        }
    }

    resolve(media) {
        let promise = this.resolveImage(media);
        return promise.then(img => {
            let canvas = this.constructor.canvas;
            let ctx = this.constructor.ctx;
            canvas.width = this.width*this.scalex;
            canvas.height = this.height*this.scaley;
            if (this.scalex !== 1 || this.scaley !== 1) console.log(`dim: ${this.width},${this.height} resolved: ${canvas.width},${canvas.height}`)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, this.x, this.y, this.width, this.height, 0, 0, canvas.width, canvas.height);
            return this.resolveImage(canvas.toDataURL(), false);
        });
    }
}

class AssetRef extends BaseRef {
    static xspec(spec={}) {
        return Object.assign({cls: 'AssetRef'}, spec);
    }
    constructor(spec={}) {
        super(spec);
        Object.assign(this, spec);
    }
}

class Assets {
    // STATIC VARIABLES ----------------------------------------------------
    static refs = [];
    static _main;

    // STATIC PROPERTIES ---------------------------------------------------
    static get main() {
        if (!Assets._main) Assets._main = new Assets();
        return Assets._main;
    }

    static set main(v) {
        if (this._main !== v) {
            this._main = v;
        }
    }

    // STATIC METHODS ------------------------------------------------------
    static init() {}
    static get(tag, generate=false, overrides={}) {
        return this.main.get(tag, generate, overrides);
    }
    static add(tag, asset) {
        this.main.add(tag, asset);
    }

    static resolveAssetRefs(spec, assets={}, generator) {
        if (!assets) assets = this.main;
        if (!generator) generator = new Generator();
        for (const [k,v,o] of Util.kvWalk(spec)) {
            if (v instanceof AssetRef) {
                // lookup asset reference
                let spec = assets[v.tag];
                if (spec) {
                    // apply AssetRef overrides to asset specification
                    spec = Object.assign({}, spec, v);
                    // generate asset
                    let asset = this.generator.generate(spec);
                    // swap reference
                    o[k] = asset;
                }
            }
        }
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        // the asset references defined by the user...
        this.refs = spec.refs || this.constructor.refs.slice();
        // the raw media loaded from media files
        this.media = {};
        // the translate asset references with resolved media files
        this.assets = {};
        if (!Assets._main || spec.main) Assets._main = this;
        this.generator = spec.generator || new Generator();
        this.extends = spec.extends;
    }

    // METHODS -------------------------------------------------------------
    getMediaRefs() {
        let mrefs = [];
        for (const [k,v,o] of Util.kvWalk(this.refs)) {
            if (v instanceof BaseRef && v.src && !mrefs.includes(v.src)) {
                mrefs.push(v.src);
            }
        }
        return mrefs;
    }

    async load() {
        // load asset files
        await FileLoader.load(this.getMediaRefs(), this.media);
        // populate assets
        for (const ref of this.refs) {
            let tag = ref.tag || 'tag';
            if (this.assets.hasOwnProperty(tag)) {
                console.error(`duplicate asset tag detected: ${tag}, previous definition: ${Fmt.ofmt(this.assets[tag])}, skipping: ${Fmt.ofmt(ref)}`);
                continue;
            }
            ref.assetTag = tag;
            this.assets[tag] = ref;
        }
        // resolve media references
        await this.resolve();
        // resolve asset references
        this.resolveAssets();
    }

    async resolve() {
        return new Promise( (resolve) => {
            let promises = [];
            for (const [k,v,o] of Util.kvWalk(this.assets)) {
                if (v instanceof BaseRef && !(v instanceof AssetRef)) {
                    // lookup media reference
                    let media = this.media[v.src];
                    let promise = v.resolve(media);
                    promise.then( (media) => {
                        if (this.dbg) console.log(`resolved k: ${k} v: ${Fmt.ofmt(v)} with media: ${media}`);
                        o[k] = media;
                    });
                    promises.push(promise);
                }
            }
            return Promise.all(promises).then(() => {
                if (this.dbg) console.log('resolve finished');
                resolve();
            });
        });
    }

    resolveAssets() {
        for (const [k,v,o] of Util.kvWalk(this.assets)) {
            if (v instanceof AssetRef) {
                let spec = this.assets[v.tag];
                if (spec) {
                    // apply AssetRef overrides to asset specification
                    spec = Object.assign({}, spec, v);
                    // generate asset
                    let asset = this.generator.generate(spec);
                    //console.log(`-- resolved ${v.tag} with ${asset}`);
                    // swap reference
                    o[k] = asset;
                }
            }
        }

    }

    get(tag, generate=false, overrides={}) {
        let spec = this.assets[tag];
        if (!spec && this.extends) spec = this.extends.get(tag);
        spec = Object.assign({}, spec, overrides);
        if (generate) {
            return this.generator.generate(spec);
        }
        return spec;
    }

    add(tag, asset) {
        asset.tag = tag;
        this.assets[tag] = asset;
    }

}
