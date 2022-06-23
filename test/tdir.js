import { Direction } from "../js/base/dir.js";

describe("directions", () => {

    let cardinalHeadingTests = [
        {angle: 0, xrslt: Direction.east},
        {angle: Math.PI, xrslt: Direction.west},
        {angle: Math.PI*.5, xrslt: Direction.south},
        {angle: Math.PI*.26, xrslt: Direction.south},
        {angle: Math.PI*.25, xrslt: Direction.south},
        {angle: Math.PI*.24, xrslt: Direction.east},
        {angle: -Math.PI, xrslt: Direction.west},
        {angle: -Math.PI*.5, xrslt: Direction.north},
        {angle: Math.PI*2, xrslt: Direction.east},
        {angle: -Math.PI*2, xrslt: Direction.east},
    ];
    for (const test of cardinalHeadingTests) {
        it(`can determine cardinal from heading ${test.angle}`, ()=>{
            let rslt = Direction.cardinalFromHeading(test.angle)
            expect(rslt).toEqual(test.xrslt);
        });
    }

    let diagonalHeadingTests = [
        {angle: 0, xrslt: Direction.east},
        {angle: Math.PI, xrslt: Direction.west},
        {angle: Math.PI*.75, xrslt: Direction.southWest},
        {angle: Math.PI*.5, xrslt: Direction.south},
        {angle: Math.PI*.25, xrslt: Direction.southEast},
        {angle: -Math.PI, xrslt: Direction.west},
        {angle: -Math.PI*.25, xrslt: Direction.northEast},
        {angle: -Math.PI*.5, xrslt: Direction.north},
        {angle: -Math.PI*.75, xrslt: Direction.northWest},
        {angle: Math.PI*.126, xrslt: Direction.southEast},
        {angle: Math.PI*.125, xrslt: Direction.southEast},
        {angle: Math.PI*.124, xrslt: Direction.east},
        {angle: Math.PI*2, xrslt: Direction.east},
        {angle: -Math.PI*2, xrslt: Direction.east},
    ];
    for (const test of diagonalHeadingTests) {
        it(`can determine diagonal from heading ${test.angle}`, ()=>{
            let rslt = Direction.diagonalFromHeading(test.angle)
            expect(rslt).toEqual(test.xrslt);
        });
    }

});