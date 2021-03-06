/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 1/24/2017
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.op_mask = 0xFC000000;
exports.$1_mask = 0x03E00000;
exports.$2_mask = 0x001F0000;
exports.$3_mask = 0x0000F800;
exports.shamt_mask = 0x000007C0;
exports.funct_mask = 0x0000003F;
exports.imm_mask = 0x0000FFFF;
exports.target_mask = 0x07FFFFFF;
var MyMap = (function () {
    function MyMap(arr) {
        var _this = this;
        this.data = {};
        arr.forEach(function (x) {
            _this.data[x[0].toString()] = x[1];
        });
    }
    MyMap.prototype.has = function (x) {
        return this.data.hasOwnProperty(x);
    };
    MyMap.prototype.get = function (x) {
        return this.data[x];
    };
    return MyMap;
}());
exports.registerTable = new MyMap([
    [0, "$zero"], [1, "$at"], [2, "$v0"], [3, "$v1"],
    [4, "$a0"], [5, "$a1"], [6, "$a2"], [7, "$a3"],
    [8, "$t0"], [9, "$t1"], [10, "$t2"], [11, "$t3"], [12, "$t4"], [13, "$t5"], [14, "$t6"], [15, "$t7"],
    [16, "$s0"], [17, "$s1"], [18, "$s2"], [19, "$s3"], [20, "$s4"], [21, "$s5"], [22, "$s6"], [23, "$s7"],
    [24, "$s8"], [25, "$s9"], [26, "$k0"], [27, "$k1"],
    [28, "$gp"], [29, "$sp"], [30, "$fp"], [31, "$ra"],
    [32, "$pc"]
]);
var opcodeTable = new MyMap([
    [0x2, "j"],
    [0x4, "beq"],
    [0x5, "bne"],
    [0x8, "addi"],
    [0x9, "addiu"],
    [0xc, "andi"],
    [0xd, "ori"],
    [0xe, "xori"],
    [0xf, "lui"],
    [0xa, "slti"],
    [0xb, "sltiu"]
]);
var opcodeTableOffset = new MyMap([
    [0x20, "lb"],
    [0x21, "lh"],
    [0x23, "lw"],
    [0x28, "sb"],
    [0x29, "sh"],
    [0x2B, "sw"],
    [0x24, "lbu"],
    [0x25, "lhu"],
]);
var opcodeTableOffsetRN = new MyMap([
    [0x7, "bgtz"],
    [0x6, "blez"],
    [0xf, "lui"],
]);
var functTableRRR = new MyMap([
    [0x20, "add"],
    [0x21, "addu"],
    [0x22, "sub"],
    [0x23, "subu"],
    [0x24, "and"],
    [0x25, "or"],
    [0x26, "xor"],
    [0x27, "nor"],
    [0x2A, "slt"],
    [0x2B, "sltu"],
    [0x04, "sllv"],
    [0x06, "srlv"],
    [0x07, "srav"],
]);
var functTableRRS = new MyMap([
    [0x00, "sll"],
    [0x02, "srl"],
    [0x03, "sra"],
]);
var functTableRR = new MyMap([
    [0x09, "jalr"],
    [0x18, "mult"],
    [0x19, "multu"],
    [0x1a, "div"],
    [0x1b, "divu"],
]);
var functTableR = new MyMap([
    [0x10, "mfhi"],
    [0x12, "mflo"],
    [0x11, "mthi"],
    [0x13, "mtlo"],
    [0x8, "jr"]
]);
var convertArrayBuffer = new ArrayBuffer(16);
var convertDataView = new DataView(convertArrayBuffer);
function get16bitcomp(int) {
    convertDataView.setUint16(0, int);
    return convertDataView.getInt16(0);
}
function disassmble(ins, ctx, line) {
    // line => 1234
    var crela = function (imm) {
        ctx[imm + line + 1] = true;
        return (imm + line + 1);
    };
    var cabsa = function (imm) {
        ctx[imm] = true;
        return imm;
    };
    var opcode = (ins & exports.op_mask) >>> 26;
    var rs = exports.registerTable.get((ins & exports.$1_mask) >>> 21);
    var rt = exports.registerTable.get((ins & exports.$2_mask) >>> 16);
    var rd = exports.registerTable.get((ins & exports.$3_mask) >>> 11);
    var shamt = (ins & exports.shamt_mask) >> 6;
    var imm = get16bitcomp(ins & exports.imm_mask);
    var funct = ins & exports.funct_mask;
    if (opcode == 0) {
        if (funct == 0x0 && rs == '$zero' && rt == '$zero') {
            return "nop; ";
        }
        else if (functTableRRS.has(funct)) {
            var shamt_1 = (ins & exports.shamt_mask) >>> 6;
            return functTableRRS.get(funct) + " " + rd + ", " + rt + ", " + shamt_1 + "; ";
        }
        else if (functTableRRR.has(funct))
            return functTableRRR.get(funct) + " " + rd + ", " + rs + ", " + rt + "; ";
        else if (functTableRR.has(funct)) {
            if (funct == 0x9)
                return functTableRR.get(funct) + " " + rd + ", " + rs + "; ";
            else
                return functTableRR.get(funct) + " " + rs + ", " + rt + "; ";
        }
        else if (functTableR.has(funct)) {
            var reg = (funct == 0x12 || funct == 0x10) ? rd : rs;
            return functTableR.get(funct) + " " + reg + "; ";
        }
        else if (funct == 0xc) {
            return "syscall; ";
        }
        else if (funct == 0xd) {
            return "break " + (ins >> 6) + "; ";
        }
        else
            return "";
    }
    else if (opcode == 0x1) {
        if (rt == "$at")
            return "bgez " + rs + ", LABEL_" + crela(imm) + "; ";
        else
            return "bltz " + rs + ", LABEL_" + crela(imm) + "; ";
    }
    else if (opcode == 0x2) {
        return "j LABEL_" + cabsa(imm) + "; ";
    }
    else if (opcode == 0x3) {
        return "jal LABEL_" + cabsa(imm) + "; ";
    }
    else if (opcodeTableOffsetRN.has(opcode)) {
        var reg = opcode != 0xf ? rs : rt;
        if (opcode != 0xf)
            imm = "LABEL_" + crela(imm);
        return opcodeTableOffsetRN.get(opcode) + " " + reg + ", " + imm + "; ";
    }
    else if (opcodeTable.has(opcode)) {
        if (opcode == 4 || opcode == 5) {
            imm = "LABEL_" + crela(imm);
            return opcodeTable.get(opcode) + " " + rs + ", " + rt + ", " + imm + "; ";
        }
        return opcodeTable.get(opcode) + " " + rt + ", " + rs + ", " + imm + "; ";
    }
    else if (opcodeTableOffset.has(opcode)) {
        return opcodeTableOffset.get(opcode) + " " + rt + ", " + imm + "(" + rs + "); ";
    }
    return "";
}
exports.disassmble = disassmble;
//# sourceMappingURL=disassmbler.js.map