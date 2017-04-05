"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instruction_1 = require("./instruction");
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 1/31/2017
 */
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
    constructor(os, memorySize = 1024 * 1024, initialBuffer = null) {
        this.error = false;
        this.os = os;
        this.memorySize = memorySize;
        if (initialBuffer)
            this.memoryBuffer = initialBuffer.slice(0);
        else
            this.memoryBuffer = new ArrayBuffer(memorySize);
        this.memory = new DataView(this.memoryBuffer);
        this.registerBuffer = new ArrayBuffer(4 * (32 + 10)); // pc, ir
        this.register = new DataView(this.registerBuffer);
    }
    setMemory(dataView) {
        this.memory = dataView;
    }
    cleanup() {
        this.error = false;
        this.PC = 0;
        for (let i = 0; i <= 33; i++)
            this.register.setInt32(i * 4, 0);
    }
    get PC() {
        return this.register.getUint32(4 * $pc);
    }
    set PC(value) {
        this.register.setUint32(4 * $pc, value);
    }
    getInfo() {
        return Object.keys(instruction_1.Register).map(name => [name,
            this.register.getInt32(instruction_1.Register[name] * 4)
        ]);
    }
    __mul_64($rs, $rt) {
        this.register.setInt32($hi * 4, (this.register.getInt32($rs * 4) * this.register.getInt32($rt * 4)) >> 32);
        this.register.setInt32($lo * 4, (this.register.getInt32($rs * 4) % 2140000000) * (this.register.getInt32($rt * 4) % 2140000000));
    }
    run(end) {
        const that = this;
        const next_task = () => {
            this.PC += 4;
            if (this.PC != end)
                that.__exec(next_task);
        };
        that.__exec(next_task);
    }
    runLine() {
        this.__exec(() => {
            this.PC += 4;
        });
    }
    __exec(next_task) {
        const ins = this.memory.getUint32(this.PC);
        const opcode = ins >>> 26;
        const rs = (ins & exports.$1_mask) >> 21;
        const rt = (ins & exports.$2_mask) >> 16;
        if (opcode == 0x00) {
            const funct = ins & exports.funct_mask;
            const rd = (ins & exports.$3_mask) >> 11;
            //console.log(rd + " :" + funct);
            switch (funct) {
                // "sllv":  0x04,
                case 0x04:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) << this.register.getInt32(rt * 4));
                    break;
                // "srlv":  0x06,
                case 0x06:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) >>> this.register.getInt32(rt * 4));
                    break;
                // "srav":  0x07,
                case 0x07:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) >> this.register.getInt32(rt * 4));
                    break;
                // "add" : 0x20,
                case 0x20:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) + this.register.getInt32(rt * 4));
                    break;
                // "addu": 0x21,
                case 0x21:
                    this.register.setUint32(rd * 4, this.register.getUint32(rs * 4) + this.register.getUint32(rt * 4));
                    break;
                // "sub" : 0x22,
                case 0x22:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) - this.register.getInt32(rt * 4));
                    break;
                // "subu": 0x23,
                case 0x23:
                    this.register.setUint32(rd * 4, this.register.getUint32(rs * 4) - this.register.getUint32(rt * 4));
                    break;
                // "__mult": 0x18,
                case 0x18:
                    this.__mul_64(rs, rt);
                    break;
                // "__multu": 0x19,
                // "and" : 0x24,
                case 0x24:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) & this.register.getInt32(rt * 4));
                    break;
                // "or"  : 0x25,
                case 0x25:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) | this.register.getInt32(rt * 4));
                    break;
                // "xor" : 0x26,
                case 0x26:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) ^ this.register.getInt32(rt * 4));
                    break;
                // "nor":  0x27,
                case 0x27:
                    this.register.setInt32(rd * 4, ~(this.register.getInt32(rs * 4) | this.register.getInt32(rt * 4)));
                    break;
                // "slt" : 0x2A,
                case 0x2A:
                    this.register.setUint32(rd * 4, this.register.getUint32(rs * 4) < this.register.getUint32(rt * 4) ? 1 : 0);
                    break;
                // "sltu": 0x2B,
                case 0x2B:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) < this.register.getInt32(rt * 4) ? 1 : 0);
                    break;
                // "sll" : 0x00,
                case 0x00:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) << this.register.getInt32(rt * 4));
                    break;
                // "srl" : 0x02,
                case 0x02:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) >> this.register.getInt32(rt * 4));
                    break;
                // "sra" : 0x03,
                case 0x03:
                    this.register.setInt32(rd * 4, this.register.getInt32(rs * 4) >>> this.register.getInt32(rt * 4) ? 1 : 0);
                    break;
                // "__jalr" : 0x9,
                case 0x9:
                    this.register.setInt32(rd * 4, this.PC + 4);
                    this.PC = this.register.getUint32(rs * 4) - 4;
                    break;
                // "__mfhi" : 0x10,
                case 0x10:
                    this.register.setInt32(rd * 4, this.register.getInt32($hi * 4));
                    break;
                // "__mflo" : 0x12,
                case 0x12:
                    this.register.setInt32(rd * 4, this.register.getInt32($lo * 4));
                    break;
                // "__mthi" : 0x11,
                case 0x11:
                    this.register.setInt32($hi * 4, this.register.getInt32(rs * 4));
                    break;
                // "__mtlo" : 0x13,
                case 0x13:
                    this.register.setInt32($lo * 4, this.register.getInt32(rs * 4));
                    break;
                // "__div" : 0x1a,
                // "__divu" : 0x1b,
                case 0x1a:
                case 0x1b:
                    this.register.setInt32($lo * 4, this.register.getInt32(rs * 4) / this.register.getInt32(rt * 4));
                    this.register.setInt32($hi * 4, this.register.getInt32(rs * 4) % this.register.getInt32(rt * 4));
                    break;
                // "__jr" : 0x8,
                case 0x8:
                    this.PC = this.register.getUint32(rs * 4) - 4;
                    break;
                default:
                    throw "error1";
            }
            setTimeout(next_task, 0);
            return;
        }
        const imm = this.memory.getInt16(this.PC + 2);
        switch (opcode) {
            // "j" :   0x2,
            case 0x02:
                this.PC = ins & 0x03FFFFFF - 4;
                break;
            // "jal" :   0x2,
            case 0x03:
                this.register.setInt32($ra * 4, this.PC + 4);
                this.PC = ins & 0x03FFFFFF - 4;
                break;
            // "beq" : 0x4,
            case 0x04:
                if (this.register.getInt32(rs * 4) === this.register.getInt32(rt * 4))
                    this.PC += imm * 4;
                break;
            // "bne" : 0x5,
            case 0x05:
                if (this.register.getInt32(rs * 4) !== this.register.getInt32(rt * 4))
                    this.PC += imm * 4;
                break;
            // "__bgez":  0x1, "__bltz":  0x1,
            case 0x01:
                if ((this.register.getInt32(rs * 4) >= 0) !== (this.register.getInt32(rt * 4) == 0))
                    this.PC += imm * 4;
                break;
            // "__bgtz":  0x7,
            case 0x07:
                if ((this.register.getInt32(rs * 4) > 0))
                    this.PC += imm * 4;
                break;
            // "__blez":  0x6,
            case 0x06:
                if ((this.register.getInt32(rs * 4) <= 0))
                    this.PC += imm * 4;
                break;
            // "addi": 0x8,
            case 0x08:
                this.register.setUint32(rt * 4, this.register.getUint32(rs * 4) + imm);
                break;
            // "addiu": 0x9,
            case 0x09:
                this.register.setInt32(rt * 4, this.register.getInt32(rs * 4) + imm);
                break;
            // "andi": 0xc,
            case 0x0c:
                this.register.setInt32(rt * 4, this.register.getInt32(rs * 4) & imm);
                break;
            // "ori" : 0xd,
            case 0x0d:
                this.register.setInt32(rt * 4, this.register.getInt32(rs * 4) | imm);
                break;
            // "xori": 0xe,
            case 0x0e:
                this.register.setInt32(rt * 4, this.register.getInt32(rs * 4) ^ imm);
                break;
            // "lui":  0xf,
            case 0xf:
                this.register.setInt16(rt * 4, imm);
                this.register.setInt16(rt * 4 + 2, 0);
                break;
            // "slti": 0xa,
            case 0x0a:
                this.register.setUint32(rt * 4, +(this.register.getUint32(rs * 4) < imm));
                break;
            // "sltiu": 0xb,
            case 0x0b:
                this.register.setInt32(rt * 4, +(this.register.getInt32(rs * 4) < imm));
                break;
            // "lb" :  0x20,
            case 0x20:
                //console.log(imm);
                //console.log(imm + this.register.getInt32(rs * 4));
                this.register.setInt32(rt * 4, this.memory.getInt8(imm + this.register.getInt32(rs * 4)));
                break;
            // "lh" :  0x21,
            case 0x21:
                this.register.setInt32(rt * 4, this.memory.getInt16(imm + this.register.getInt32(rs * 4)));
                break;
            // "lw" :  0x23,
            case 0x23:
                this.register.setInt32(rt * 4, this.memory.getInt32(imm + this.register.getInt32(rs * 4)));
                break;
            // "sb" :  0x28,
            case 0x28:
                this.memory.setInt8(imm + this.register.getInt32(rs * 4), this.register.getInt8(rt * 4));
                break;
            // "sh" :  0x29,
            case 0x29:
                this.memory.setInt16(imm + this.register.getInt32(rs * 4), this.register.getInt16(rt * 4));
                break;
            // "sw" :  0x2B,
            case 0x2b:
                this.memory.setInt32(imm + this.register.getInt32(rs * 4), this.register.getInt32(rt * 4));
                break;
            // "lbu" : 0x24,
            case 0x24:
                this.register.setInt32(rt * 4, 0x000000FF & this.memory.getInt8(imm + this.register.getInt32(rs * 4)));
                break;
            // "lhu" : 0x25,
            case 0x25:
                this.register.setInt32(rt * 4, 0x0000FFFF & this.memory.getInt32(imm + this.register.getInt32(rs * 4)));
                break;
            case 0x0C:
                this.os.syscall(this, next_task);
                return;
            default:
                throw "error2 " + opcode;
        }
        setTimeout(next_task, 0);
    }
}
exports.MIPSVM = MIPSVM;
//# sourceMappingURL=fastvm.js.map 
//# sourceMappingURL=fastvm.js.map