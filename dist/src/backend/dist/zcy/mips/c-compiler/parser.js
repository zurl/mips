"use strict";
const tparser_1 = require("tparser");
const tokenizer = new tparser_1.Tokenizer({
    split: /\s*([a-zA-Z_][a-zA-Z0-9_]*|-?[0-9]+(\.[0-9]*)?|\;|\+|\%|\-|\*|\/|=|\+=|\-=|\/=|\*=|\||\&|\^|\(|\)|\]|\]|\{|\})\s*/y,
    $symbol1: [/^[a-zA-Z_][a-zA-Z0-9_]*$/, -1],
    $symbol2: /^".*"$/,
    $symbol3: /^'.*'$/,
    $symbol4: /^-?[0-9]+$/,
    $symbol5: /^-?[0-9]+.[0-9]+$/,
    $symbol6: /^auto$/,
    $symbol7: /^register$/,
    $symbol8: /^static$/,
    $symbol9: /^extern$/,
    $symbol10: /^typedef$/,
    $symbol11: /^void$/,
    $symbol12: /^char$/,
    $symbol13: /^short$/,
    $symbol14: /^int$/,
    $symbol15: /^long$/,
    $symbol16: /^float$/,
    $symbol17: /^double$/,
    $symbol18: /^signed$/,
    $symbol19: /^unsigned$/,
    $symbol20: /^\{$/,
    $symbol21: /^\}$/,
    $symbol22: /^struct$/,
    $symbol23: /^union$/,
    $symbol24: /^,$/,
    $symbol25: /^:$/,
    $symbol26: /^\*$/,
    $symbol27: /^const$/,
    $symbol28: /^volatile$/,
    $symbol29: /^\($/,
    $symbol30: /^\)$/,
    $symbol31: /^\[$/,
    $symbol32: /^]$/,
    $symbol33: /^\?$/,
    $symbol34: /^<$/,
    $symbol35: /^logical-or-expression$/,
    $symbol36: /^\|\|$/,
    $symbol37: /^logical-and-expression$/,
    $symbol38: /^&&$/,
    $symbol39: /^\|$/,
    $symbol40: /^^$/,
    $symbol41: /^&$/,
    $symbol42: /^==$/,
    $symbol43: /^!=$/,
    $symbol44: /^>$/,
    $symbol45: /^=$/,
    $symbol46: /^\+$/,
    $symbol47: /^-$/,
    $symbol48: /^\/$/,
    $symbol49: /^%$/,
    $symbol50: /^\+\+$/,
    $symbol51: /^--$/,
    $symbol52: /^sizeof$/,
    $symbol53: /^\.$/,
    $symbol54: /^\*=$/,
    $symbol55: /^\/=$/,
    $symbol56: /^%=$/,
    $symbol57: /^\+=$/,
    $symbol58: /^-=$/,
    $symbol59: /^&=$/,
    $symbol60: /^^=$/,
    $symbol61: /^\|=$/,
    $symbol62: /^~$/,
    $symbol63: /^!$/,
    $symbol64: /^\.\.\.$/,
    $symbol65: /^enum$/,
    $symbol66: /^case$/,
    $symbol67: /^default$/,
    $symbol68: /^\;$/,
    $symbol69: /^if$/,
    $symbol70: /^else$/,
    $symbol71: /^switch$/,
    $symbol72: /^while$/,
    $symbol73: /^do$/,
    $symbol74: /^for$/,
    $symbol75: /^goto$/,
    $symbol76: /^continue$/,
    $symbol77: /^break$/,
    $symbol78: /^return$/,
});
exports.NodeSymbol = Symbol("Node");
function Node(type, array) {
    array[exports.NodeSymbol] = type;
    return array;
}
exports.NodeType = {
    identifier: Symbol("identifier"),
    string: Symbol("string"),
    character_constant: Symbol("character_constant"),
    integer_constant: Symbol("integer_constant"),
    floating_constant: Symbol("floating_constant"),
    translation_unit: Symbol("translation_unit"),
    external_declaration$r: Symbol("external_declaration$r"),
    external_declaration$rs: Symbol("external_declaration$rs"),
    external_declaration: Symbol("external_declaration"),
    function_definition: Symbol("function_definition"),
    declaration_specifier$r: Symbol("declaration_specifier$r"),
    declaration_specifier$rs: Symbol("declaration_specifier$rs"),
    declaration$r: Symbol("declaration$r"),
    declaration$rs: Symbol("declaration$rs"),
    declaration_specifier: Symbol("declaration_specifier"),
    storage_class_specifier: Symbol("storage_class_specifier"),
    type_specifier: Symbol("type_specifier"),
    struct_or_union_specifier: Symbol("struct_or_union_specifier"),
    struct_declaration$m: Symbol("struct_declaration$m"),
    struct_declaration$ms: Symbol("struct_declaration$ms"),
    struct_or_union: Symbol("struct_or_union"),
    struct_declaration: Symbol("struct_declaration"),
    specifier_qualifier$r: Symbol("specifier_qualifier$r"),
    specifier_qualifier$rs: Symbol("specifier_qualifier$rs"),
    specifier_qualifier: Symbol("specifier_qualifier"),
    struct_declarator_list: Symbol("struct_declarator_list"),
    struct_declarator: Symbol("struct_declarator"),
    declarator: Symbol("declarator"),
    pointer$o: Symbol("pointer$o"),
    pointer: Symbol("pointer"),
    type_qualifier$r: Symbol("type_qualifier$r"),
    type_qualifier$rs: Symbol("type_qualifier$rs"),
    type_qualifier: Symbol("type_qualifier"),
    direct_declarator: Symbol("direct_declarator"),
    constant_expression$o: Symbol("constant_expression$o"),
    identifier$r: Symbol("identifier$r"),
    identifier$rs: Symbol("identifier$rs"),
    constant_expression: Symbol("constant_expression"),
    conditional_expression: Symbol("conditional_expression"),
    logical_or_expression: Symbol("logical_or_expression"),
    logical_and_expression: Symbol("logical_and_expression"),
    inclusive_or_expression: Symbol("inclusive_or_expression"),
    exclusive_or_expression: Symbol("exclusive_or_expression"),
    and_expression: Symbol("and_expression"),
    equality_expression: Symbol("equality_expression"),
    relational_expression: Symbol("relational_expression"),
    shift_expression: Symbol("shift_expression"),
    additive_expression: Symbol("additive_expression"),
    multiplicative_expression: Symbol("multiplicative_expression"),
    cast_expression: Symbol("cast_expression"),
    unary_expression: Symbol("unary_expression"),
    postfix_expression: Symbol("postfix_expression"),
    assignment_expression$r: Symbol("assignment_expression$r"),
    assignment_expression$rs: Symbol("assignment_expression$rs"),
    primary_expression: Symbol("primary_expression"),
    constant: Symbol("constant"),
    expression: Symbol("expression"),
    assignment_expression: Symbol("assignment_expression"),
    assignment_operator: Symbol("assignment_operator"),
    unary_operator: Symbol("unary_operator"),
    type_name: Symbol("type_name"),
    specifier_qualifier$m: Symbol("specifier_qualifier$m"),
    specifier_qualifier$ms: Symbol("specifier_qualifier$ms"),
    abstract_declarator$o: Symbol("abstract_declarator$o"),
    parameter_type_list: Symbol("parameter_type_list"),
    parameter_list: Symbol("parameter_list"),
    parameter_declaration: Symbol("parameter_declaration"),
    declaration_specifier$m: Symbol("declaration_specifier$m"),
    declaration_specifier$ms: Symbol("declaration_specifier$ms"),
    abstract_declarator: Symbol("abstract_declarator"),
    direct_abstract_declarator: Symbol("direct_abstract_declarator"),
    direct_abstract_declarator$o: Symbol("direct_abstract_declarator$o"),
    parameter_type_list$o: Symbol("parameter_type_list$o"),
    enum_specifier: Symbol("enum_specifier"),
    enumerator_list: Symbol("enumerator_list"),
    enumerator: Symbol("enumerator"),
    typedef_name: Symbol("typedef_name"),
    declaration: Symbol("declaration"),
    init_declarator$r: Symbol("init_declarator$r"),
    init_declarator$rs: Symbol("init_declarator$rs"),
    init_declarator: Symbol("init_declarator"),
    initializer: Symbol("initializer"),
    initializer_list: Symbol("initializer_list"),
    compound_statement: Symbol("compound_statement"),
    statement$r: Symbol("statement$r"),
    statement$rs: Symbol("statement$rs"),
    statement: Symbol("statement"),
    labeled_statement: Symbol("labeled_statement"),
    expression_statement: Symbol("expression_statement"),
    expression$o: Symbol("expression$o"),
    selection_statement: Symbol("selection_statement"),
    iteration_statement: Symbol("iteration_statement"),
    jump_statement: Symbol("jump_statement"),
};
const parser = new tparser_1.Parser({
    token: tokenizer.token(),
    tokenMap: tokenizer.tokenMap(),
    identifier: _ => [
        [[_.token.$symbol1], $ => Node(exports.NodeType.identifier, $)],
    ],
    string: _ => [
        [[_.token.$symbol2], $ => Node(exports.NodeType.string, $)],
    ],
    character_constant: _ => [
        [[_.token.$symbol3], $ => Node(exports.NodeType.character_constant, $)],
    ],
    integer_constant: _ => [
        [[_.token.$symbol4], $ => Node(exports.NodeType.integer_constant, $)],
    ],
    floating_constant: _ => [
        [[_.token.$symbol5], $ => Node(exports.NodeType.floating_constant, $)],
    ],
    translation_unit: _ => [
        [[_.external_declaration$rs], $ => Node(exports.NodeType.translation_unit, $)],
    ],
    external_declaration$r: _ => [
        [[_.external_declaration], $ => $],
        [[], $ => $],
    ],
    external_declaration$rs: _ => [
        [[_.external_declaration$r], $ => Node(exports.NodeType.external_declaration, $)],
        [[_.external_declaration$rs, _.external_declaration$r], $ => Node(exports.NodeType.external_declaration, $[0].concat($[1]))],
    ],
    external_declaration: _ => [
        [[_.function_definition], $ => Node(exports.NodeType.external_declaration, $)],
        [[_.declaration], $ => Node(exports.NodeType.external_declaration, $)],
    ],
    function_definition: _ => [
        [[_.declaration_specifier$rs, _.declarator, _.declaration$rs, _.compound_statement], $ => Node(exports.NodeType.function_definition, $)],
    ],
    declaration_specifier$r: _ => [
        [[_.declaration_specifier], $ => $],
        [[], $ => $],
    ],
    declaration_specifier$rs: _ => [
        [[_.declaration_specifier$r], $ => Node(exports.NodeType.declaration_specifier, $)],
        [[_.declaration_specifier$rs, _.declaration_specifier$r], $ => Node(exports.NodeType.declaration_specifier, $[0].concat($[1]))],
    ],
    declaration$r: _ => [
        [[_.declaration], $ => $],
        [[], $ => $],
    ],
    declaration$rs: _ => [
        [[_.declaration$r], $ => Node(exports.NodeType.declaration, $)],
        [[_.declaration$rs, _.declaration$r], $ => Node(exports.NodeType.declaration, $[0].concat($[1]))],
    ],
    declaration_specifier: _ => [
        [[_.storage_class_specifier], $ => Node(exports.NodeType.declaration_specifier, $)],
        [[_.type_specifier], $ => Node(exports.NodeType.declaration_specifier, $)],
        [[_.type_qualifier], $ => Node(exports.NodeType.declaration_specifier, $)],
    ],
    storage_class_specifier: _ => [
        [[_.token.$symbol6], $ => Node(exports.NodeType.storage_class_specifier, $)],
        [[_.token.$symbol7], $ => Node(exports.NodeType.storage_class_specifier, $)],
        [[_.token.$symbol8], $ => Node(exports.NodeType.storage_class_specifier, $)],
        [[_.token.$symbol9], $ => Node(exports.NodeType.storage_class_specifier, $)],
        [[_.token.$symbol10], $ => Node(exports.NodeType.storage_class_specifier, $)],
    ],
    type_specifier: _ => [
        [[_.token.$symbol11], $ => Node(exports.NodeType.type_specifier, $)],
        [[_.token.$symbol12], $ => Node(exports.NodeType.type_specifier, $)],
        [[_.token.$symbol13], $ => Node(exports.NodeType.type_specifier, $)],
        [[_.token.$symbol14], $ => Node(exports.NodeType.type_specifier, $)],
        [[_.token.$symbol15], $ => Node(exports.NodeType.type_specifier, $)],
        [[_.token.$symbol16], $ => Node(exports.NodeType.type_specifier, $)],
        [[_.token.$symbol17], $ => Node(exports.NodeType.type_specifier, $)],
        [[_.token.$symbol18], $ => Node(exports.NodeType.type_specifier, $)],
        [[_.token.$symbol19], $ => Node(exports.NodeType.type_specifier, $)],
        [[_.struct_or_union_specifier], $ => Node(exports.NodeType.type_specifier, $)],
    ],
    struct_or_union_specifier: _ => [
        [[_.struct_or_union, _.identifier, _.token.$symbol20, _.struct_declaration$ms, _.token.$symbol21], $ => Node(exports.NodeType.struct_or_union_specifier, $)],
        [[_.struct_or_union, _.token.$symbol20, _.struct_declaration$ms, _.token.$symbol21], $ => Node(exports.NodeType.struct_or_union_specifier, $)],
        [[_.struct_or_union, _.identifier], $ => Node(exports.NodeType.struct_or_union_specifier, $)],
    ],
    struct_declaration$m: _ => [
        [[_.struct_declaration], $ => $],
    ],
    struct_declaration$ms: _ => [
        [[_.struct_declaration$m], $ => Node(exports.NodeType.struct_declaration, $)],
        [[_.struct_declaration$ms, _.struct_declaration$m], $ => Node(exports.NodeType.struct_declaration, $[0].concat($[1]))],
    ],
    struct_or_union: _ => [
        [[_.token.$symbol22], $ => Node(exports.NodeType.struct_or_union, $)],
        [[_.token.$symbol23], $ => Node(exports.NodeType.struct_or_union, $)],
    ],
    struct_declaration: _ => [
        [[_.specifier_qualifier$rs, _.struct_declarator_list], $ => Node(exports.NodeType.struct_declaration, $)],
    ],
    specifier_qualifier$r: _ => [
        [[_.specifier_qualifier], $ => $],
        [[], $ => $],
    ],
    specifier_qualifier$rs: _ => [
        [[_.specifier_qualifier$r], $ => Node(exports.NodeType.specifier_qualifier, $)],
        [[_.specifier_qualifier$rs, _.specifier_qualifier$r], $ => Node(exports.NodeType.specifier_qualifier, $[0].concat($[1]))],
    ],
    specifier_qualifier: _ => [
        [[_.type_specifier], $ => Node(exports.NodeType.specifier_qualifier, $)],
        [[_.type_qualifier], $ => Node(exports.NodeType.specifier_qualifier, $)],
    ],
    struct_declarator_list: _ => [
        [[_.struct_declarator], $ => Node(exports.NodeType.struct_declarator_list, $)],
        [[_.struct_declarator_list, _.token.$symbol24, _.struct_declarator], $ => Node(exports.NodeType.struct_declarator_list, $)],
    ],
    struct_declarator: _ => [
        [[_.declarator], $ => Node(exports.NodeType.struct_declarator, $)],
        [[_.declarator, _.token.$symbol25, _.constant_expression], $ => Node(exports.NodeType.struct_declarator, $)],
        [[_.token.$symbol25, _.constant_expression], $ => Node(exports.NodeType.struct_declarator, $)],
    ],
    declarator: _ => [
        [[_.pointer$o, _.direct_declarator], $ => Node(exports.NodeType.declarator, $)],
    ],
    pointer$o: _ => [
        [[_.pointer], $ => Node(exports.NodeType.pointer, $)],
        [[], $ => $],
    ],
    pointer: _ => [
        [[_.token.$symbol26, _.type_qualifier$rs, _.pointer$o], $ => Node(exports.NodeType.pointer, $)],
    ],
    type_qualifier$r: _ => [
        [[_.type_qualifier], $ => $],
        [[], $ => $],
    ],
    type_qualifier$rs: _ => [
        [[_.type_qualifier$r], $ => Node(exports.NodeType.type_qualifier, $)],
        [[_.type_qualifier$rs, _.type_qualifier$r], $ => Node(exports.NodeType.type_qualifier, $[0].concat($[1]))],
    ],
    type_qualifier: _ => [
        [[_.token.$symbol27], $ => Node(exports.NodeType.type_qualifier, $)],
        [[_.token.$symbol28], $ => Node(exports.NodeType.type_qualifier, $)],
    ],
    direct_declarator: _ => [
        [[_.identifier], $ => Node(exports.NodeType.direct_declarator, $)],
        [[_.token.$symbol29, _.declarator, _.token.$symbol30], $ => Node(exports.NodeType.direct_declarator, $)],
        [[_.direct_declarator, _.token.$symbol31, _.constant_expression$o, _.token.$symbol32], $ => Node(exports.NodeType.direct_declarator, $)],
        [[_.direct_declarator, _.token.$symbol29, _.parameter_type_list, _.token.$symbol30], $ => Node(exports.NodeType.direct_declarator, $)],
        [[_.direct_declarator, _.token.$symbol29, _.identifier$rs, _.token.$symbol30], $ => Node(exports.NodeType.direct_declarator, $)],
    ],
    constant_expression$o: _ => [
        [[_.constant_expression], $ => Node(exports.NodeType.constant_expression, $)],
        [[], $ => $],
    ],
    identifier$r: _ => [
        [[_.identifier], $ => $],
        [[], $ => $],
    ],
    identifier$rs: _ => [
        [[_.identifier$r], $ => Node(exports.NodeType.identifier, $)],
        [[_.identifier$rs, _.identifier$r], $ => Node(exports.NodeType.identifier, $[0].concat($[1]))],
    ],
    constant_expression: _ => [
        [[_.conditional_expression], $ => Node(exports.NodeType.constant_expression, $)],
    ],
    conditional_expression: _ => [
        [[_.logical_or_expression], $ => Node(exports.NodeType.conditional_expression, $)],
        [[_.logical_or_expression, _.token.$symbol33, _.expression, _.token.$symbol25, _.conditional_expression], $ => Node(exports.NodeType.conditional_expression, $)],
    ],
    logical_or_expression: _ => [
        [[_.logical_and_expression], $ => Node(exports.NodeType.logical_or_expression, $)],
        [[_.token.$symbol34, _.token.$symbol35, _.token.$symbol36, _.logical_and_expression], $ => Node(exports.NodeType.logical_or_expression, $)],
    ],
    logical_and_expression: _ => [
        [[_.inclusive_or_expression], $ => Node(exports.NodeType.logical_and_expression, $)],
        [[_.token.$symbol34, _.token.$symbol37, _.token.$symbol38, _.inclusive_or_expression], $ => Node(exports.NodeType.logical_and_expression, $)],
    ],
    inclusive_or_expression: _ => [
        [[_.exclusive_or_expression], $ => Node(exports.NodeType.inclusive_or_expression, $)],
        [[_.inclusive_or_expression, _.token.$symbol39, _.exclusive_or_expression], $ => Node(exports.NodeType.inclusive_or_expression, $)],
    ],
    exclusive_or_expression: _ => [
        [[_.and_expression], $ => Node(exports.NodeType.exclusive_or_expression, $)],
        [[_.exclusive_or_expression, _.token.$symbol40, _.and_expression], $ => Node(exports.NodeType.exclusive_or_expression, $)],
    ],
    and_expression: _ => [
        [[_.equality_expression], $ => Node(exports.NodeType.and_expression, $)],
        [[_.and_expression, _.token.$symbol41, _.equality_expression], $ => Node(exports.NodeType.and_expression, $)],
    ],
    equality_expression: _ => [
        [[_.relational_expression], $ => Node(exports.NodeType.equality_expression, $)],
        [[_.equality_expression, _.token.$symbol42, _.relational_expression], $ => Node(exports.NodeType.equality_expression, $)],
        [[_.equality_expression, _.token.$symbol43, _.relational_expression], $ => Node(exports.NodeType.equality_expression, $)],
    ],
    relational_expression: _ => [
        [[_.shift_expression], $ => Node(exports.NodeType.relational_expression, $)],
        [[_.relational_expression, _.token.$symbol34, _.shift_expression], $ => Node(exports.NodeType.relational_expression, $)],
        [[_.relational_expression, _.token.$symbol44, _.shift_expression], $ => Node(exports.NodeType.relational_expression, $)],
        [[_.relational_expression, _.token.$symbol34, _.token.$symbol45, _.shift_expression], $ => Node(exports.NodeType.relational_expression, $)],
        [[_.relational_expression, _.token.$symbol44, _.token.$symbol45, _.shift_expression], $ => Node(exports.NodeType.relational_expression, $)],
    ],
    shift_expression: _ => [
        [[_.additive_expression], $ => Node(exports.NodeType.shift_expression, $)],
        [[_.shift_expression, _.token.$symbol34, _.token.$symbol34, _.additive_expression], $ => Node(exports.NodeType.shift_expression, $)],
        [[_.shift_expression, _.token.$symbol44, _.token.$symbol44, _.additive_expression], $ => Node(exports.NodeType.shift_expression, $)],
    ],
    additive_expression: _ => [
        [[_.multiplicative_expression], $ => Node(exports.NodeType.additive_expression, $)],
        [[_.additive_expression, _.token.$symbol46, _.multiplicative_expression], $ => Node(exports.NodeType.additive_expression, $)],
        [[_.additive_expression, _.token.$symbol47, _.multiplicative_expression], $ => Node(exports.NodeType.additive_expression, $)],
    ],
    multiplicative_expression: _ => [
        [[_.cast_expression], $ => Node(exports.NodeType.multiplicative_expression, $)],
        [[_.multiplicative_expression, _.token.$symbol26, _.cast_expression], $ => Node(exports.NodeType.multiplicative_expression, $)],
        [[_.multiplicative_expression, _.token.$symbol48, _.cast_expression], $ => Node(exports.NodeType.multiplicative_expression, $)],
        [[_.multiplicative_expression, _.token.$symbol49, _.cast_expression], $ => Node(exports.NodeType.multiplicative_expression, $)],
    ],
    cast_expression: _ => [
        [[_.unary_expression], $ => Node(exports.NodeType.cast_expression, $)],
        [[_.token.$symbol29, _.type_name, _.token.$symbol30, _.cast_expression], $ => Node(exports.NodeType.cast_expression, $)],
    ],
    unary_expression: _ => [
        [[_.postfix_expression], $ => Node(exports.NodeType.unary_expression, $)],
        [[_.token.$symbol50, _.unary_expression], $ => Node(exports.NodeType.unary_expression, $)],
        [[_.token.$symbol51, _.unary_expression], $ => Node(exports.NodeType.unary_expression, $)],
        [[_.unary_operator, _.cast_expression], $ => Node(exports.NodeType.unary_expression, $)],
        [[_.token.$symbol52, _.unary_expression], $ => Node(exports.NodeType.unary_expression, $)],
        [[_.token.$symbol52, _.type_name], $ => Node(exports.NodeType.unary_expression, $)],
    ],
    postfix_expression: _ => [
        [[_.primary_expression], $ => Node(exports.NodeType.postfix_expression, $)],
        [[_.postfix_expression, _.token.$symbol31, _.expression, _.token.$symbol32], $ => Node(exports.NodeType.postfix_expression, $)],
        [[_.postfix_expression, _.token.$symbol29, _.assignment_expression$rs, _.token.$symbol30], $ => Node(exports.NodeType.postfix_expression, $)],
        [[_.postfix_expression, _.token.$symbol53, _.identifier], $ => Node(exports.NodeType.postfix_expression, $)],
        [[_.postfix_expression, _.token.$symbol47, _.token.$symbol44, _.identifier], $ => Node(exports.NodeType.postfix_expression, $)],
        [[_.postfix_expression, _.token.$symbol50], $ => Node(exports.NodeType.postfix_expression, $)],
        [[_.postfix_expression, _.token.$symbol51], $ => Node(exports.NodeType.postfix_expression, $)],
    ],
    assignment_expression$r: _ => [
        [[_.assignment_expression], $ => $],
        [[], $ => $],
    ],
    assignment_expression$rs: _ => [
        [[_.assignment_expression$r], $ => Node(exports.NodeType.assignment_expression, $)],
        [[_.assignment_expression$rs, _.assignment_expression$r], $ => Node(exports.NodeType.assignment_expression, $[0].concat($[1]))],
    ],
    primary_expression: _ => [
        [[_.identifier], $ => Node(exports.NodeType.primary_expression, $)],
        [[_.constant], $ => Node(exports.NodeType.primary_expression, $)],
        [[_.string], $ => Node(exports.NodeType.primary_expression, $)],
        [[_.token.$symbol29, _.expression, _.token.$symbol30], $ => Node(exports.NodeType.primary_expression, $)],
    ],
    constant: _ => [
        [[_.integer_constant], $ => Node(exports.NodeType.constant, $)],
        [[_.character_constant], $ => Node(exports.NodeType.constant, $)],
        [[_.floating_constant], $ => Node(exports.NodeType.constant, $)],
    ],
    expression: _ => [
        [[_.assignment_expression], $ => Node(exports.NodeType.expression, $)],
        [[_.expression, _.token.$symbol24, _.assignment_expression], $ => Node(exports.NodeType.expression, $)],
    ],
    assignment_expression: _ => [
        [[_.conditional_expression], $ => Node(exports.NodeType.assignment_expression, $)],
        [[_.unary_expression, _.assignment_operator, _.assignment_expression], $ => Node(exports.NodeType.assignment_expression, $)],
    ],
    assignment_operator: _ => [
        [[_.token.$symbol45], $ => Node(exports.NodeType.assignment_operator, $)],
        [[_.token.$symbol54], $ => Node(exports.NodeType.assignment_operator, $)],
        [[_.token.$symbol55], $ => Node(exports.NodeType.assignment_operator, $)],
        [[_.token.$symbol56], $ => Node(exports.NodeType.assignment_operator, $)],
        [[_.token.$symbol57], $ => Node(exports.NodeType.assignment_operator, $)],
        [[_.token.$symbol58], $ => Node(exports.NodeType.assignment_operator, $)],
        [[_.token.$symbol34, _.token.$symbol34, _.token.$symbol45], $ => Node(exports.NodeType.assignment_operator, $)],
        [[_.token.$symbol44, _.token.$symbol44, _.token.$symbol45], $ => Node(exports.NodeType.assignment_operator, $)],
        [[_.token.$symbol59], $ => Node(exports.NodeType.assignment_operator, $)],
        [[_.token.$symbol60], $ => Node(exports.NodeType.assignment_operator, $)],
        [[_.token.$symbol61], $ => Node(exports.NodeType.assignment_operator, $)],
    ],
    unary_operator: _ => [
        [[_.token.$symbol41], $ => Node(exports.NodeType.unary_operator, $)],
        [[_.token.$symbol26], $ => Node(exports.NodeType.unary_operator, $)],
        [[_.token.$symbol46], $ => Node(exports.NodeType.unary_operator, $)],
        [[_.token.$symbol47], $ => Node(exports.NodeType.unary_operator, $)],
        [[_.token.$symbol62], $ => Node(exports.NodeType.unary_operator, $)],
        [[_.token.$symbol63], $ => Node(exports.NodeType.unary_operator, $)],
    ],
    type_name: _ => [
        [[_.specifier_qualifier$ms, _.abstract_declarator$o], $ => Node(exports.NodeType.type_name, $)],
    ],
    specifier_qualifier$m: _ => [
        [[_.specifier_qualifier], $ => $],
    ],
    specifier_qualifier$ms: _ => [
        [[_.specifier_qualifier$m], $ => Node(exports.NodeType.specifier_qualifier, $)],
        [[_.specifier_qualifier$ms, _.specifier_qualifier$m], $ => Node(exports.NodeType.specifier_qualifier, $[0].concat($[1]))],
    ],
    abstract_declarator$o: _ => [
        [[_.abstract_declarator], $ => Node(exports.NodeType.abstract_declarator, $)],
        [[], $ => $],
    ],
    parameter_type_list: _ => [
        [[_.parameter_list], $ => Node(exports.NodeType.parameter_type_list, $)],
        [[_.parameter_list, _.token.$symbol24, _.token.$symbol64], $ => Node(exports.NodeType.parameter_type_list, $)],
    ],
    parameter_list: _ => [
        [[_.parameter_declaration], $ => Node(exports.NodeType.parameter_list, $)],
        [[_.parameter_list, _.token.$symbol24, _.parameter_declaration], $ => Node(exports.NodeType.parameter_list, $)],
    ],
    parameter_declaration: _ => [
        [[_.declaration_specifier$ms, _.declarator], $ => Node(exports.NodeType.parameter_declaration, $)],
        [[_.declaration_specifier$ms, _.abstract_declarator], $ => Node(exports.NodeType.parameter_declaration, $)],
        [[_.declaration_specifier$ms], $ => Node(exports.NodeType.parameter_declaration, $)],
    ],
    declaration_specifier$m: _ => [
        [[_.declaration_specifier], $ => $],
    ],
    declaration_specifier$ms: _ => [
        [[_.declaration_specifier$m], $ => Node(exports.NodeType.declaration_specifier, $)],
        [[_.declaration_specifier$ms, _.declaration_specifier$m], $ => Node(exports.NodeType.declaration_specifier, $[0].concat($[1]))],
    ],
    abstract_declarator: _ => [
        [[_.pointer], $ => Node(exports.NodeType.abstract_declarator, $)],
        [[_.pointer, _.direct_abstract_declarator], $ => Node(exports.NodeType.abstract_declarator, $)],
        [[_.direct_abstract_declarator], $ => Node(exports.NodeType.abstract_declarator, $)],
    ],
    direct_abstract_declarator: _ => [
        [[_.token.$symbol29, _.abstract_declarator, _.token.$symbol30], $ => Node(exports.NodeType.direct_abstract_declarator, $)],
        [[_.direct_abstract_declarator, _.token.$symbol31, _.constant_expression$o, _.token.$symbol32], $ => Node(exports.NodeType.direct_abstract_declarator, $)],
        [[_.direct_abstract_declarator, _.token.$symbol29, _.parameter_type_list$o, _.token.$symbol30], $ => Node(exports.NodeType.direct_abstract_declarator, $)],
        [[_.token.$symbol31, _.constant_expression$o, _.token.$symbol32], $ => Node(exports.NodeType.direct_abstract_declarator, $)],
        [[_.token.$symbol29, _.parameter_type_list$o, _.token.$symbol30], $ => Node(exports.NodeType.direct_abstract_declarator, $)],
    ],
    parameter_type_list$o: _ => [
        [[_.parameter_type_list], $ => Node(exports.NodeType.parameter_type_list, $)],
        [[], $ => $],
    ],
    enumerator_list: _ => [
        [[_.enumerator], $ => Node(exports.NodeType.enumerator_list, $)],
        [[_.enumerator_list, _.token.$symbol24, _.enumerator], $ => Node(exports.NodeType.enumerator_list, $)],
    ],
    enumerator: _ => [
        [[_.identifier], $ => Node(exports.NodeType.enumerator, $)],
        [[_.identifier, _.token.$symbol45, _.constant_expression], $ => Node(exports.NodeType.enumerator, $)],
    ],
    declaration: _ => [
        [[_.declaration_specifier$ms, _.init_declarator$rs], $ => Node(exports.NodeType.declaration, $)],
    ],
    init_declarator$r: _ => [
        [[_.init_declarator], $ => $],
        [[], $ => $],
    ],
    init_declarator$rs: _ => [
        [[_.init_declarator$r], $ => Node(exports.NodeType.init_declarator, $)],
        [[_.init_declarator$rs, _.init_declarator$r], $ => Node(exports.NodeType.init_declarator, $[0].concat($[1]))],
    ],
    init_declarator: _ => [
        [[_.declarator], $ => Node(exports.NodeType.init_declarator, $)],
        [[_.declarator, _.token.$symbol45, _.initializer], $ => Node(exports.NodeType.init_declarator, $)],
    ],
    initializer: _ => [
        [[_.assignment_expression], $ => Node(exports.NodeType.initializer, $)],
        [[_.token.$symbol20, _.initializer_list, _.token.$symbol21], $ => Node(exports.NodeType.initializer, $)],
        [[_.token.$symbol20, _.initializer_list, _.token.$symbol24, _.token.$symbol21], $ => Node(exports.NodeType.initializer, $)],
    ],
    initializer_list: _ => [
        [[_.initializer], $ => Node(exports.NodeType.initializer_list, $)],
        [[_.initializer_list, _.token.$symbol24, _.initializer], $ => Node(exports.NodeType.initializer_list, $)],
    ],
    compound_statement: _ => [
        [[_.token.$symbol20, _.declaration$rs, _.statement$rs, _.token.$symbol21], $ => Node(exports.NodeType.compound_statement, $)],
    ],
    statement$r: _ => [
        [[_.statement], $ => $],
        [[], $ => $],
    ],
    statement$rs: _ => [
        [[_.statement$r], $ => Node(exports.NodeType.statement, $)],
        [[_.statement$rs, _.statement$r], $ => Node(exports.NodeType.statement, $[0].concat($[1]))],
    ],
    statement: _ => [
        [[_.labeled_statement], $ => Node(exports.NodeType.statement, $)],
        [[_.expression_statement], $ => Node(exports.NodeType.statement, $)],
        [[_.compound_statement], $ => Node(exports.NodeType.statement, $)],
        [[_.selection_statement], $ => Node(exports.NodeType.statement, $)],
        [[_.iteration_statement], $ => Node(exports.NodeType.statement, $)],
        [[_.jump_statement], $ => Node(exports.NodeType.statement, $)],
    ],
    labeled_statement: _ => [
        [[_.identifier, _.token.$symbol25, _.statement], $ => Node(exports.NodeType.labeled_statement, $)],
        [[_.token.$symbol66, _.constant_expression, _.token.$symbol25, _.statement], $ => Node(exports.NodeType.labeled_statement, $)],
        [[_.token.$symbol67, _.token.$symbol25, _.statement], $ => Node(exports.NodeType.labeled_statement, $)],
    ],
    expression_statement: _ => [
        [[_.expression$o, _.token.$symbol68], $ => Node(exports.NodeType.expression_statement, $)],
    ],
    expression$o: _ => [
        [[_.expression], $ => Node(exports.NodeType.expression, $)],
        [[], $ => $],
    ],
    selection_statement: _ => [
        [[_.token.$symbol69, _.token.$symbol29, _.expression, _.token.$symbol30, _.statement], $ => Node(exports.NodeType.selection_statement, $)],
        [[_.token.$symbol69, _.token.$symbol29, _.expression, _.token.$symbol30, _.statement, _.token.$symbol70, _.statement], $ => Node(exports.NodeType.selection_statement, $)],
        [[_.token.$symbol71, _.token.$symbol29, _.expression, _.token.$symbol30, _.statement], $ => Node(exports.NodeType.selection_statement, $)],
    ],
    iteration_statement: _ => [
        [[_.token.$symbol72, _.token.$symbol29, _.expression, _.token.$symbol30, _.statement], $ => Node(exports.NodeType.iteration_statement, $)],
        [[_.token.$symbol73, _.statement, _.token.$symbol72, _.token.$symbol29, _.expression, _.token.$symbol30, _.token.$symbol68], $ => Node(exports.NodeType.iteration_statement, $)],
        [[_.token.$symbol74, _.token.$symbol29, _.expression$o, _.token.$symbol68, _.expression$o, _.token.$symbol68, _.expression$o, _.token.$symbol30, _.statement], $ => Node(exports.NodeType.iteration_statement, $)],
    ],
    jump_statement: _ => [
        [[_.token.$symbol75, _.identifier, _.token.$symbol68], $ => Node(exports.NodeType.jump_statement, $)],
        [[_.token.$symbol76, _.token.$symbol68], $ => Node(exports.NodeType.jump_statement, $)],
        [[_.token.$symbol77, _.token.$symbol68], $ => Node(exports.NodeType.jump_statement, $)],
        [[_.token.$symbol78, _.expression$o, _.token.$symbol68], $ => Node(exports.NodeType.jump_statement, $)],
    ],
}, true);
const eg_1 = require('./eg');
const [token, tokenType] = tokenizer.tokenize(eg_1.default);
const result = parser.parse(token, tokenType, 'function_definition');
function getSpace(deep) {
    let str = "";
    for (let i = 0; i < deep; i++)
        str += "  ";
    return str;
}
for (let i = 0; i <= token.length; i++) {
}
function printResult(x, deep = 0) {
    if (x.hasOwnProperty(exports.NodeSymbol)) {
        return getSpace(deep) + x[exports.NodeSymbol].toString() + " : \n" + x.map(x => printResult(x, deep + 1)).join('\n');
    }
    else {
        return getSpace(deep) + `${x}\n`;
    }
}
console.log(printResult(result));
//const irGenerator = new IRGenerator();
//# sourceMappingURL=parser.js.map 
//# sourceMappingURL=parser.js.map