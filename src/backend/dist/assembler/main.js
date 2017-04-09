import { MIPSAssembler } from "./assembler";
import testcode from "./asm_test";
import { disassmble } from "./disassmbler";
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 1/21/2017
 */
export const op_mask = 0xFC000000;
export const $1_mask = 0x03E00000;
export const $2_mask = 0x001F0000;
export const $3_mask = 0x0000F800;
export const shamt_mask = 0x000007C0;
export const funct_mask = 0x0000003F;
export const imm_mask = 0x0000FFFF;
export const target_mask = 0x07FFFFFF;
function addFrontZero(str) {
    str = '000000000000' + str;
    return str.substring(str.length - 8, str.length);
}
function view(int) {
    return `raw: ${addFrontZero(int.toString(16))} opcode :${(int & op_mask) >> 26}; $1 : ${(int & $1_mask) >> 21}; $2 : ${(int & $2_mask) >> 16};`
        + `$3 : ${(int & $3_mask) >> 11}; shamt : ${(int & shamt_mask) >> 6}; funct  ${(int & funct_mask)}`
        + `imm : ${(int & imm_mask)}`;
}
const asmer = new MIPSAssembler();
const program = asmer.parse(testcode);
for (let i = 0; i <= 50; i++) {
    let x = program.getUint32(i * 4);
    console.log(`${addFrontZero((i * 4).toString(16))}:${addFrontZero(x.toString(16))}###` + disassmble(x));
}
//# sourceMappingURL=main.js.map