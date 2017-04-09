/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 11/4/2016
 */
interface LookupTable{
    [key: string]: number
}

interface PseudoLookupTable<T>{
    [key: string] : T
}

/*
    asm template lang
    ['s','f','g'
 */

const OpCodeRRR = {
    "add":  0x00,
    "addu": 0x00,
    "sub":  0x00,
    "subu": 0x00,
    "slt":  0x00,
    "sltu": 0x00,
    "and":  0x00,
    "or":   0x00,
    "xor":  0x00,
    "nor":  0x00,
    "sllv":  0x00,
    "srlv":  0x00,
    "srav":  0x00,

    "__sll":  0x00,
    "__srl":  0x00,
    "__sra":  0x00,
    //pseudo command
    "__mult":  0x00,
    "__multu": 0x00,
    "__div":  0x00,
    "__divu": 0x00,
    "__jalr": 0x00,
    "__mfhi" : 0x00,
    "__mflo" : 0x00,
    "__mthi" : 0x00,
    "__mtlo" : 0x00,
    "__jr" : 0x00,
} as LookupTable;


const OpCodeRRN = {
    "j" :   0x2,
    "beq" : 0x4,
    "bne" : 0x5,
    "addi": 0x8,
    "addiu": 0x9,
    "andi": 0xc,
    "ori" : 0xd,
    "xori": 0xe,
    "lui":  0xf,
    "slti": 0xa,
    "sltiu": 0xb,
    "lb" :  0x20,
    "lh" :  0x21,
    "lw" :  0x23,
    "sb" :  0x28,
    "sh" :  0x29,
    "sw" :  0x2B,
    "lbu" : 0x24,
    "lhu" : 0x25,
    //pseudo command
    "__bgez":  0x1,
    "__bgtz":  0x7,
    "__blez":  0x6,
    "__bltz":  0x1,
    "__lui": 0xf
}as LookupTable;


export const Register = {
    "$zero": 0, "$at": 1, "$v0": 2, "$v1": 3,
    "$a0": 4, "$a1": 5, "$a2": 6, "$a3": 7,
    "$t0": 8, "$t1": 9, "$t2": 10, "$t3": 11, "$t4": 12, "$t5": 13, "$t6": 14, "$t7": 15,
    "$s0": 16, "$s1": 17, "$s2": 18, "$s3": 19, "$s4": 20, "$s5": 21, "$s6": 22, "$s7": 23,
    "$s8": 24, "$s9": 25, "$k0": 26, "$k1": 27,
    "$gp": 28, "$sp": 29, "$fp": 30, "$ra": 31,
    "$pc" : 32,
    "$hi" : 33,
    "$lo" :34
}as LookupTable;

const FunctArith = {
    "add" : 0x20,
    "addu": 0x21,
    "sub" : 0x22,
    "subu": 0x23,
    "mul" : 0x18,
    "and" : 0x24,
    "or"  : 0x25,
    "xor" : 0x26,
    "nor":  0x27,
    "slt" : 0x2A,
    "sltu": 0x2B,
    "sllv":  0x04,
    "srlv":  0x06,
    "srav":  0x07,

    "__sll" : 0x00,
    "__srl" : 0x02,
    "__sra" : 0x03,
    "__jalr" : 0x9,
    "__mfhi" : 0x10,
    "__mflo" : 0x12,
    "__mthi" : 0x11,
    "__mtlo" : 0x13,
    "__mult": 0x18,
    "__multu": 0x19,
    "__div" : 0x1a,
    "__divu" : 0x1b,
    "__jr" : 0x8,
}as LookupTable;


const PseudoRR = {
    "move" : ( $1, $2) => buildAsmInstructionRRR("addu", $1, "$zero", $2),
    "div" : ($1, $2) => buildAsmInstructionRRR("__div", "$zero", $1, $2),
    "divu" : ($1, $2) => buildAsmInstructionRRR("__divu", "$zero", $1, $2),
    "mult" : ($1, $2) => buildAsmInstructionRRR("__mult", "$zero", $1, $2),
    "multu" : ($1, $2) => buildAsmInstructionRRR("__multu", "$zero", $1, $2),
    "jalr" : ($1, $2) => buildAsmInstructionRRR("__jalr", $2, $1,"$zero"),
} as PseudoLookupTable<($1:string, $2:string) => number>;

