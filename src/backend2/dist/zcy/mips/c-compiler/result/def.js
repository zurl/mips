"use strict";
const tparser_1 = require("tparser");
const tokenizer = new tparser_1.Tokenizer({
    split: /s*s*/y,
    $symbol1: /^a-zA-Z0-9_$/,
    $symbol2: /^"\.\*"$/,
    $symbol3: /^'\.\*'$/,
    $symbol4: /^-\?\[0-9]\+$/,
    $symbol5: /^-\?\[0-9]\+\.\[0-9]\+$/,
    $symbol6: /^=$/,
    $symbol7: /^\*=$/,
    $symbol8: /^\/=$/,
    $symbol9: /^%=$/,
    $symbol10: /^\+=$/,
    $symbol11: /^-=$/,
    $symbol12: /^<$/,
    $symbol13: /^>$/,
    $symbol14: /^&=$/,
    $symbol15: /^^=$/,
    $symbol16: /^\|=$/,
    $symbol17: /^&$/,
    $symbol18: /^\*$/,
    $symbol19: /^\+$/,
    $symbol20: /^-$/,
    $symbol21: /^~$/,
    $symbol22: /^!$/,
    $symbol23: /^\?$/,
    $symbol24: /^:$/,
    $symbol25: /^\|\|$/,
    $symbol26: /^&&$/,
    $symbol27: /^\|$/,
    $symbol28: /^^$/,
    $symbol29: /^==$/,
    $symbol30: /^!=$/,
    $symbol31: /^\/$/,
    $symbol32: /^%$/,
    $symbol33: /^\+\+$/,
    $symbol34: /^--$/,
    $symbol35: /^sizeof$/,
    $symbol36: /^\[$/,
    $symbol37: /^]$/,
    $symbol38: /^\($/,
    $symbol39: /^\)$/,
    $symbol40: /^\.$/,
    $symbol41: /^,$/,
});
function Node(type, array) {
    array['node'] = type;
    return array;
}
const parser = new tparser_1.Parser({
    token: tokenizer.token(),
    tokenMap: tokenizer.tokenMap(),
    identifier: _ => [
        [[_.token.$symbol1], $ => Node('identifier', $)],
    ],
    string: _ => [
        [[_.token.$symbol2], $ => Node('string', $)],
    ],
    character_constant: _ => [
        [[_.token.$symbol3], $ => Node('character_constant', $)],
    ],
    integer_constant: _ => [
        [[_.token.$symbol4], $ => Node('integer_constant', $)],
    ],
    floating_constant: _ => [
        [[_.token.$symbol5], $ => Node('floating_constant', $)],
    ],
    assignment_operator: _ => [
        [[_.token.$symbol6], $ => Node('assignment_operator', $)],
        [[_.token.$symbol7], $ => Node('assignment_operator', $)],
        [[_.token.$symbol8], $ => Node('assignment_operator', $)],
        [[_.token.$symbol9], $ => Node('assignment_operator', $)],
        [[_.token.$symbol10], $ => Node('assignment_operator', $)],
        [[_.token.$symbol11], $ => Node('assignment_operator', $)],
        [[_.token.$symbol12, _.token.$symbol12, _.token.$symbol6], $ => Node('assignment_operator', $)],
        [[_.token.$symbol13, _.token.$symbol13, _.token.$symbol6], $ => Node('assignment_operator', $)],
        [[_.token.$symbol14], $ => Node('assignment_operator', $)],
        [[_.token.$symbol15], $ => Node('assignment_operator', $)],
        [[_.token.$symbol16], $ => Node('assignment_operator', $)],
    ],
    unary_operator: _ => [
        [[_.token.$symbol17], $ => Node('unary_operator', $)],
        [[_.token.$symbol18], $ => Node('unary_operator', $)],
        [[_.token.$symbol19], $ => Node('unary_operator', $)],
        [[_.token.$symbol20], $ => Node('unary_operator', $)],
        [[_.token.$symbol21], $ => Node('unary_operator', $)],
        [[_.token.$symbol22], $ => Node('unary_operator', $)],
    ],
    constant_expression: _ => [
        [[_.conditional_expression], $ => Node('constant_expression', $)],
    ],
    conditional_expression: _ => [
        [[_.logical_or_expression], $ => Node('conditional_expression', $)],
        [[_.logical_or_expression, _.token.$symbol23, _.expression, _.token.$symbol24, _.conditional_expression], $ => Node('conditional_expression', $)],
    ],
    logical_or_expression: _ => [
        [[_.logical_and_expression], $ => Node('logical_or_expression', $)],
        [[_.logical_or_expression, _.token.$symbol25, _.logical_and_expression], $ => Node('logical_or_expression', $)],
    ],
    logical_and_expression: _ => [
        [[_.inclusive_or_expression], $ => Node('logical_and_expression', $)],
        [[_.logical_and_expression, _.token.$symbol26, _.inclusive_or_expression], $ => Node('logical_and_expression', $)],
    ],
    inclusive_or_expression: _ => [
        [[_.exclusive_or_expression], $ => Node('inclusive_or_expression', $)],
        [[_.inclusive_or_expression, _.token.$symbol27, _.exclusive_or_expression], $ => Node('inclusive_or_expression', $)],
    ],
    exclusive_or_expression: _ => [
        [[_.and_expression], $ => Node('exclusive_or_expression', $)],
        [[_.exclusive_or_expression, _.token.$symbol28, _.and_expression], $ => Node('exclusive_or_expression', $)],
    ],
    and_expression: _ => [
        [[_.equality_expression], $ => Node('and_expression', $)],
        [[_.and_expression, _.token.$symbol17, _.equality_expression], $ => Node('and_expression', $)],
    ],
    equality_expression: _ => [
        [[_.relational_expression], $ => Node('equality_expression', $)],
        [[_.equality_expression, _.token.$symbol29, _.relational_expression], $ => Node('equality_expression', $)],
        [[_.equality_expression, _.token.$symbol30, _.relational_expression], $ => Node('equality_expression', $)],
    ],
    relational_expression: _ => [
        [[_.shift_expression], $ => Node('relational_expression', $)],
        [[_.relational_expression, _.token.$symbol12, _.shift_expression], $ => Node('relational_expression', $)],
        [[_.relational_expression, _.token.$symbol13, _.shift_expression], $ => Node('relational_expression', $)],
        [[_.relational_expression, _.token.$symbol12, _.token.$symbol6, _.shift_expression], $ => Node('relational_expression', $)],
        [[_.relational_expression, _.token.$symbol13, _.token.$symbol6, _.shift_expression], $ => Node('relational_expression', $)],
    ],
    shift_expression: _ => [
        [[_.additive_expression], $ => Node('shift_expression', $)],
        [[_.shift_expression, _.token.$symbol12, _.token.$symbol12, _.additive_expression], $ => Node('shift_expression', $)],
        [[_.shift_expression, _.token.$symbol13, _.token.$symbol13, _.additive_expression], $ => Node('shift_expression', $)],
    ],
    additive_expression: _ => [
        [[_.multiplicative_expression], $ => Node('additive_expression', $)],
        [[_.additive_expression, _.token.$symbol19, _.multiplicative_expression], $ => Node('additive_expression', $)],
        [[_.additive_expression, _.token.$symbol20, _.multiplicative_expression], $ => Node('additive_expression', $)],
    ],
    multiplicative_expression: _ => [
        [[_.cast_expression], $ => Node('multiplicative_expression', $)],
        [[_.multiplicative_expression, _.token.$symbol18, _.cast_expression], $ => Node('multiplicative_expression', $)],
        [[_.multiplicative_expression, _.token.$symbol31, _.cast_expression], $ => Node('multiplicative_expression', $)],
        [[_.multiplicative_expression, _.token.$symbol32, _.cast_expression], $ => Node('multiplicative_expression', $)],
    ],
    cast_expression: _ => [
        [[_.unary_expression], $ => Node('cast_expression', $)],
    ],
    unary_expression: _ => [
        [[_.postfix_expression], $ => Node('unary_expression', $)],
        [[_.token.$symbol33, _.unary_expression], $ => Node('unary_expression', $)],
        [[_.token.$symbol34, _.unary_expression], $ => Node('unary_expression', $)],
        [[_.token.$symbol35, _.unary_expression], $ => Node('unary_expression', $)],
    ],
    postfix_expression: _ => [
        [[_.primary_expression], $ => Node('postfix_expression', $)],
        [[_.postfix_expression, _.token.$symbol36, _.expression, _.token.$symbol37], $ => Node('postfix_expression', $)],
        [[_.postfix_expression, _.token.$symbol38, _.assignment_expression$rs, _.token.$symbol39], $ => Node('postfix_expression', $)],
        [[_.postfix_expression, _.token.$symbol40, _.identifier], $ => Node('postfix_expression', $)],
        [[_.postfix_expression, _.token.$symbol20, _.token.$symbol13, _.identifier], $ => Node('postfix_expression', $)],
        [[_.postfix_expression, _.token.$symbol33], $ => Node('postfix_expression', $)],
        [[_.postfix_expression, _.token.$symbol34], $ => Node('postfix_expression', $)],
    ],
    assignment_expression$r: _ => [
        [[_.assignment_expression], $ => $],
        [[], $ => $],
    ],
    assignment_expression$rs: _ => [
        [[_.assignment_expression$r], $ => Node('assignment_expression', $)],
        [[_.assignment_expression$rs, _.assignment_expression$r], $ => Node('assignment_expression', $[0].concat($[1]))],
    ],
    primary_expression: _ => [
        [[_.identifier], $ => Node('primary_expression', $)],
        [[_.constant], $ => Node('primary_expression', $)],
        [[_.string], $ => Node('primary_expression', $)],
        [[_.token.$symbol38, _.expression, _.token.$symbol39], $ => Node('primary_expression', $)],
    ],
    constant: _ => [
        [[_.integer_constant], $ => Node('constant', $)],
        [[_.character_constant], $ => Node('constant', $)],
        [[_.floating_constant], $ => Node('constant', $)],
    ],
    expression: _ => [
        [[_.assignment_expression], $ => Node('expression', $)],
        [[_.expression, _.token.$symbol41, _.assignment_expression], $ => Node('expression', $)],
    ],
    assignment_expression: _ => [
        [[_.conditional_expression], $ => Node('assignment_expression', $)],
        [[_.unary_expression, _.assignment_operator, _.assignment_expression], $ => Node('assignment_expression', $)],
    ],
});
//# sourceMappingURL=def.js.map