export { Registry };

import { Animation, Cel } from './animation.js';
import { Animator } from './animator.js';
import { Entity } from './entity.js';
import { Gizmo } from './gizmo.js';
import { Model } from './model.js';
import { Rect } from './rect.js';
import { Sfx } from './sfx.js';
import { Shape } from './shape.js';
import { Sketch } from './sketch.js';
import { Sprite } from './sprite.js';
import { StretchSprite } from './stretchSprite.js';
import { Text } from "./text.js";
import { UxButton } from './uxButton.js';
import { UxCanvas } from './uxCanvas.js';
import { UxDbg } from './uxDbg.js';
import { UxFader } from './uxFader.js';
import { UxGrid } from './uxGrid.js';
import { UxInput } from './uxInput.js';
import { UxMask } from './uxMask.js';
import { UxPanel } from './uxPanel.js';
import { UxSlider } from './uxSlider.js';
import { UxText } from './uxText.js';
import { UxToggle } from './uxToggle.js';
import { VarSprite } from './varSprite.js';
import { XForm } from './xform.js';

class Registry {
    static entries = new Map([
        ['Animation', Animation],
        ['Animator', Animator],
        ['Cel', Cel],
        ['Entity', Entity],
        ['Gizmo', Gizmo],
        ['Model', Model],
        ['Rect', Rect],
        ['Sfx', Sfx],
        ['Shape', Shape],
        ['Sketch', Sketch],
        ['Sprite', Sprite],
        ['StretchSprite', StretchSprite],
        ['Text', Text],
        ['UxButton', UxButton],
        ['UxCanvas', UxCanvas],
        ['UxDbg', UxDbg],
        ['UxFader', UxFader],
        ['UxGrid', UxGrid],
        ['UxInput', UxInput],
        ['UxMask', UxMask],
        ['UxPanel', UxPanel],
        ['UxSlider', UxSlider],
        ['UxText', UxText],
        ['UxToggle', UxToggle],
        ['VarSprite', VarSprite],
        ['XForm', XForm],
    ]);

    static get(tag) {
        return this.entries.get(tag);
    }

    static add(cls) {
        let key = cls.prototype.constructor.name;
        this.entries.set(key, cls);
    }

    static extend(classes) {
        for (const cls of classes) this.add(cls);
    }
}