const PseudoR = {
    "mfhi" : ($1) => buildAsmInstructionRRR("__mfhi", $1, "$zero", "$zero"),
    "mflo" : ($1) => buildAsmInstructionRRR("__mflo", $1, "$zero", "$zero"),
    "mthi" : ($1) => buildAsmInstructionRRR("__mthi", "$zero", $1, "$zero"),
    "mtlo" : ($1) => buildAsmInstructionRRR("__mtlo", "$zero", $1, "$zero"),
    "jr" : ($1) => buildAsmInstructionRRR("__jr", "$zero", $1, "$zero"),
} as PseudoLookupTable<($1:string) => number>;

const PseudoRN = {
    "bgez"  :  ($1, num) => buildAsmInstructionRRN("__bgez", "$at", $1, num), //0x1
    "bgtz":    ($1, num) => buildAsmInstructionRRN("__bgtz", "$zero", $1, num), //0x0
    "blez":    ($1, num) => buildAsmInstructionRRN("__blez", "$zero", $1, num), //0x0
    "bltz":    ($1, num) => buildAsmInstructionRRN("__bltz", "$zero", $1, num), //0x0
    "lui":   ( $1, num) => buildAsmInstructionRRN("__lui", $1,"$zero", num),//0x0
    "li" : ($1, num)=> num > 0xFFFF ? [
            buildAsmInstructionRRN("__lui", $1, "$zero", num >>> 16),
            buildAsmInstructionRRN("addi", $1, "$zero", num & 0xFFFF)
        ] : buildAsmInstructionRRN("addi", $1, "$zero", num)
} as PseudoLookupTable<($1:string, num:number) => number | number[]>;

const PesudoRRS = {
    "sra": ($1, $2) => buildAsmInstructionRRR("__sra",$1, "$zero", $2),
    "srl": ($1, $2) => buildAsmInstructionRRR("__srl",$1, "$zero", $2),
    "sll": ($1, $2) => buildAsmInstructionRRR("__sll",$1, "$zero", $2),
}as PseudoLookupTable<($1:string, $2:string) => number>;

export function buildAsmInstructionRR(opcode: string, $1: string, $2: string){
    if(!PseudoRR.hasOwnProperty(opcode)){
        console.log(`buildAsmFailed at ${opcode}`);
        return 0;
    }
    return PseudoRR[opcode]($1, $2);
}

/** $1->rd $2->rs $3->rt **/
export function buildAsmInstructionRRR(opcode: string, rd: string, rs: string, rt:string){
    if(!OpCodeRRR.hasOwnProperty(opcode) || !FunctArith.hasOwnProperty(opcode) || !Register.hasOwnProperty(rd)||
        !Register.hasOwnProperty(rs)||!Register.hasOwnProperty(rt)){
        console.log(`buildAsmFailed at ${opcode}`);
        return 0;
    }
    const op = OpCodeRRR[opcode], r1 = Register[rd], r2 = Register[rs], r3 = Register[rt], funct = FunctArith[opcode];
    return (op << 26) | (r2 << 21) | (r3 << 16) | (r1 << 11) | funct;
}


/** $1->rt $2->rs  **/
export function buildAsmInstructionRRN(opcode: string, rt: string, rs: string, num: number){
    if(!OpCodeRRN.hasOwnProperty(opcode) || !Register.hasOwnProperty(rt)||
        !Register.hasOwnProperty(rs)){
        if( PesudoRRS.hasOwnProperty(opcode) ) return PesudoRRS[opcode](rt, rs) | ((num & 0x1F) << 6);
        console.log(`buildAsmFailed at ${opcode}`); return 0;
    }
    const op = OpCodeRRN[opcode], r1 = Register[rt], r2 = Register[rs], offset = num & 0xFFFF;
    return (op << 26) | (r2 << 21) | (r1 << 16) | offset;
}

export function buildAsmInstructionRN(opcode: string, $1: string, num: number){
    if(!PseudoRN.hasOwnProperty(opcode)){
        console.log(`buildAsmFailed at ${opcode}`);
        return 0;
    }
    return PseudoRN[opcode]($1, num);
}

export function buildAsmInstructionN(opcode: string, num: number){
    if( opcode == "j") return 0x8000000 | num; //jump
    if( opcode == "jal") return 0xc000000 |num; //jal
    if( opcode == "break") return (num << 6) + 0xd;
    console.log("bad pos 1");
    return 0;
}

export function buildAsmInstructionR(opcode: string, $1: string){
    if(!PseudoR.hasOwnProperty(opcode)){
        console.log(`buildAsmFailed at ${opcode}`);
        return 0;
    }
    return PseudoR[opcode]($1);
}

