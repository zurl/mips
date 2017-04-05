"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assembler_1 = require("./backend/assembler/assembler");
var disassmbler_1 = require("./backend/assembler/disassmbler");
var fastvm_1 = require("./backend/assembler/fastvm");
var webos_1 = require("./backend/webos");
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 2017/3/9
 */
function addFrontZero(str) {
    str = '000000000000' + str;
    return str.substring(str.length - 8, str.length);
}
var assembler = new assembler_1.MIPSAssembler();
var vm = new fastvm_1.MIPSVM(new webos_1.WebOS());
var disdata = [];
var ctx = [];
function assemble(text) {
    assembler = new assembler_1.MIPSAssembler();
    vm = new fastvm_1.MIPSVM(new webos_1.WebOS());
    console.log(text);
    var ret = assembler.parse(text);
    var memory = assembler.__program;
    disdata = [];
    ctx = [];
    for (var i = 0; i < 1024; i++) {
        var x = memory.getUint32(i * 4);
        disdata.push([
            addFrontZero((i * 4).toString(16)),
            addFrontZero(x.toString(16)),
            disassmbler_1.disassmble(x, ctx, i)
        ]);
    }
    return ret;
}
exports.assemble = assemble;
function decodeBIN(file) {
    console.log(file);
    var tmp = [];
    for (var i = 0; i < 1024 / 4; i++) {
        console.log(file.readUInt32BE(i * 4).toString(16));
        tmp[i] = disassmbler_1.disassmble(file.readUInt32BE(i * 4), ctx, i);
    }
    var ret = "";
    for (var i = 0; i < 256; i++) {
        if (ctx[i])
            ret += "LABEL_" + i + ": ";
        ret += tmp[i] + "\n";
    }
    return ret;
}
exports.decodeBIN = decodeBIN;
function decodeCOE(file) {
    var arr = file.split('=')[2].split(/\s*,\s*/).map(function (x) { return parseInt(x, 16); });
    var tmp = [];
    for (var i = 0; i < 1024 / 4; i++) {
        tmp[i] = disassmbler_1.disassmble(arr[i], ctx, i);
    }
    var ret = "";
    for (var i = 0; i < 256; i++) {
        if (ctx[i])
            ret += "LABEL_" + i + ": ";
        ret += tmp[i] + "\n";
    }
    return ret;
}
exports.decodeCOE = decodeCOE;
function getAsmViewData(memory, i) {
    if (i > 1024)
        return [];
    return disdata[i].concat(ctx[i]);
}
exports.getAsmViewData = getAsmViewData;
function initvm(memory) {
    vm.cleanup();
    vm.setMemory(memory);
    window["vm"] = vm;
}
exports.initvm = initvm;
function runline(cb) {
    vm.runLine(cb);
}
exports.runline = runline;
function getRegisterInfo() {
    var result = [];
    for (var i = 0; i < 35; i++) {
        result.push([
            disassmbler_1.registerTable.get(i),
            vm.register.getUint32(i * 4)
        ]);
    }
    return result;
}
exports.getRegisterInfo = getRegisterInfo;
//# sourceMappingURL=api.js.map