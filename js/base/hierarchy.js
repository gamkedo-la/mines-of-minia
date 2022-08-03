export { Hierarchy }

class Hierarchy {

    // STATIC METHODS ------------------------------------------------------
    static adopt(parent, child) {
        // ensure child is orphaned
        if (child.parent) {
            this.orphan(child);
        }
        // avoid cycles in parent
        if (this.findInRoot(parent, (v) => v === child)) {
            console.error(`hierarchy loop detected ${child} already in root for parent: ${parent}`);
            return;
        }
        // avoid cycles in children
        if ('children' in parent) {
            if (this.find(child, (v) => v === parent)) {
                console.error(`hierarchy loop detected ${child} already in children of parent: ${parent}`);
                return;
            }
        }
        // assign parent/child links
        child.parent = parent;
        if ('children' in parent) parent.children.push(child);
        // event handling
        if (parent.evt) {
            parent.evt.trigger(parent.constructor.evtAdopted, {actor: parent, child: child});
        }
        if (child.evt) child.evt.trigger(child.constructor.evtRooted, {actor: child, root: this.root(parent)});
        for (const dec of this.children(child, (v) => v.evt)) {
            dec.evt.trigger(dec.constructor.evtRooted, {actor: dec, root: this.root(parent)});
        }
    }

    static orphan(child) {
        if (child.parent) {
            let parent = child.parent;
            if ('children' in parent) {
                let idx = parent.children.indexOf(child);
                if (idx != -1) {
                    parent.children.splice(idx, 1);
                }
            }
            child.parent = null;
            if (parent.evt && 'evtOrphaned' in parent.constructor) {
                parent.evt.trigger(parent.constructor.evtOrphaned, {actor: parent, child: child});
            }
        }
    }

    /**
     * find root for given object
     * @param {*} obj 
     */
    static root(obj) {
        while(obj && obj.parent) obj = obj.parent;
        return obj;
    }

    /**
     * find object in entire hierarchy
     * @param {*} obj 
     * @param {*} filter 
     */
    static findInRoot(obj, filter) {
        return this.find(this.root(obj), filter);
    }

    /**
     * find object in hierarchy (evaluating object and its children)
     * @param {*} obj 
     * @param {*} filter 
     */
    static find(obj, filter) {
        if (filter(obj)) return obj;
        for (const child of (obj.children || [])) {
            if (filter(child)) return child;
            let match = this.find(child, filter);
            if (match) return match;
        }
        return null;
    }

    /**
     * find object in parent hierarchy (evaluating parent hierarchy)
     * @param {*} obj 
     * @param {*} filter 
     */
    static findInParent(obj, filter) {
        for (let parent = obj.parent; parent; parent = parent.parent) {
            if (filter(parent)) return parent;
        }
        return null;
    }

    static *children(obj, filter) {
        for (const child of (Array.from(obj.children || []))) {
            if (child.children) {
                yield *this.children(child, filter);
            }
            if (!filter || filter(child)) yield child;
        }
    }

}