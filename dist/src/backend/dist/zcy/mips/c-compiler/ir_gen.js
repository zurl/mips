"use strict";
const parser_1 = require("./parser");
const type_1 = require("./type");
const ImmSymbol = Symbol("imm");
const VarSymbol = Symbol("var");
function isIMM(item) {
    return item[0] == ImmSymbol;
}
class IRGenerator {
    // ========
    constructor() {
        this.result = [];
    }
    __genIR(node) {
        if (!node.hasOwnProperty(parser_1.NodeSymbol))
            return;
        if (node.length == 1)
            return this.__genIR(node[0]);
        switch (node[parser_1.NodeSymbol]) {
            case parser_1.NodeType.integer_constant:
                return [ImmSymbol, type_1.IntType, parseInt(node[0])];
            case parser_1.NodeType.additive_expression:
                const l = this.__genIR(node[0]);
                const r = this.__genIR(node[2]);
                if (isIMM(l) && isIMM(r))
                    return [ImmSymbol, type_1.IntType, eval(`l[2]${node[1]}r[2]`)];
                break;
        }
    }
    generate(node) {
    }
}
exports.IRGenerator = IRGenerator;
const IRType = {
    '+': Symbol('add'),
    '-': Symbol('sub'),
};
/*
    type := (imm, var) + type
    IR FORMAT
    [IRType, dst, src1, src2]
    ope FORMAT


 */
//# sourceMappingURL=ir_gen.js.map 
//# sourceMappingURL=ir_gen.js.map