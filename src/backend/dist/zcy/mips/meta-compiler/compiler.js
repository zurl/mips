/**
 *  @file BNF Grammar Definition to TParser Definition Meta-Compielr
 *  @author zcy <zurl@live.com>
 *  Created at 10/30/2016
 */
"use strict";
const tparser_1 = require("tparser");
const bnf_test_1 = require('./bnf.test');
function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
}
function print(x) {
    if (isArray(x)) {
        return `[${x.map(x => print(x)).join(',')}]`;
    }
    else {
        return `${x}`;
    }
}
const tokenizer = new tparser_1.Tokenizer({
    split: /\s*(<[a-z0-9-]+>|::=|\||\*|\{|\}|[^<>\s]+|\>|\<)\s*/y,
    $item: /^<[a-z0-9-]+>$/,
    $def: /^::=$/,
    $rep: /^\*$/,
    $repmore: /^\+$/,
    $optional: /^\?$/,
    $or: /^\|$/,
    $token: [/^.+$/, -1],
    $lcb: /^\{$/,
    $rcb: /^\}$/,
    $end: /^@end@$/
});
const [token, tokenType] = tokenizer.tokenize(bnf_test_1.default);
const OptionalSymbol = Symbol("optional");
const RepSymbol = Symbol("rep");
const RepMoreSymbol = Symbol("repmore");
const optionalNode = (x) => { x[OptionalSymbol] = 1; return x; };
const repNode = (x) => { x[RepSymbol] = 1; return x; };
const repmoreNode = (x) => { x[RepMoreSymbol] = 1; return x; };
const parser = new tparser_1.Parser({
    token: tokenizer.token(),
    tokenMap: tokenizer.tokenMap(),
    tokenUnit: _ => [
        [[_.token.$token], $ => $[0]],
        [[_.token.$item], $ => $[0]],
        [[_.optionalTGC], $ => $[0]],
        [[_.repmoreTGC], $ => $[0]],
        [[_.repTGC], $ => $[0]],
    ],
    tokenGroup: _ => [
        [[_.tokenGroup, _.tokenUnit], $ => $[0].concat([$[1]])],
        [[_.tokenUnit], $ => [$[0]]],
    ],
    tokenGroupClosure: _ => [
        [[_.token.$lcb, _.tokenGroup, _.token.$rcb], $ => $[1]],
    ],
    repTGC: _ => [
        [[_.tokenGroupClosure, _.token.$rep], $ => repNode($[0])],
    ],
    repmoreTGC: _ => [
        [[_.tokenGroupClosure, _.token.$repmore], $ => repmoreNode($[0])],
    ],
    optionalTGC: _ => [
        [[_.tokenGroupClosure, _.token.$optional], $ => optionalNode($[0])],
    ],
    ruleUnit: _ => [
        [[_.tokenGroup], $ => $[0]],
    ],
    rule: _ => [
        [[_.rule, _.token.$or, _.ruleUnit], $ => $[0].concat([$[2]])],
        [[_.ruleUnit], $ => [$[0]]],
    ],
    item: _ => [
        [[_.token.$item, _.token.$def, _.rule, _.token.$end], $ => [$[0], $[2]]],
    ],
    items: _ => [
        [[_.items, _.item], $ => $[0].concat([$[1]])],
        [[_.item], $ => [$[0]]],
    ]
});
// ll3 grammar dealing
// insert @end@ at before 2 words ::=
const newtoken = [], newtokentype = [];
for (let i = 0; i <= token.length - 1; i++) {
    if (token[i + 1] == '::=' && i != 0) {
        newtoken.push('@end@');
        newtokentype.push(parser.tokenMap.get('$end'));
    }
    newtoken.push(token[i]);
    newtokentype.push(tokenType[i]);
}
newtoken.push('@end@');
newtokentype.push(parser.tokenMap.get('$end'));
const result = parser.parse(newtoken, newtokentype, 'items');
const exp = {};
const tokenHashMap = {};
let tokenHashNow = 0;
function getTokenHash(str) {
    if (tokenHashMap.hasOwnProperty(str))
        return tokenHashMap[str];
    else {
        if (/^[a-z]$/.test(str))
            tokenHashMap[str] = str;
        tokenHashMap[str] = `$symbol${++tokenHashNow}`;
        return tokenHashMap[str];
    }
}
// replace the invalid char in the expression name
// which can not use in Standard Javascript
function replaceInvalidChar(str) {
    if (str[0] == '<' && str[str.length - 1] == '>')
        return str.substring(1, str.length - 1).replace(/[^a-z]/g, '_');
    return str.replace(/[^a-z]/g, '_');
}
function convertToGrammarRule(str) {
    if (str[0] == '<' && str[str.length - 1] == '>')
        return `_.${replaceInvalidChar(str)}`;
    else
        return `_.token.${getTokenHash(str)}`;
}
result.forEach(item => {
    exp[replaceInvalidChar(item[0])] = [];
    item[1].forEach(rule => {
        const result = [];
        rule.forEach(token => {
            if (token.hasOwnProperty(OptionalSymbol)) {
                exp[`${replaceInvalidChar(token[0])}$o`] = [`[${token.map(x => convertToGrammarRule(x)).join(',')}],$=>Node(NodeType.${replaceInvalidChar(token[0])},$)`, `[],$=>$`];
                result.push(`_.${replaceInvalidChar(token[0])}$o`);
            }
            else if (token.hasOwnProperty(RepSymbol)) {
                exp[`${replaceInvalidChar(token[0])}$r`] = [`[${token.map(x => convertToGrammarRule(x)).join(',')}],$=>$`, `[],$=>$`];
                exp[`${replaceInvalidChar(token[0])}$rs`] = [`[_.${replaceInvalidChar(token[0])}$r],$=>Node(NodeType.${replaceInvalidChar(token[0])}, $)`,
                    `[_.${replaceInvalidChar(token[0])}$rs, _.${replaceInvalidChar(token[0])}$r],$=>Node(NodeType.${replaceInvalidChar(token[0])},$[0].concat($[1]))`];
                result.push(`_.${replaceInvalidChar(token[0])}$rs`);
            }
            else if (token.hasOwnProperty(RepMoreSymbol)) {
                exp[`${replaceInvalidChar(token[0])}$m`] = [`[${token.map(x => convertToGrammarRule(x)).join(',')}],$=>$`];
                exp[`${replaceInvalidChar(token[0])}$ms`] = [`[_.${replaceInvalidChar(token[0])}$m],$=>Node(NodeType.${replaceInvalidChar(token[0])}, $)`,
                    `[_.${replaceInvalidChar(token[0])}$ms, _.${replaceInvalidChar(token[0])}$m],$=>Node(NodeType.${replaceInvalidChar(token[0])},$[0].concat($[1])))`];
                result.push(`_.${replaceInvalidChar(token[0])}$ms`);
            }
            else {
                result.push(convertToGrammarRule(token));
            }
        });
        exp[replaceInvalidChar(item[0])].push(`[${result.join(',')}],$=>Node(NodeType.${replaceInvalidChar(item[0])}, $)`);
    });
});
function getRegDef(str) {
    return str
        .replace('@', '')
        .replace(/\+/g, '\\+')
        .replace(/\(/g, '\\(')
        .replace(/\|/g, '\\|')
        .replace(/\)/g, '\\)')
        .replace(/\?/g, '\\?')
        .replace(/\./g, '\\.')
        .replace(/\[/g, '\\[')
        .replace(/\*/g, '\\*')
        .replace(/\{/g, '\\{')
        .replace(/\//g, '\\/');
}
function getDefFile() {
    return `
export interface IMyTokenizer extends IAbstractTokenElements {
${Object.keys(tokenHashMap).map(x => `    ${tokenHashMap[x]}: IToken;`).join('\n' +
        '')}
}
export interface IMyParser<T extends IAbstractTokenElements> extends IAbstractParserElements<T> {
${Object.keys(exp).map(x => `    ${x}: ISymbol<IMyParser<T>>;`).join('\n')}
}
`;
}
function getTokenizer() {
    return `
import {IAbstractTokenElements,IToken,IAbstractParserElements,ISymbol} from 'tparser';
import {Parser, Tokenizer} from "tparser";
const tokenizer = new Tokenizer<IMyTokenizer>({
    split: /\s*\s*/y,
${Object.keys(tokenHashMap).map(x => `    ${tokenHashMap[x]}: /^${getRegDef(x)}$/,`).join('\n')}
});
`;
}
function getParser() {
    return `
const NodeSymbol = Symbol("Node");
function Node(type, array){
     array[NodeSymbol] = type;
     return array;
}
const NodeType = {
${Object.keys(exp).map(item => `    ${item}: Symbol("${item}"),`).join('\n')}
};
const parser = new Parser<IMyTokenizer, IMyParser<IMyTokenizer>>({
    token: tokenizer.token(),
    tokenMap: tokenizer.tokenMap(),
${Object.keys(exp).map(item => `    ${item}: _=>[\n` + exp[item].map(rule => `       [${rule}],`).join('\n') + '\n    ],').join('\n')}
});
`;
}
console.log(getDefFile());
console.log(getTokenizer());
console.log(getParser());
//# sourceMappingURL=compiler.js.map