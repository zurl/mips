"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ins_1 = require("./ins");
function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
}
function convertStrToArray(str) {
    var result = [];
    for (var i = 1; i < str.length - 2; i++) {
        result.push(str.charCodeAt(i));
    }
    return result;
}
var MIPSAssembler = (function () {
    function MIPSAssembler(memorySize) {
        if (memorySize === void 0) { memorySize = 1024 * 1024; }
        var _this = this;
        this.__hashString = function (str, delta) {
            if (delta === void 0) { delta = true; }
            if (!isNaN(parseInt(str)))
                return parseInt(str);
            if (_this.__resolvedLabelSet.hasOwnProperty(str)) {
                if (delta)
                    return (_this.__resolvedLabelSet[str] - _this.__now) / 4 - 1;
                else
                    return _this.__resolvedLabelSet[str] / 4;
            }
            else {
                if (_this.__unresolvedLabelSet.hasOwnProperty(str))
                    _this.__unresolvedLabelSet[str].push(_this.__now);
                else
                    _this.__unresolvedLabelSet[str] = [_this.__now];
                return 0;
            }
        };
        this.__programBuffer = new ArrayBuffer(memorySize);
        this.__program = new DataView(this.__programBuffer);
        this.__resolvedLabelSet = {};
        this.__unresolvedLabelSet = {};
    }
    MIPSAssembler.prototype.__resolveLabel = function (label) {
        var _this = this;
        this.__resolvedLabelSet[label] = this.__now;
        if (this.__unresolvedLabelSet.hasOwnProperty(label)) {
            this.__unresolvedLabelSet[label].forEach(function (line) {
                if ((_this.__program.getInt32(line) & 0xFC000000) == 0x8000000 // jmp
                    || (_this.__program.getInt32(line) & 0xFC000000) == 0xc000000) {
                    _this.__program.setInt32(line, _this.__program.getInt32(line) | ((_this.__now / 4) & 0x03FFFFFF));
                }
                else {
                    _this.__program.setInt16(line + 2, (_this.__now - line) / 4 - 1);
                }
            });
        }
    };
    MIPSAssembler.prototype.__buildData = function (arr) {
        if (/dd|db|dw/.test(arr[1])) {
            var data = arr[2].split(/\s*,\s*/);
            for (var i = 0; i < data.length; i++) {
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
                    var arr_1 = convertStrToArray(data[i]);
                    for (var _i = 0, arr_2 = arr_1; _i < arr_2.length; _i++) {
                        var item = arr_2[_i];
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
    };
    MIPSAssembler.prototype.__buildIns = function (arr) {
        if (arr[5] && arr[3] == "")
            arr[3] = "0"; //trick;
        if (arr[3]) {
            if (arr[4]) {
                if (arr[4].charAt(0) == '$') {
                    return ins_1.buildAsm(arr[1], arr[2], arr[3], arr[4]);
                }
                else if (!isNaN(parseInt(arr[4]))) {
                    return ins_1.buildAsm(arr[1], arr[2], arr[3], parseInt(arr[4]));
                }
                else {
                    return ins_1.buildAsm(arr[1], arr[2], arr[3], this.__hashString(arr[4]));
                }
            }
            else if (arr[5]) {
                return ins_1.buildAsm(arr[1], arr[2], parseInt(arr[3]), arr[5]);
            }
            else if (arr[3].charAt(0) == '$') {
                return ins_1.buildAsm(arr[1], arr[2], arr[3], null);
            }
            else if (!isNaN(parseInt(arr[3]))) {
                return ins_1.buildAsm(arr[1], arr[2], parseInt(arr[3]), null);
            }
            else {
                return ins_1.buildAsm(arr[1], arr[2], this.__hashString(arr[3]), null);
            }
        }
        else if (arr[2].charAt(0) == '$') {
            return ins_1.buildAsm(arr[1], arr[2], null, null);
        }
        else {
            return ins_1.buildAsm(arr[1], (this.__hashString(arr[2], false)) & 0x03FFFFFF, null, null);
        }
    };
    MIPSAssembler.prototype.parse = function (source) {
        var _this = this;
        window["woc"] = source;
        var code = source.toLowerCase().split('\n');
        this.__now = 0;
        for (var index = 0; index < code.length; index++) {
            var ins = code[index];
            ins = ins.replace(/((#)|(\/\/)).*/g, "");
            var labelResult = /^\s*([a-z0-9_]+)\s*:/.exec(ins);
            if (labelResult) {
                ins = ins.replace(/^\s*([a-z0-9_]+)\s*:/, "");
                if ((labelResult[1] == "baseaddre" || labelResult[1] == "dataaddre")
                    && /^\s*[0-9a-f]+\s*;\s*$/.test(ins)) {
                    var address = parseInt(ins, 16);
                    if (isNaN(address))
                        console.log("failed at " + index);
                    else if (address < this.__now)
                        console.log("failed at " + index + " : illegal address");
                    else
                        this.__now = address;
                    continue;
                }
                this.__resolveLabel(labelResult[1]);
            }
            var dataResult = /^\s*(dd|dw|db|resb|resw|resd)\s*(.+\s*);?\s*$/.exec(ins);
            if (dataResult && this.__buildData(dataResult))
                continue;
            var insResult = /^\s*([a-z]+)\s+([$a-z0-9_-]+)\s*(?:,\s*([$a-z0-9_-]*)\s*(?:(?:,\s*([$a-z0-9_-]+)\s*)|(?:\(\s*([$a-z0-9_-]+)\s*\)))?)?;?\s*$/.exec(ins);
            if (insResult) {
                console.log(insResult);
                try {
                    var ret = this.__buildIns(insResult);
                    if (!isArray(ret)) {
                        this.__program.setUint32(this.__now, ret);
                        this.__now += 4;
                        continue;
                    }
                    else {
                        ret["forEach"](function (x) {
                            _this.__program.setUint32(_this.__now, x);
                            _this.__now += 4;
                        });
                        continue;
                    }
                }
                catch (e) {
                    window["logger"].log("failed at " + index + " : " + ins);
                    console.log("failed at " + index);
                    continue;
                }
            }
            if (/^\s*syscall\s*;?\s*$/.test(ins)) {
                this.__program.setUint32(this.__now, 0xc);
                this.__now += 4;
                continue;
            }
            else if (/^\s*nop\s*;?\s*$/.test(ins)) {
                this.__program.setUint32(this.__now, 0x0);
                this.__now += 4;
                continue;
            }
            if (/\S/.test(ins)) {
                window["logger"].log("failed at " + index + " : " + ins);
                console.log("failed at " + index);
            }
        }
        return this.__program;
    };
    return MIPSAssembler;
}());
exports.MIPSAssembler = MIPSAssembler;
//# sourceMappingURL=assembler.js.map