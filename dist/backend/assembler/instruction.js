"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
    asm template lang
    ['s','f','g'
 */
var OpCodeRRR = {
    "add": 0x00,
    "addu": 0x00,
    "sub": 0x00,
    "subu": 0x00,
    "slt": 0x00,
    "sltu": 0x00,
    "and": 0x00,
    "or": 0x00,
    "xor": 0x00,
    "nor": 0x00,
    "sllv": 0x00,
    "srlv": 0x00,
    "srav": 0x00,
    "__sll": 0x00,
    "__srl": 0x00,
    "__sra": 0x00,
    //pseudo command
    "__mult": 0x00,
    "__multu": 0x00,
    "__div": 0x00,
    "__divu": 0x00,
    "__jalr": 0x00,
    "__mfhi": 0x00,
    "__mflo": 0x00,
    "__mthi": 0x00,
    "__mtlo": 0x00,
    "__jr": 0x00,
};
var OpCodeRRN = {
    "j": 0x2,
    "beq": 0x4,
    "bne": 0x5,
    "addi": 0x8,
    "addiu": 0x9,
    "andi": 0xc,
    "ori": 0xd,
    "xori": 0xe,
    "lui": 0xf,
    "slti": 0xa,
    "sltiu": 0xb,
    "lb": 0x20,
    "lh": 0x21,
    "lw": 0x23,
    "sb": 0x28,
    "sh": 0x29,
    "sw": 0x2B,
    "lbu": 0x24,
    "lhu": 0x25,
    //pseudo command
    "__bgez": 0x1,
    "__bgtz": 0x7,
    "__blez": 0x6,
    "__bltz": 0x1,
    "__lui": 0xf
};
exports.Register = {
    "$zero": 0, "$at": 1, "$v0": 2, "$v1": 3,
    "$a0": 4, "$a1": 5, "$a2": 6, "$a3": 7,
    "$t0": 8, "$t1": 9, "$t2": 10, "$t3": 11, "$t4": 12, "$t5": 13, "$t6": 14, "$t7": 15,
    "$s0": 16, "$s1": 17, "$s2": 18, "$s3": 19, "$s4": 20, "$s5": 21, "$s6": 22, "$s7": 23,
    "$s8": 24, "$s9": 25, "$k0": 26, "$k1": 27,
    "$gp": 28, "$sp": 29, "$fp": 30, "$ra": 31,
    "$pc": 32,
    "$hi": 33,
    "$lo": 34
};
var FunctArith = {
    "add": 0x20,
    "addu": 0x21,
    "sub": 0x22,
    "subu": 0x23,
    "mul": 0x18,
    "and": 0x24,
    "or": 0x25,
    "xor": 0x26,
    "nor": 0x27,
    "slt": 0x2A,
    "sltu": 0x2B,
    "sllv": 0x04,
    "srlv": 0x06,
    "srav": 0x07,
    "__sll": 0x00,
    "__srl": 0x02,
    "__sra": 0x03,
    "__jalr": 0x9,
    "__mfhi": 0x10,
    "__mflo": 0x12,
    "__mthi": 0x11,
    "__mtlo": 0x13,
    "__mult": 0x18,
    "__multu": 0x19,
    "__div": 0x1a,
    "__divu": 0x1b,
    "__jr": 0x8,
};
var PseudoRR = {
    "move": function ($1, $2) { return buildAsmInstructionRRR("addu", $1, "$zero", $2); },
    "div": function ($1, $2) { return buildAsmInstructionRRR("__div", "$zero", $1, $2); },
    "divu": function ($1, $2) { return buildAsmInstructionRRR("__divu", "$zero", $1, $2); },
    "mult": function ($1, $2) { return buildAsmInstructionRRR("__mult", "$zero", $1, $2); },
    "multu": function ($1, $2) { return buildAsmInstructionRRR("__multu", "$zero", $1, $2); },
    "jalr": function ($1, $2) { return buildAsmInstructionRRR("__jalr", $2, $1, "$zero"); },
};
var PseudoR = {
    "mfhi": function ($1) { return buildAsmInstructionRRR("__mfhi", $1, "$zero", "$zero"); },
    "mflo": function ($1) { return buildAsmInstructionRRR("__mflo", $1, "$zero", "$zero"); },
    "mthi": function ($1) { return buildAsmInstructionRRR("__mthi", "$zero", $1, "$zero"); },
    "mtlo": function ($1) { return buildAsmInstructionRRR("__mtlo", "$zero", $1, "$zero"); },
    "jr": function ($1) { return buildAsmInstructionRRR("__jr", "$zero", $1, "$zero"); },
};
var PseudoRN = {
    "bgez": function ($1, num) { return buildAsmInstructionRRN("__bgez", "$at", $1, num); },
    "bgtz": function ($1, num) { return buildAsmInstructionRRN("__bgtz", "$zero", $1, num); },
    "blez": function ($1, num) { return buildAsmInstructionRRN("__blez", "$zero", $1, num); },
    "bltz": function ($1, num) { return buildAsmInstructionRRN("__bltz", "$zero", $1, num); },
    "lui": function ($1, num) { return buildAsmInstructionRRN("__lui", $1, "$zero", num); },
    "li": function ($1, num) { return num > 0xFFFF ? [
        buildAsmInstructionRRN("__lui", $1, "$zero", num >>> 16),
        buildAsmInstructionRRN("addi", $1, "$zero", num & 0xFFFF)
    ] : buildAsmInstructionRRN("addi", $1, "$zero", num); }
};
var PesudoRRS = {
    "sra": function ($1, $2) { return buildAsmInstructionRRR("__sra", $1, "$zero", $2); },
    "srl": function ($1, $2) { return buildAsmInstructionRRR("__srl", $1, "$zero", $2); },
    "sll": function ($1, $2) { return buildAsmInstructionRRR("__sll", $1, "$zero", $2); },
};
function buildAsmInstructionRR(opcode, $1, $2) {
    if (!PseudoRR.hasOwnProperty(opcode)) {
        console.log("buildAsmFailed at " + opcode);
        return 0;
    }
    return PseudoRR[opcode]($1, $2);
}
exports.buildAsmInstructionRR = buildAsmInstructionRR;
/** $1->rd $2->rs $3->rt **/
function buildAsmInstructionRRR(opcode, rd, rs, rt) {
    if (!OpCodeRRR.hasOwnProperty(opcode) || !FunctArith.hasOwnProperty(opcode) || !exports.Register.hasOwnProperty(rd) ||
        !exports.Register.hasOwnProperty(rs) || !exports.Register.hasOwnProperty(rt)) {
        console.log("buildAsmFailed at " + opcode);
        return 0;
    }
    var op = OpCodeRRR[opcode], r1 = exports.Register[rd], r2 = exports.Register[rs], r3 = exports.Register[rt], funct = FunctArith[opcode];
    return (op << 26) | (r2 << 21) | (r3 << 16) | (r1 << 11) | funct;
}
exports.buildAsmInstructionRRR = buildAsmInstructionRRR;
/** $1->rt $2->rs  **/
function buildAsmInstructionRRN(opcode, rt, rs, num) {
    if (!OpCodeRRN.hasOwnProperty(opcode) || !exports.Register.hasOwnProperty(rt) ||
        !exports.Register.hasOwnProperty(rs)) {
        if (PesudoRRS.hasOwnProperty(opcode))
            return PesudoRRS[opcode](rt, rs) | ((num & 0x1F) << 6);
        console.log("buildAsmFailed at " + opcode);
        return 0;
    }
    var op = OpCodeRRN[opcode], r1 = exports.Register[rt], r2 = exports.Register[rs], offset = num & 0xFFFF;
    return (op << 26) | (r2 << 21) | (r1 << 16) | offset;
}
exports.buildAsmInstructionRRN = buildAsmInstructionRRN;
function buildAsmInstructionRN(opcode, $1, num) {
    if (!PseudoRN.hasOwnProperty(opcode)) {
        console.log("buildAsmFailed at " + opcode);
        return 0;
    }
    return PseudoRN[opcode]($1, num);
}
exports.buildAsmInstructionRN = buildAsmInstructionRN;
function buildAsmInstructionN(opcode, num) {
    if (opcode == "j")
        return 0x8000000 | num; //jump
    if (opcode == "jal")
        return 0xc000000 | num; //jal
    if (opcode == "break")
        return (num << 6) + 0xd;
    console.log("bad pos 1");
    return 0;
}
exports.buildAsmInstructionN = buildAsmInstructionN;
function buildAsmInstructionR(opcode, $1) {
    if (!PseudoR.hasOwnProperty(opcode)) {
        console.log("buildAsmFailed at " + opcode);
        return 0;
    }
    return PseudoR[opcode]($1);
}
exports.buildAsmInstructionR = buildAsmInstructionR;
//# sourceMappingURL=instruction.js.map