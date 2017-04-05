"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 2017/3/9
 */
var reg = {
    "$zero": 0, "$at": 1, "$v0": 2, "$v1": 3,
    "$a0": 4, "$a1": 5, "$a2": 6, "$a3": 7,
    "$t0": 8, "$t1": 9, "$t2": 10, "$t3": 11, "$t4": 12, "$t5": 13, "$t6": 14, "$t7": 15,
    "$s0": 16, "$s1": 17, "$s2": 18, "$s3": 19, "$s4": 20, "$s5": 21, "$s6": 22, "$s7": 23,
    "$s8": 24, "$s9": 25, "$k0": 26, "$k1": 27,
    "$gp": 28, "$sp": 29, "$fp": 30, "$ra": 31
};
var ins = {
    rrr: function (op, funct) { return function (rd, rs, rt, imm) { return (op << 26) | (reg[rs] << 21) | (reg[rt] << 16) | (reg[rd] << 11) | funct; }; },
    rrn: function (op) { return function (rd, rs, rt, imm) { return (op << 26) | (reg[rs] << 21) | (reg[rt] << 16) | (imm & 0xFFFF); }; },
    rrs: function (op, funct) { return function (rd, rs, rt, imm) { return (op << 26) | (reg[rs] << 21) | (reg[rt] << 16) | ((imm & 0x1F) << 6) | funct; }; },
};
var mapper = {
    st: function ($1, $2, $3) { return [0, $1, $2, 0]; },
    dti: function ($1, $2, $3) { return [$1, 0, $2, $3]; },
    dst: function ($1, $2, $3) { return [$1, $2, $3, 0]; },
    dts: function ($1, $2, $3) { return [$1, $3, $2, 0]; },
    tis: function ($1, $2, $3) { return [0, $3, $1, $2]; },
    tsi: function ($1, $2, $3) { return [0, $2, $1, $3]; },
    sti: function ($1, $2, $3) { return [0, $1, $2, $3]; },
    d: function ($1, $2, $3) { return [$1, 0, 0, 0]; },
    s: function ($1, $2, $3) { return [0, $1, 0, 0]; },
    si: function (rt) { return function ($1, $2, $3) { return [0, $1, rt, $3]; }; },
};
var checker = {
    r: function ($1, $2, $3) { return reg.hasOwnProperty($1); },
    rr: function ($1, $2, $3) { return reg.hasOwnProperty($1) && reg.hasOwnProperty($2); },
    rrr: function ($1, $2, $3) { return reg.hasOwnProperty($1) && reg.hasOwnProperty($2) && reg.hasOwnProperty($3); },
    rrn: function ($1, $2, $3) { return reg.hasOwnProperty($1) && reg.hasOwnProperty($2) && !isNaN(parseInt($3)); },
    rnr: function ($1, $2, $3) { return reg.hasOwnProperty($1) && !isNaN(parseInt($2)) && reg.hasOwnProperty($3); },
    rn: function ($1, $2, $3) { return reg.hasOwnProperty($1) && !isNaN(parseInt($2)); },
    n: function ($1, $2, $3) { return !isNaN(parseInt($1)); },
};
var op = {
    "lw": [ins.rrn(0x23), mapper.tis, checker.rnr],
    "lb": [ins.rrn(0x20), mapper.tis, checker.rnr],
    "lbu": [ins.rrn(0x24), mapper.tis, checker.rnr],
    "lh": [ins.rrn(0x21), mapper.tis, checker.rnr],
    "lhu": [ins.rrn(0x25), mapper.tis, checker.rnr],
    "sw": [ins.rrn(0x2B), mapper.tis, checker.rnr],
    "sb": [ins.rrn(0x28), mapper.tis, checker.rnr],
    "sh": [ins.rrn(0x29), mapper.tis, checker.rnr],
    "add": [ins.rrr(0x00, 0x20), mapper.dst, checker.rrr],
    "addu": [ins.rrr(0x00, 0x21), mapper.dst, checker.rrr],
    "sub": [ins.rrr(0x00, 0x22), mapper.dst, checker.rrr],
    "subu": [ins.rrr(0x00, 0x23), mapper.dst, checker.rrr],
    "slt": [ins.rrr(0x00, 0x2A), mapper.dst, checker.rrr],
    "sltu": [ins.rrr(0x00, 0x2B), mapper.dst, checker.rrr],
    "and": [ins.rrr(0x00, 0x24), mapper.dst, checker.rrr],
    "or": [ins.rrr(0x00, 0x25), mapper.dst, checker.rrr],
    "xor": [ins.rrr(0x00, 0x26), mapper.dst, checker.rrr],
    "nor": [ins.rrr(0x00, 0x27), mapper.dst, checker.rrr],
    "sllv": [ins.rrr(0x00, 0x04), mapper.dts, checker.rrr],
    "srlv": [ins.rrr(0x00, 0x06), mapper.dts, checker.rrr],
    "srav": [ins.rrr(0x00, 0x07), mapper.dts, checker.rrr],
    "move": [ins.rrr(0x00, 0x21), function ($1, $2, $3) { return [$1, $2, 0, 0]; }, checker.rr],
    "mult": [ins.rrr(0x00, 0x18), mapper.st, checker.rr],
    "multu": [ins.rrr(0x00, 0x19), mapper.st, checker.rr],
    "div": [ins.rrr(0x00, 0x1A), mapper.st, checker.rr],
    "divu": [ins.rrr(0x00, 0x1B), mapper.st, checker.rr],
    "mfhi": [ins.rrr(0x00, 0x10), mapper.d, checker.r],
    "mflo": [ins.rrr(0x00, 0x12), mapper.d, checker.r],
    "mthi": [ins.rrr(0x00, 0x11), mapper.s, checker.r],
    "mtlo": [ins.rrr(0x00, 0x13), mapper.s, checker.r],
    "jalr": [ins.rrr(0x00, 0x09), function ($1, $2, $3) { return [$2, $1, 0, 0]; }, checker.rr],
    "jr": [ins.rrr(0x00, 0x08), function ($1, $2, $3) { return [0, $1, 0, 0]; }, checker.r],
    "addi": [ins.rrn(0x08), mapper.tsi, checker.rrn],
    "addiu": [ins.rrn(0x09), mapper.tsi, checker.rrn],
    "andi": [ins.rrn(0x0C), mapper.tsi, checker.rrn],
    "ori": [ins.rrn(0x0D), mapper.tsi, checker.rrn],
    "xori": [ins.rrn(0x0E), mapper.tsi, checker.rrn],
    "lui": [ins.rrn(0x0F), mapper.tsi, checker.rrn],
    "slti": [ins.rrn(0x0A), mapper.tsi, checker.rrn],
    "sltiu": [ins.rrn(0x0B), mapper.tsi, checker.rrn],
    "beq": [ins.rrn(0x04), mapper.sti, checker.rrn],
    "bne": [ins.rrn(0x05), mapper.sti, checker.rrn],
    "blez": [ins.rrn(0x06), mapper.si(0), checker.rn],
    "bgtz": [ins.rrn(0x07), mapper.si(0), checker.rn],
    "bltz": [ins.rrn(0x01), mapper.si(0), checker.rn],
    "bgez": [ins.rrn(0x01), mapper.si(1), checker.rn],
    "srl": [ins.rrs(0x00, 0x02), mapper.dti, checker.rrn],
    "sll": [ins.rrs(0x00, 0x00), mapper.dti, checker.rrn],
    "sra": [ins.rrs(0x00, 0x03), mapper.dti, checker.rrn],
    "j": [function ($) { return $ | (0x2 << 26); }, function ($) { return [$]; }, checker.n],
    "jal": [function ($) { return $ | (0x3 << 26); }, function ($) { return [$]; }, checker.n],
    "break": [function ($) { return ($ << 6) | 0x0d; }, function ($) { return [$]; }, checker.n],
    "syscall": [0xc, function (_) { return _; }, function (_) { return true; }],
};
// rd rs rt imm
function buildAsm(opcode, $1, $2, $3) {
    var arr = op[opcode];
    if (!arr || !arr[2]($1, $2, $3)) {
        throw true;
    }
    var arg = arr[1]($1, $2, $3);
    return arr[0](arg[0], arg[1], arg[2], arg[3]);
}
exports.buildAsm = buildAsm;
//# sourceMappingURL=ins.js.map