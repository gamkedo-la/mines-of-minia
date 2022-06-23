export { UxCanvas };

    import { Fmt } from './fmt.js';
import { Hierarchy } from './hierarchy.js';
import { UxView } from './uxView.js';
import { XForm } from './xform.js';

/** ========================================================================
 * class representing base canvas as a UI view
 */
class UxCanvas extends UxView {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltCanvasID = 'game.canvas';
    static dfltCanvas;
    static _initialized = false;

    // STATIC PROPERTIES ---------------------------------------------------
    static getCanvas(id=this.dfltCanvasID) {
        if (!this._initialized) this._init();
        if (id === this.dfltCanvasID) return this.dfltCanvas;
        let cvs = document.getElementById(id);
        if (cvs) return cvs;
        cvs = document.createElement('canvas');
        cvs.id = id;
        document.body.appendChild(cvs);
        return cvs;
    }

    // STATIC METHODS ------------------------------------------------------
    static init(dfltCanvasID) {
        // set initial canvas id
        if (dfltCanvasID) this.dfltCanvasID = dfltCanvasID;
        // discover all canvas elements currently associated with global context
        // -- look for default canvas
        let canvases = Array.from(document.getElementsByTagName('canvas'));
        for (const canvas of canvases) {
            if (canvas.id === this.dfltCanvasID) {
                this.dfltCanvas = canvas;
                break;
            }
        }
        // default canvas was not found...
        if (!this.dfltCanvas) {
            // -- can't find canvas w/ given default id... assume a new one
            if (canvases.length) {
                console.log(`can't find canvas with id: ${this.dfltCanvasID}, using ${canvases[0].id} instead`);
                this.dfltCanvas = canvases[0];
                this.dfltCanvasID = this.dfltCanvas.id;
            // -- no game canvas found... create a new one
            } else {
                this.dfltCanvas = document.createElement('canvas');
                this.dfltCanvas.id = this.dfltCanvasID;
                document.body.appendChild(this.dfltCanvas);
            }
        }
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpre(spec) {
        if (!spec.hasOwnProperty('cvsid')) spec.cvsid = this.constructor.dfltCanvasID;
        if (!spec.hasOwnProperty('canvas')) spec.canvas = UxCanvas.getCanvas(spec.cvsid);
        if (!spec.hasOwnProperty('xform')) spec.xform = new XForm({origx: 0, origy: 0, width: spec.canvas.width, height: spec.canvas.height});
    }
    cpost(spec) {
        super.cpost(spec);
        this.cvs = spec.canvas;
        this.ctx = this.cvs.getContext('2d');
        if (this.xform.width !== this.cvs.width) this.cvs.width = this.xform.width;
        if (this.xform.height !== this.cvs.height) this.cvs.height = this.xform.height;
        // -- setup event handlers
        this.onWindowResize = this.onWindowResize.bind(this);
        if (this.autosize) {
            this.onWindowResize();  // resize now...
            window.addEventListener('resize', this.onWindowResize); // resize when window resizes
        }
    }

    destroy() {
        window.removeEventListener('resize', this.onWindowResize); // resize when window resizes
        super.destroy();
    }

    // METHODS -------------------------------------------------------------
    onWindowResize() {
        // FIXME: should this be propagated to children?
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.cvs.width = width;
        this.cvs.height = height;
        this.xform.width = width;
        this.xform.height = height;
        this.evt.trigger(this.constructor.evtResized, {actor: this, width: width, height: height});
        for (const child of Hierarchy.children(this)) {
            child.evt.trigger(child.constructor.evtResized, {actor: child, root: this});
        }
        this.evt.trigger(this.constructor.evtUpdated, {actor: this});
    }  

}