export { CollisionSystem };

import { System } from "../system.js";
import { Events } from "../event.js";
import { Bounds } from "../bounds.js";
import { Util } from "../util.js";
import { Entity } from "../entity.js";
import { Fmt } from "../fmt.js";

class CollisionSystem extends System {
    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.findBounds = spec.findBounds || ((b, cb) => []);
        // -- events
        this.evtEntityIntent = spec.evtEntityIntent || Entity.evtIntent;
        this.evtEntityCollided = spec.evtEntityCollided || Entity.evtCollided;
        // -- bind event handlers
        this.onEntityIntent = this.onEntityIntent.bind(this);
        Events.listen(this.evtEntityIntent, this.onEntityIntent);
    }

    // EVENT HANDLERS ------------------------------------------------------

    onEntityIntent(evt) {
        if (!evt.update || !evt.update.xform) return;
        this.checkForCollision(evt.actor, evt.update)
    }

    // METHODS -------------------------------------------------------------
    matchPredicate(e) {
        return 'collider' in e;
    }

    _checkColliders(ox1, oy1, x1, y1, c1, x2, y2, c2) {
        // check overlap w/ any colliders
        if (c1.blockedBy & c2.blocks) {
            // check axis independently
            // -- x first
            let xintersect = Bounds._intersects(x1+c1.minx, oy1+c1.miny, x1+c1.maxx, oy1+c1.maxy, x2+c2.minx, y2+c2.miny, x2+c2.maxx, y2+c2.maxy);
            if (xintersect) {
                // moving right
                if (x1>ox1) {
                    x1 = xintersect.minx-c1.maxx;
                // moving left
                } else {
                    x1 = xintersect.maxx-c1.minx;
                }
            }
            let yintersect = Bounds._intersects(x1+c1.minx, y1+c1.miny, x1+c1.maxx, y1+c1.maxy, x2+c2.minx, y2+c2.miny, x2+c2.maxx, y2+c2.maxy);
            if (yintersect) {
                // moving down
                if (y1>oy1) {
                    y1 = yintersect.miny-c1.maxy;
                // moving up
                } else {
                    y1 = yintersect.maxy-c1.miny;
                }
            }
            return [x1, y1, Bounds.newOrExtend(xintersect, yintersect)];
        }

        return [x1, y1, false];
    }

    checkForCollision(e, update) {
        let x = update.xform.x;
        let y = update.xform.y;
        for (const ec of (e.collider ? (Util.iterable(e.collider) ? e.collider : [e.collider]) : [])) {
            let bounds = new Bounds(x+ec.minx, y+ec.miny, ec.width, ec.height);
            for (const other of this.findBounds(bounds, (v) => (v !== e && 'collider' in v && v.layer === e.layer))) {
                let hits = [];
                for (const oc of (other.collider ? (Util.iterable(other.collider) ? other.collider : [other.collider]) : [])) {
                    const [xp, yp, hit] = this._checkColliders(e.xform.x, e.xform.y, update.xform.x, update.xform.y, ec, other.xform.x, other.xform.y, oc);
                    if (hit) {
                        hits.push(hit);
                        x = xp;
                        y = yp;
                    }
                }
                if (hits.length) {
                    // trigger collision event
                    let data = {
                        actor: e,
                        target: other,
                        hits: hits,
                    };
                    e.evt.trigger(e.constructor.evtCollided, data);
                    other.evt.trigger(e.constructor.evtCollided, data);
                }
            }
        }
        // manage event update
        // FIXME: broken by changes to how updates are made to entities through update system, changes are now made on intent, so this needs to update the value in the 
        // entity, not the update
        if (x !== update.xform.x || y !== update.xform.y) {
            update.xform.x = x;
            update.xform.y = y;
        }
    }

}