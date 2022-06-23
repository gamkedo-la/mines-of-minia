export { Config };

/**
 * Static class that stores project wide configuration
 */
class Config {
    static init(spec={}) {
        console.log(`config.init`);
        Object.assign(this, spec);
    }
}