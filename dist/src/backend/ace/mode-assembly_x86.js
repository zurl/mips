define("ace/mode/assembly_x86_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"), i = e("./text_highlight_rules").TextHighlightRules, s = function () {
        this.$rules = {
            start: [{
                    token: 'support.parameter.name.function.label',
                    regex: '\\b(?:[a-z0-9]*)\\b\\:\\s*',
                    caseInsensitive: false,
                    next: 'start'
                }, {
                    token: 'keyword.assembly.rrr',
                    regex: '\\b(?:addu?|subu?|sltu?|and|xor|nor|or|sllv|srlv|srav)\\b\\s*',
                    caseInsensitive: false,
                    next: 'rrrr1'
                }, {
                    token: 'keyword.assembly.rnr',
                    regex: '\\b(?:lbu?|lhu?|lw|sb|sh|sw)\\b\\s*',
                    caseInsensitive: false,
                    next: 'rnrr1'
                }, {
                    token: 'keyword.assembly.rnr',
                    regex: '\\b(?:sll|sra|srl|ori|addiu?|andi|xori|sltiu?)\\b\\s*',
                    caseInsensitive: false,
                    next: 'rrnr1'
                }, {
                    token: 'keyword.assembly.rrw',
                    regex: '\\b(?:beq|bne?)\\b\\s*',
                    caseInsensitive: false,
                    next: 'rrwr1'
                }, {
                    token: 'keyword.assembly.rw',
                    regex: '\\b(?:blez|bgez|bltz|bgtz?)\\b\\s*',
                    caseInsensitive: false,
                    next: 'rrwr2'
                }, {
                    token: 'keyword.assembly.rr',
                    regex: '\\b(?:divu?|multu?|jalr|move)\\b\\s*',
                    caseInsensitive: false,
                    next: 'rrrr2'
                }, {
                    token: 'keyword.assembly.r',
                    regex: '\\b(?:mfhi|mflo|mthi|mtlo|jr)\\b\\s*',
                    caseInsensitive: false,
                    next: 'rrrr3'
                }, {
                    token: 'keyword.assembly.w',
                    regex: '\\b(?:j|jal)\\b\\s*',
                    caseInsensitive: false,
                    next: 'rrww1'
                }, {
                    token: 'keyword.assembly.n',
                    regex: '\\b(?:break)\\b\\s*',
                    caseInsensitive: false,
                    next: 'rrnn1'
                }, {
                    token: 'keyword.assembly.rn',
                    regex: '\\b(?:lui)\\b\\s*',
                    caseInsensitive: false,
                    next: 'rrnr2'
                }, {
                    token: 'keyword.assembly.none',
                    regex: '\\b(?:syscall|nop)\\b\\s*',
                    caseInsensitive: false,
                    next: 'end'
                }, {
                    token: 'constant.character.decimal.assembly',
                    regex: '\\b[0-9]+\\b'
                }, {
                    token: 'constant.character.hexadecimal.assembly',
                    regex: '\\b0x[A-F0-9]+\\b',
                    caseInsensitive: true
                }, {
                    token: 'constant.character.hexadecimal.assembly',
                    regex: '\\b[A-F0-9]+h\\b',
                    caseInsensitive: true
                }, {
                    token: 'string.assembly',
                    regex: /'([^\\']|\\.)*'/
                }, {
                    token: 'string.assembly',
                    regex: /"([^\\"]|\\.)*"/
                },
                { token: 'comment.assembly', regex: '//.*$' }
            ],
            rnrr1: [{
                    token: 'variable.register.rnr.$1',
                    regex: '\\$(a[0-3]|t[0-7]|s[0-9]|k[0-1]|v[0-1]|ra|fp|sp|gp|at|zero)\\b',
                    next: 'rnrc1'
                }],
            rnrc1: [{
                    token: 'comma.rrr.$1',
                    regex: '\\s*,\\s*',
                    next: 'rnrn1'
                }],
            rnrn1: [{
                    token: 'constant.character.decimal',
                    regex: '-?\\b[0-9]+\\b',
                    next: 'rnrb1'
                }],
            rnrb1: [{
                    token: 'comma.rrr.$1',
                    regex: '\\s*\\(\\s*',
                    next: 'rnrr2'
                }],
            rnrr2: [{
                    token: 'variable.register.rnr.$2',
                    regex: '\\$(a[0-3]|t[0-7]|s[0-9]|k[0-1]|v[0-1]|ra|fp|sp|gp|at|zero)\\b',
                    next: 'rnrb2'
                }], rnrb2: [{
                    token: 'comma.rrr.$1',
                    regex: '\\s*\\)\\s*',
                    next: 'end'
                }],
            rrrr1: [{
                    token: 'variable.register.rrr.$1',
                    regex: '\\$(a[0-3]|t[0-7]|s[0-9]|k[0-1]|v[0-1]|ra|fp|sp|gp|at|zero)\\b',
                    next: 'rrrc1'
                }],
            rrrc1: [{
                    token: 'comma.rrr.$1',
                    regex: '\\s*,\\s*',
                    next: 'rrrr2'
                }],
            rrrr2: [{
                    token: 'variable.register.rrr.$2',
                    regex: '\\$(\\ba[0-3]|t[0-7]|s[0-9]|k[0-1]|v[0-1]|ra|fp|sp|gp|at|zero)\\b',
                    next: 'rrrc2'
                }],
            rrrc2: [{
                    token: 'comma.rrr.$2',
                    regex: '\\s*,\\s*',
                    next: 'rrrr3'
                }],
            rrrr3: [{
                    token: 'variable.register.rrr.$3',
                    regex: '\\$(\\ba[0-3]|t[0-7]|s[0-9]|k[0-1]|v[0-1]|ra|fp|sp|gp|at|zero)\\b',
                    next: 'end'
                }],
            rrnr1: [{
                    token: 'variable.register.rrn.$1',
                    regex: '\\$(a[0-3]|t[0-7]|s[0-9]|k[0-1]|v[0-1]|ra|fp|sp|gp|at|zero)\\b',
                    next: 'rrnc1'
                }],
            rrnc1: [{
                    token: 'comma.rrn.$1',
                    regex: '\\s*,\\s*',
                    next: 'rrnr2'
                }],
            rrnr2: [{
                    token: 'variable.register.rrn.$2',
                    regex: '\\$(\\ba[0-3]|t[0-7]|s[0-9]|k[0-1]|v[0-1]|ra|fp|sp|gp|at|zero)\\b',
                    next: 'rrnc2'
                }],
            rrnc2: [{
                    token: 'comma.rrn.$2',
                    regex: '\\s*,\\s*',
                    next: 'rrrn1'
                }],
            rrrn1: [{
                    token: 'constant.character.decimal',
                    regex: '-?\\b[0-9]+\\b',
                    next: 'end'
                }],
            rrwr1: [{
                    token: 'variable.register.rrw.$1',
                    regex: '\\$(a[0-3]|t[0-7]|s[0-9]|k[0-1]|v[0-1]|ra|fp|sp|gp|at|zero)\\b',
                    next: 'rrwc1'
                }],
            rrwc1: [{
                    token: 'comma.rrw.$1',
                    regex: '\\s*,\\s*',
                    next: 'rrwr2'
                }],
            rrwr2: [{
                    token: 'variable.register.rrw.$2',
                    regex: '\\$(\\ba[0-3]|t[0-7]|s[0-9]|k[0-1]|v[0-1]|ra|fp|sp|gp|at|zero)\\b',
                    next: 'rrwc2'
                }],
            rrwc2: [{
                    token: 'comma.rrw.$2',
                    regex: '\\s*,\\s*',
                    next: 'rrww1'
                }],
            rrww1: [{
                    token: 'support.parameter.rw.label',
                    regex: '\\b(?:[a-zA-Z0-9]*)\\b',
                    next: 'end'
                }],
            end: [{
                    token: 'keyword.assembly.end',
                    regex: '\\s*;\\s*',
                    next: 'start'
                }]
        }, this.normalizeRules();
    };
    s.metaData = {
        fileTypes: ["asm"],
        name: "Assembly x86",
        scopeName: "source.assembly"
    }, r.inherits(s, i), t.AssemblyX86HighlightRules = s;
}), define("ace/mode/folding/coffee", ["require", "exports", "module", "ace/lib/oop", "ace/mode/folding/fold_mode", "ace/range"], function (e, t, n) {
    "use strict";
    var r = e("../../lib/oop"), i = e("./fold_mode").FoldMode, s = e("../../range").Range, o = t.FoldMode = function () {
    };
    r.inherits(o, i), function () {
        this.getFoldWidgetRange = function (e, t, n) {
            var r = this.indentationBlock(e, n);
            if (r)
                return r;
            var i = /\S/, o = e.getLine(n), u = o.search(i);
            if (u == -1 || o[u] != "#")
                return;
            var a = o.length, f = e.getLength(), l = n, c = n;
            while (++n < f) {
                o = e.getLine(n);
                var h = o.search(i);
                if (h == -1)
                    continue;
                if (o[h] != "#")
                    break;
                c = n;
            }
            if (c > l) {
                var p = e.getLine(c).length;
                return new s(l, a, c, p);
            }
        }, this.getFoldWidget = function (e, t, n) {
            var r = e.getLine(n), i = r.search(/\S/), s = e.getLine(n + 1), o = e.getLine(n - 1), u = o.search(/\S/), a = s.search(/\S/);
            if (i == -1)
                return e.foldWidgets[n - 1] = u != -1 && u < a ? "start" : "", "";
            if (u == -1) {
                if (i == a && r[i] == "#" && s[i] == "#")
                    return e.foldWidgets[n - 1] = "", e.foldWidgets[n + 1] = "", "start";
            }
            else if (u == i && r[i] == "#" && o[i] == "#" && e.getLine(n - 2).search(/\S/) == -1)
                return e.foldWidgets[n - 1] = "start", e.foldWidgets[n + 1] = "", "";
            return u != -1 && u < i ? e.foldWidgets[n - 1] = "start" : e.foldWidgets[n - 1] = "", i < a ? "start" : "";
        };
    }.call(o.prototype);
}), define("ace/mode/assembly_x86", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/assembly_x86_highlight_rules", "ace/mode/folding/coffee"], function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"), i = e("./text").Mode, s = e("./assembly_x86_highlight_rules").AssemblyX86HighlightRules, o = e("./folding/coffee").FoldMode, u = function () {
        this.HighlightRules = s, this.foldingRules = new o, this.$behaviour = this.$defaultBehaviour;
    };
    r.inherits(u, i), function () {
        this.lineCommentStart = ";", this.$id = "ace/mode/assembly_x86";
    }.call(u.prototype), t.Mode = u;
});
//# sourceMappingURL=mode-assembly_x86.js.map