import { Events } from "./base/event.js";
import { Minia } from "./minia.js";
import { Game } from "./base/game.js";

/** ========================================================================
 * start the game when page is loaded
 */
window.onload = async function() {
    let lastUpdate = Math.round(performance.now());
    let frame = 0;
    let started = false;
    let deltaTime = 0;
    let fps = 115;
    let overflow = 0;
    let fpsInterval = (fps) ? 1000/fps : 0;
    const maxDeltaTime = 1000/20;
    const evt = Events.main;

    // start the game
    Minia.start();

    window.requestAnimationFrame(loop);

    function loop(hts) {
        // handle start
        if (!started) {
            evt.trigger(Game.evtStarted);
            started = true;
        }
        // increment frame counter
        frame++;
        if (frame > Number.MAX_SAFE_INTEGER) frame = 0;
        // compute delta time
        deltaTime = hts - lastUpdate
        if (!fpsInterval || deltaTime>=fpsInterval-overflow) {
            if (fpsInterval) overflow = Math.max(0, deltaTime - fpsInterval);
            deltaTime = Math.min(maxDeltaTime, deltaTime);
            lastUpdate = hts;
            evt.trigger(Game.evtTock, { deltaTime: parseInt(deltaTime), frame: frame });
        }
        // next iteration
        window.requestAnimationFrame(loop);
    }

}
