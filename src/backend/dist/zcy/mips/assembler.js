"use strict";
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 10/30/2016
 */
const ins_1 = require("./ins");
function convertStrToArray(str) {
    const result = [];
    for (let i = 1; i < str.length - 2; i++) {
        result.push(str.charCodeAt(i));
    }
    return result;
}
class MIPSAssembler {
    constructor(memorySize = 1024 * 4) {
        this.__hashString = (str, delta = true) => {
            if (!isNaN(parseInt(str)))
                return parseInt(str);
            if (this.__resolvedLabelSet.has(str)) {
                if (delta)
                    return (this.__resolvedLabelSet.get(str) - this.__now) / 4;
                else
                    return this.__resolvedLabelSet.get(str);
            }
            else {
                if (this.__unresolvedLabelSet.get(str))
                    this.__unresolvedLabelSet.get(str).push(this.__now);
                else
                    this.__unresolvedLabelSet.set(str, [this.__now]);
                return 0;
            }
        };
        this.__programBuffer = new ArrayBuffer(memorySize);
        this.__program = new DataView(this.__programBuffer);
        this.__resolvedLabelSet = new Map([]);
        this.__unresolvedLabelSet = new Map([]);
    }
    __resolveLabel(label) {
        this.__resolvedLabelSet.set(label, this.__now);
        if (this.__unresolvedLabelSet.has(label)) {
            this.__unresolvedLabelSet.get(label).forEach(line => {
                if ((this.__program.getInt32(line) & 0xFC000000) == 0x8000000 // jmp
                    || (this.__program.getInt32(line) & 0xFC000000) == 0xc000000) {
                    this.__program.setInt32(line, this.__program.getInt32(line) | (this.__now & 0x03FFFFFF));
                }
                else {
                    this.__program.setInt16(line + 2, (this.__now - line) / 4);
                }
            });
        }
    }
    __buildData(arr) {
        if (/dd|db|dw/.test(arr[1])) {
            const data = arr[2].split(/\s*,\s*/);
            for (let i = 0; i < data.length; i++) {
                if (!isNaN(parseInt(data[i]))) {
                    if (arr[1] == 'dd') {
                        this.__program.setUint32(this.__now, parseInt(data[i]));
                        this.__now += 4;
                    }
                    else if (arr[1] == 'dw') {
                        this.__program.setUint16(this.__now, parseInt(data[i]));
                        this.__now += 2;
                    }
                    else {
                        this.__program.setUint8(this.__now, parseInt(data[i]));
                        this.__now += 1;
                    }
                }
                else if (/^'.*'$/.test(data[i])) {
                    const arr = convertStrToArray(data[i]);
                    for (let item of arr) {
                        this.__program.setUint8(this.__now, item);
                        this.__now += 1;
                    }
                }
                else
                    return false; // failed
            }
            return true;
        }
        else if (!isNaN(parseInt(arr[1]))) {
            this.__now += parseInt(arr[1]);
        }
        return false; // failed
    }
    __buildIns(arr) {
        if (arr[3]) {
            if (arr[4]) {
                if (arr[4].charAt(0) == '$') {
                    return ins_1.buildAsmInstructionRRR(arr[1], arr[2], arr[3], arr[4]);
                }
                else if (!isNaN(parseInt(arr[4]))) {
                    return ins_1.buildAsmInstructionRRN(arr[1], arr[2], arr[3], parseInt(arr[4]));
                }
                else {
                    return ins_1.buildAsmInstructionRRN(arr[1], arr[3], arr[2], this.__hashString(arr[4]));
                }
            }
            else if (arr[5]) {
                return ins_1.buildAsmInstructionRRN(arr[1], arr[2], arr[5], parseInt(arr[3]));
            }
            else if (arr[3].charAt(0) == '$') {
                return ins_1.buildAsmInstructionRR(arr[1], arr[2], arr[3]);
            }
            else if (!isNaN(parseInt(arr[3]))) {
                return ins_1.buildAsmInstructionRN(arr[1], arr[2], parseInt(arr[3]));
            }
            else {
                return ins_1.buildAsmInstructionRN(arr[1], arr[2], this.__hashString(arr[3]));
            }
        }
        else if (arr[2].charAt(0) == '$') {
            return ins_1.buildAsmInstructionR(arr[1], arr[2]);
        }
        else {
            return ins_1.buildAsmInstructionN(arr[1], (this.__hashString(arr[2], false)) & 0x03FFFFFF);
        }
    }
    parse(source) {
        const code = source.toLowerCase().split('\n');
        this.__now = 0;
        for (let index = 0; index < code.length; index++) {
            let ins = code[index];
            ins = ins.replace(/#.*|\/\/.*$/, "");
            const labelResult = /^\s*([a-z0-9_]+)\s*:/.exec(ins);
            if (labelResult) {
                ins = ins.replace(/^\s*([a-z0-9_]+)\s*:/, "");
                if ((labelResult[1] == "baseaddre" || labelResult[1] == "dataaddre")
                    && /^\s*[0-9a-f]+\s*;\s*$/.test(ins)) {
                    const address = parseInt(ins, 16);
                    if (isNaN(address))
                        console.log(`failed at ${index}`);
                    else if (address < this.__now)
                        console.log(`failed at ${index} : illegal address`);
                    else
                        this.__now = address;
                    continue;
                }
                this.__resolveLabel(labelResult[1]);
            }
            const dataResult = /^\s*(dd|dw|db|resb|resw|resd)\s*(.+\s*);\s*$/.exec(ins);
            if (dataResult && this.__buildData(dataResult))
                continue;
            const insResult = /^\s*([a-z]+)\s+([$a-z0-9_-]+)\s*(?:,\s*([$a-z0-9_-]+)\s*(?:(?:,\s*([$a-z0-9_-]+)\s*)|(?:\(\s*([$a-z0-9_-]+)\s*\)))?)?;\s*$/.exec(ins);
            if (insResult) {
                this.__program.setUint32(this.__now, this.__buildIns(insResult));
                this.__now += 4;
                continue;
            }
            if (/^\s*syscall\s*;\s*$/.test(ins)) {
                this.__program.setUint32(this.__now, 0xc);
                this.__now += 4;
                continue;
            }
            else if (/^\s*nop\s*;\s*$/.test(ins)) {
                this.__program.setUint32(this.__now, 0x0);
                this.__now += 4;
                continue;
            }
            if (/\S/.test(ins))
                console.log(`failed at ${index}`);
        }
        return this.__program;
    }
}
exports.MIPSAssembler = MIPSAssembler;
//# sourceMappingURL=assembler.js.map