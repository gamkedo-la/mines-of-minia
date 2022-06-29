import { Attack } from "../js/actions/attack.js";
import { Fmt } from "../js/base/fmt.js";
import { Dice } from "../js/dice.js";

describe("a die", () => {

    it("a d6 can be rolled", ()=>{
        let die = new Dice();
        let rolls = {};
        for (let i=0; i<100; i++) {
            let v = die.roll();
            expect(v >= 1 && v <= 6).toBeTruthy();
            rolls[v] = (rolls[v]) ? rolls[v]+1 : 1;
        }
        for (const [k,v] of Object.entries(rolls)) {
            console.log(`rolled: ${k} => ${v} times`);
        }
    });

    it("a d20 can be rolled", ()=>{
        let die = new Dice(20);
        let rolls = {};
        for (let i=0; i<100; i++) {
            let v = die.roll();
            expect(v >= 1 && v <= 20).toBeTruthy();
            rolls[v] = (rolls[v]) ? rolls[v]+1 : 1;
        }
        for (const [k,v] of Object.entries(rolls)) {
            console.log(`rolled: ${k} => ${v} times`);
        }
    });

});

/*
describe("a roll", () => {

    it("can be generated from a string", ()=>{
        let roll = Roll.fromStr('8d6H5-1');
        roll.roll();
    });

    it("can be computed", ()=>{
        let roll = new Roll({dice: [new Dice(12), new Dice(12)]});
        roll.roll();
    });

});
*/

describe("an attack implementation", () => {

    // hit tests
    for (const test of [
        {args: [{wpnp: {'sword': 90}, lvl: 10, agi: 15, str: 12}, {defr: 10}, {kind: 'sword', str: 15}], xrslt: true},
        {args: [{wpnp: {'sword': 90}, lvl: 10, agi: 15, str: 11}, {defr: 10}, {kind: 'sword', str: 15}], xrslt: true},
        {args: [{wpnp: {'sword': 90}, lvl: 10, agi: 15, str: 10}, {defr: 10}, {kind: 'sword', str: 15}], xrslt: true},
        //{args: [{wpnp: 1}, {defr: 10, dodger: 10, blockr: 10}, {acc: 1}], xrslt: true},
        //{args: [{wpnp: 10}, {defr: 1, dodger: 1, blockr: 1}, {acc: 10}], xrslt: true},
    ]) {
        it(`can check hit ${Fmt.ofmt(test.args)}`, ()=>{
            let hits = 0;
            for (let i=0; i<100; i++) {
                if (Attack.hit(...test.args)) hits++;
            }
            console.log(`${Fmt.ofmt(test.args)} hits: ${hits}`);
            expect(hits >= 1 && hits < 100).toBeTruthy();
        });
    }

});