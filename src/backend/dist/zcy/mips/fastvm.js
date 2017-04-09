/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 1/31/2017
 */
"use strict";
//  fast mipsvm
exports.op_mask = 0xFC000000;
exports.$1_mask = 0x03E00000;
exports.$2_mask = 0x001F0000;
exports.$3_mask = 0x0000F800;
exports.shamt_mask = 0x000007C0;
exports.funct_mask = 0x0000003F;
exports.imm_mask = 0x0000FFFF;
exports.target_mask = 0x07FFFFFF;
const $ra = 31;
const $pc = 32;
const $hi = 33;
const $lo = 34;
class MIPSVM {
    constructor(memorySize = 1024 * 1024, initialBuffer = null) {
        this.memorySize = memorySize;
        if (initialBuffer)
            this.memoryBuffer = initialBuffer.slice(0);
        else
            this.memoryBuffer = new ArrayBuffer(memorySize);
        this.memory = new DataView(this.memoryBuffer);
        this.registerBuffer = new ArrayBuffer(4 * (32 + 2)); // pc, ir
        this.register = new DataView(this.registerBuffer);
    }
    get PC() {
        return this.register.getUint32(4 * $pc);
    }
    set PC(value) {
        this.register.setUint32(4 * $pc, value);
    }
    __mul_64($rs, $rt) {
        this.register.setInt32($hi * 4, (this.register.getInt32($rs * 4) * this.register.getInt32($rt * 4)) >> 32);
        this.register.setInt32($lo * 4, (this.register.getInt32($rs * 4) % 2140000000) * (this.register.getInt32($rt * 4) % 2140000000));
    }
    run(end) {
        while (this.PC != end) {
            this.__exec();
            this.PC += 4;
        }
    }
    __exec() {
        const ins = this.memory.getUint32(this.PC);
        const opcode = (ins & exports.op_mask) >> 26;
        const rs = (ins & exports.$1_mask) >> 21;
        const rt = (ins & exports.$2_mask) >> 16;
        if (opcode == 0x00) {
            const funct = ins & exports.shamt_mask;
            const rd = (ins & exports.$3_mask) >> 11;
            switch (funct) {
                // "add" : 0x20,
                // "addu": 0x21,
                case 0x21:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) + this.register.getInt32(rt * 4));
                    return;
                // "sub" : 0x22,
                // "subu": 0x23,
                case 0x23:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) - this.register.getInt32(rt * 4));
                    return;
                // "__mult": 0x18,
                case 0x18:
                    this.__mul_64(rs, rt);
                    return;
                // "__multu": 0x19,
                // "and" : 0x24,
                case 0x24:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) & this.register.getInt32(rt * 4));
                    return;
                // "or"  : 0x25,
                case 0x25:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) | this.register.getInt32(rt * 4));
                    return;
                // "xor" : 0x26,
                case 0x26:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) ^ this.register.getInt32(rt * 4));
                    return;
                // "nor":  0x27,
                case 0x27:
                    this.register.setInt32(rd * 4, ~(this.register.getInt32(rs * 4) | this.register.getInt32(rt * 4)));
                    return;
                // "slt" : 0x2A,
                // "sltu": 0x2B,
                case 0x2B:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) < this.register.getInt32(rt * 4) ? 1 : 0);
                    return;
                // "sll" : 0x00,
                case 0x00:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) << this.register.getInt32(rt * 4));
                    return;
                // "srl" : 0x02,
                case 0x02:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) >> this.register.getInt32(rt * 4));
                    return;
                // "sra" : 0x03,
                case 0x03:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) >>> this.register.getInt32(rt * 4) ? 1 : 0);
                    return;
                // "__jalr" : 0x9,
                case 0x9:
                    this.register.setInt32(rd * 4, this.PC + 4);
                    this.PC = this.register.getUint32(rs * 4) - 4;
                    return;
                // "__mfhi" : 0x10,
                case 0x10:
                    this.register.setInt32(rd * 4, this.register.getInt32($hi * 4));
                    return;
                // "__mflo" : 0x12,
                case 0x12:
                    this.register.setInt32(rd * 4, this.register.getInt32($lo * 4));
                    return;
                // "__mthi" : 0x11,
                case 0x11:
                    this.register.setInt32($hi * 4, this.register.getInt32(rs * 4));
                    return;
                // "__mtlo" : 0x13,
                case 0x13:
                    this.register.setInt32($lo * 4, this.register.getInt32(rs * 4));
                    return;
                // "__div" : 0x1a,
                // "__divu" : 0x1b,
                case 0x1b:
                    this.register.setInt32($lo * 4, this.register.getInt32(rs * 4) / this.register.getInt32(rt * 4));
                    this.register.setInt32($hi * 4, this.register.getInt32(rs * 4) % this.register.getInt32(rt * 4));
                    return;
                // "__jr" : 0x8,
                case 0x8:
                    this.PC = this.register.getUint32(rs * 4) - 4;
                    return;
            }
        }
        const imm = this.memory.getInt16(this.PC + 2);
        switch (opcode) {
            // "j" :   0x2,
            case 0x02:
                this.PC = ins & 0x03FFFFFF - 4;
                return;
            // "jal" :   0x2,
            case 0x03:
                this.register.setInt32($ra * 4, this.PC + 4);
                this.PC = ins & 0x03FFFFFF - 4;
                return;
            // "beq" : 0x4,
            case 0x04:
                if (this.register.getInt32(rs * 4) === this.register.getInt32(rt * 4))
                    this.PC += imm;
                return;
            // "bne" : 0x5,
            case 0x05:
                if (this.register.getInt32(rs * 4) !== this.register.getInt32(rt * 4))
                    this.PC += imm;
                return;
            // "__bgez":  0x1, "__bltz":  0x1,
            case 0x01:
                if ((this.register.getInt32(rs * 4) >= 0) !== (this.register.getInt32(rt * 4) == 0))
                    this.PC += imm;
                return;
            // "__bgtz":  0x7,
            case 0x07:
                if ((this.register.getInt32(rs * 4) > 0))
                    this.PC += imm;
                return;
            // "__blez":  0x6,
            case 0x06:
                if ((this.register.getInt32(rs * 4) <= 0))
                    this.PC += imm;
                return;
            // "addi": 0x8,
            // "addiu": 0x9,
            case 0x09:
                this.register.setInt32(rt * 4, this.register.getInt32(rs * 4) + imm);
                return;
            // "andi": 0xc,
            case 0x0c:
                this.register.setInt32(rt * 4, this.register.getInt32(rs * 4) & imm);
                return;
            // "ori" : 0xd,
            case 0x0d:
                this.register.setInt32(rt * 4, this.register.getInt32(rs * 4) | imm);
                return;
            // "xori": 0xe,
            case 0x0e:
                this.register.setInt32(rt * 4, this.register.getInt32(rs * 4) ^ imm);
                return;
            // "lui":  0xf,
            case 0xf:
                this.register.setInt16(rt * 4, imm);
                this.register.setInt16(rt * 4 + 2, 0);
                return;
            // "slti": 0xa,
            // "sltiu": 0xb,
            case 0x0b:
                this.register.setInt32(rt * 4, +(this.register.getInt32(rs * 4) < imm));
                return;
            // "lb" :  0x20,
            case 0x20:
                this.register.setInt32(rt * 4, this.memory.getInt8(imm + this.register.getInt32(rs * 4)));
                return;
            // "lh" :  0x21,
            case 0x21:
                this.register.setInt32(rt * 4, this.memory.getInt16(imm + this.register.getInt32(rs * 4)));
                return;
            // "lw" :  0x23,
            case 0x23:
                this.register.setInt32(rt * 4, this.memory.getInt32(imm + this.register.getInt32(rs * 4)));
                return;
            // "sb" :  0x28,
            case 0x28:
                this.memory.setInt8(imm + this.register.getInt32(rs * 4), this.register.getInt8(rt * 4));
                return;
            // "sh" :  0x29,
            case 0x29:
                this.memory.setInt16(imm + this.register.getInt32(rs * 4), this.register.getInt16(rt * 4));
                return;
            // "sw" :  0x2B,
            case 0x2b:
                this.memory.setInt32(imm + this.register.getInt32(rs * 4), this.register.getInt32(rt * 4));
                return;
            // "lbu" : 0x24,
            case 0x24:
                this.register.setInt32(rt * 4, 0x000000FF & this.memory.getInt8(imm + this.register.getInt32(rs * 4)));
                return;
            // "lhu" : 0x25,
            case 0x25:
                this.register.setInt32(rt * 4, 0x0000FFFF & this.memory.getInt32(imm + this.register.getInt32(rs * 4)));
                return;
        }
    }
}
//# sourceMappingURL=fastvm.js.map