"use strict";
const assembler_1 = require("./assembler");
const asm_test_1 = require("./asm_test");
const disassmbler_1 = require("./disassmbler");
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 1/21/2017
 */
exports.op_mask = 0xFC000000;
exports.$1_mask = 0x03E00000;
exports.$2_mask = 0x001F0000;
exports.$3_mask = 0x0000F800;
exports.shamt_mask = 0x000007C0;
exports.funct_mask = 0x0000003F;
exports.imm_mask = 0x0000FFFF;
exports.target_mask = 0x07FFFFFF;
function addFrontZero(str) {
    str = '000000000000' + str;
    return str.substring(str.length - 8, str.length);
}
function view(int) {
    return `raw: ${addFrontZero(int.toString(16))} opcode :${(int & exports.op_mask) >> 26}; $1 : ${(int & exports.$1_mask) >> 21}; $2 : ${(int & exports.$2_mask) >> 16};`
        + `$3 : ${(int & exports.$3_mask) >> 11}; shamt : ${(int & exports.shamt_mask) >> 6}; funct  ${(int & exports.funct_mask)}`
        + `imm : ${(int & exports.imm_mask)}`;
}
const asmer = new assembler_1.MIPSAssembler();
const program = asmer.parse(asm_test_1.default);
for (let i = 0; i <= 50; i++) {
    let x = program.getUint32(i * 4);
    console.log(`${addFrontZero((i * 4).toString(16))}:${addFrontZero(x.toString(16))}###` + disassmbler_1.disassmble(x));
}
//# sourceMappingURL=main.js.map 
//# sourceMappingURL=main.js.map