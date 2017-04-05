/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 2017/3/8
 */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
window["codeStorage"] = '';
window["readOnly"] = true;
var Editor = (function (_super) {
    __extends(Editor, _super);
    function Editor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Editor.prototype.componentDidMount = function () {
        console.log('mounted');
        window["editor"] = window["ace"].edit("editor");
        window["editor"].getSession().setMode("ace/mode/assembly_x86");
        window["editor"].setTheme("ace/theme/tomorrow");
        if (window["readOnly"]) {
            window["editor"].setReadOnly(true);
        }
        else {
            window["editor"].setReadOnly(false);
        }
    };
    Editor.prototype.render = function () {
        console.log('r1');
        console.log('r2');
        return (React.createElement("div", { id: "editor" }, window["codeStorage"]));
    };
    return Editor;
}(React.Component));
exports.Editor = Editor;
//# sourceMappingURL=editor.js.map