/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 2017/2/24
 */
"use strict";
exports.IntType = Symbol("int");
exports.PointerSymbol = Symbol("pointer");
function PointerType(baseType) {
    const result = [baseType];
    result[exports.PointerSymbol] = true;
    return result;
}
exports.PointerType = PointerType;
//# sourceMappingURL=type.js.map 
//# sourceMappingURL=type.js.map