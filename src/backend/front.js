"use strict";
exports.__esModule = true;
var assembler_1 = require("./assembler/assembler");
var disassmbler_1 = require("./assembler/disassmbler");
var fastvm_1 = require("./assembler/fastvm");
var vue_1 = require("vue");
var webos_1 = require("./webos");
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 2017/3/3
 */
window["editor"] = window["ace"].edit("editor");
window["editor"].getSession().setMode("ace/mode/assembly_x86");
window["editor"].setTheme("ace/theme/tomorrow");
function addFrontZero(str) {
    str = '000000000000' + str;
    return str.substring(str.length - 8, str.length);
}
var asmer = new assembler_1.MIPSAssembler();
var vm = new fastvm_1.MIPSVM(new webos_1.WebOS());
var program;
var app = new vue_1["default"]({
    el: '#app',
    data: {
        info: [],
        vm: vm.getInfo(),
        pc: 0,
        message: 'You loaded this page on ' + new Date()
    },
    methods: {
        addFrontZero: addFrontZero,
        compile: function () {
            var cmd = window["editor"].getValue();
            program = asmer.parse(cmd);
            vm.setMemory(program);
            var ret = [];
            for (var i = 0; i <= 50; i++) {
                var x = program.getUint32(i * 4);
                ret[i] = [
                    addFrontZero((i * 4).toString(16)),
                    addFrontZero(x.toString(16)),
                    disassmbler_1.disassmble(x)
                ];
            }
            this["info"] = ret;
            vm.cleanup();
        },
        runLine: function () {
            vm.runLine();
            this["vm"] = vm.getInfo();
            this["pc"] = vm.PC;
        },
        run: function () {
            vm.run(40 * 4);
            this["vm"] = vm.getInfo();
            this["pc"] = vm.PC;
        }
    },
    template: "\n    <div class=\"flex\">\n        <div  style=\"padding-right: 20px\">\n            <button @click=\"compile()\"> compile</button>\n            <button @click=\"runLine()\"> runLine</button>\n            <button @click=\"run()\"> run</button>\n            <div class=\"flex\">\n            \n            <ul >\n                <div> PC </div>\n              <li v-for=\"item in vm\">\n                {{ item[0]  }}\n              </li>\n            </ul>\n            <ul >\n                <div> {{pc}}</div>\n              <li v-for=\"item in vm\">\n                {{ addFrontZero(item[1]) }}\n              </li>\n            </ul>\n            </div>\n        </div>\n        <div> \n            <ul >\n              <li v-for=\"item in info\">\n                       <span v-if=\"parseInt(item[0],16) == pc\"> *</span>\n                    {{item[0]}}:{{item[1]}}:{{item[2]}}\n              </li>\n            </ul>\n        </div>\n    </div>\n    "
});
