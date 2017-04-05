"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assembler_1 = require("./backend/assembler/assembler");
const disassmbler_1 = require("./backend/assembler/disassmbler");
const fastvm_1 = require("./backend/assembler/fastvm");
const webos_1 = require("./backend/webos");
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 2017/3/9
 */
function addFrontZero(str) {
    str = '000000000000' + str;
    return str.substring(str.length - 8, str.length);
}
const assembler = new assembler_1.MIPSAssembler();
const vm = new fastvm_1.MIPSVM(new webos_1.WebOS());
function assemble(text) {
    return assembler.parse(text);
}
exports.assemble = assemble;
function getAsmViewData(memory, i) {
    const x = memory.getUint32(i);
    return [
        addFrontZero((i).toString(16)),
        addFrontZero(x.toString(16)),
        disassmbler_1.disassmble(x)
    ];
}
exports.getAsmViewData = getAsmViewData;
function initvm(memory) {
    vm.cleanup();
    vm.setMemory(memory);
    window["vm"] = vm;
}
exports.initvm = initvm;
function runline() {
    vm.runLine();
}
exports.runline = runline;
function getRegisterInfo() {
    let result = [];
    for (let i = 0; i < 35; i++) {
        result.push([
            disassmbler_1.registerTable.get(i),
            vm.register.getUint32(i * 4)
        ]);
    }
    return result;
}
exports.getRegisterInfo = getRegisterInfo;
//# sourceMappingURL=api.js.map