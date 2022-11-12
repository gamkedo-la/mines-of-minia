export { Config };

/**
 * Static class that stores project wide configuration
 */
class Config {
    static init(spec={}) {
        Object.assign(this, spec);
    }
}