export { Font };

class Font {
    static dfltFamily = 'sans-serif';

    // STATIC PROPERTIES ---------------------------------------------------
    static get dflt() {
        return new Font();
    }

    constructor(spec={}) {
        this.style = spec.style || 'normal';
        this.variant = spec.variant || 'normal';
        this.weight = spec.weight || 'normal';
        this.size = spec.size || 12;
        this.family = spec.family || this.constructor.dfltFamily;
    }

    copy(overrides={}) {
        return new Font(Object.assign({
            style: this.style,
            variant: this.variant,
            weight: this.weight,
            size: this.size,
            family: this.family,
        }, overrides));
    }

    toString() {
        return [this.style, this.variant, this.weight, (this.size.toString() + 'px'), this.family].join(' ');
    }
}