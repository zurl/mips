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
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 2017/3/8
 */
var injectTapEventPlugin = require("react-tap-event-plugin");
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
var React = require("react");
var ReactDOM = require("react-dom");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var AppBar_1 = require("material-ui/AppBar");
var editor_1 = require("./editor");
var electron = eval("require('electron')");
var material_ui_1 = require("material-ui");
var material_ui_2 = require("material-ui");
var material_ui_3 = require("material-ui");
var IconMenu_1 = require("material-ui/IconMenu");
var IconButton_1 = require("material-ui/IconButton");
var Menu_1 = require("material-ui/Menu");
var menu_1 = require("material-ui/svg-icons/navigation/menu");
var arrow_back_1 = require("material-ui/svg-icons/navigation/arrow-back");
var Component = React.Component;
var colors_1 = require("material-ui/styles/colors");
var RaisedButton_1 = require("material-ui/RaisedButton");
var material_ui_4 = require("material-ui");
var material_ui_5 = require("material-ui");
var material_ui_6 = require("material-ui");
var material_ui_7 = require("material-ui");
var material_ui_8 = require("material-ui");
var material_ui_9 = require("material-ui");
var api_1 = require("./api");
var material_ui_10 = require("material-ui");
var material_ui_11 = require("material-ui");
var material_ui_12 = require("material-ui");
var material_ui_13 = require("material-ui");
var material_ui_14 = require("material-ui");
var keyboard_arrow_left_1 = require("material-ui/svg-icons/hardware/keyboard-arrow-left");
var keyboard_arrow_right_1 = require("material-ui/svg-icons/hardware/keyboard-arrow-right");
//const dialog = {};
//const fs = {};
var dialog = electron.remote.dialog;
var fs = eval("require('fs')");
function addFrontZero(str) {
    str = '000000000000' + str;
    return str.substring(str.length - 8, str.length);
}
var UtilMenu = (function (_super) {
    __extends(UtilMenu, _super);
    function UtilMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.open = function (mode) { return function () {
            if (_this.props.filePath) {
                _this.close();
            }
            var path = dialog.showOpenDialog({ properties: ['openFile'] });
            if (path.length == 0)
                return;
            _this.props.setFilePath(path[0]);
            if (mode == 'asm') {
                window["codeStorage_t"] = fs.readFileSync(path[0], "utf-8");
                _this.props.refreshView();
            }
            else if (mode == "coe") {
                var tt = fs.readFileSync(path[0], "utf-8");
                window["codeStorage_t"] = api_1.decodeCOE(tt);
                _this.props.refreshView();
                path += ".asm";
            }
            else if (mode == "bin") {
                var tt = fs.readFileSync(path[0], null);
                window["codeStorage_t"] = api_1.decodeBIN(tt);
                _this.props.refreshView();
                path += ".asm";
            }
        }; };
        _this.saveThis = function () {
            window["codeStorage"] = window["editor"].getValue();
            fs.writeFileSync(_this.props.filePath, window["codeStorage"], "utf8");
        };
        _this.save = function (mode) { return function () {
            var path = dialog.showSaveDialog();
            if (!path)
                return;
            if (mode == 'asm') {
                //window["codeStorage"] = window["editor"].getValue();
                fs.writeFileSync(path, window["editor"].getValue(), "utf8");
            }
            else if (mode == 'bin') {
                var assemblyData = api_1.assemble(window["editor"].getValue());
                fs.writeFileSync(path, new Uint8Array(assemblyData.buffer.slice(0, 1024)), "utf8");
            }
            else if (mode == 'coe') {
                //window["codeStorage_r"] = window["editor"].getValue();
                var assemblyData = api_1.assemble(window["editor"].getValue());
                var coe = "memory_initialization_radix=16;\n" +
                    "memory_initializaton_vector=";
                for (var i = 0; i < 256; i++) {
                    if (i != 0)
                        coe += ',';
                    var v = assemblyData.getUint32(i * 4);
                    coe += addFrontZero(v.toString(16));
                }
                coe += ';\n';
                fs.writeFileSync(path, coe, "utf8");
            }
        }; };
        _this.create = function () {
            if (_this.props.filePath) {
                _this.close();
            }
            var path = dialog.showSaveDialog();
            if (!path)
                return;
            _this.props.setFilePath(path);
            _this.props.onCreate(path);
        };
        _this.onSave = function () {
            window["codeStorage"] = window["editor"].getValue();
            fs.writeFileSync(_this.props.filePath, window["codeStorage"], "utf8");
        };
        _this.close = function () {
            _this.props.setFilePath(null);
            window["codeStorage"] = '';
            window["editor"].setValue('');
            _this.props.onClose('');
        };
        return _this;
    }
    UtilMenu.prototype.render = function () {
        var apped = [React.createElement(Menu_1.MenuItem, { primaryText: "Save File", onClick: this.onSave }),
            React.createElement(Menu_1.MenuItem, { primaryText: "Save as Asm", onClick: this.save('asm') }),
            React.createElement(Menu_1.MenuItem, { primaryText: "Save as Bin", onClick: this.save('bin') }),
            React.createElement(Menu_1.MenuItem, { primaryText: "Save as Coe", onClick: this.save('coe') }),
            React.createElement(Menu_1.MenuItem, { primaryText: "Close File", onClick: this.close })];
        return (React.createElement(IconMenu_1.default, { iconButtonElement: React.createElement(IconButton_1.default, null,
                React.createElement(menu_1.default, { color: colors_1.white })), targetOrigin: { horizontal: 'right', vertical: 'top' }, anchorOrigin: { horizontal: 'right', vertical: 'top' } },
            React.createElement(Menu_1.MenuItem, { primaryText: "New File", onClick: this.create }),
            React.createElement(Menu_1.MenuItem, { primaryText: "Open Asm", onClick: this.open('asm') }),
            React.createElement(Menu_1.MenuItem, { primaryText: "Open Bin", onClick: this.open('bin') }),
            React.createElement(Menu_1.MenuItem, { primaryText: "Open Coe", onClick: this.open('coe') }),
            this.props.filePath ? apped : []));
    };
    return UtilMenu;
}(Component));
UtilMenu.muiName = 'IconMenu';
var NarrowColumn = {
    width: '8px',
    height: '36px'
};
var Narrow2Column = {
    width: '78px',
    height: '36px',
    fontFamily: 'monospace'
};
var NarrowRow = {
    height: '36px'
};
var NormalColumn = {
    height: '36px',
    paddingLeft: '8px',
    paddingRight: '8px',
    fontFamily: 'monospace'
};
var ResultView = (function (_super) {
    __extends(ResultView, _super);
    function ResultView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResultView.prototype.render = function () {
        return (this.props.data == null ?
            React.createElement("div", { style: { display: 'flex', height: '70%', minHeight: '70%', justifyContent: 'center', alignItems: 'center' } },
                React.createElement(material_ui_10.CircularProgress, { size: 80, thickness: 5 })) :
            React.createElement("div", { style: { display: 'flex', height: '70%', minHeight: '70%', justifyContent: 'center', alignItems: 'center' } },
                React.createElement(MachineCodeView, { data: this.props.data }),
                React.createElement(DebuggerView, { register: this.props.register })));
    };
    return ResultView;
}(React.Component));
var DebuggerView = (function (_super) {
    __extends(DebuggerView, _super);
    function DebuggerView(props) {
        var _this = _super.call(this, props) || this;
        _this.handlePage = function () {
            _this.setState({
                page: _this.state.page == 0 ? 1 : 0
            });
        };
        _this.state = {
            page: 0
        };
        return _this;
    }
    DebuggerView.prototype.render = function () {
        var registerView = [];
        for (var i = 0; i < 18; i++) {
            var x = this.props.register[this.state.page == 0 ? i : i + 18];
            if (!x)
                break;
            registerView.push(React.createElement("li", null,
                x[0],
                " : ",
                x[1]));
        }
        return (React.createElement("div", { style: { minWidth: '200px', overflowY: 'auto' } },
            React.createElement(RaisedButton_1.default, { onClick: this.handlePage, label: "Switch", primary: true }),
            React.createElement(material_ui_1.Card, { style: { overflowY: 'auto' } },
                React.createElement(material_ui_2.CardText, null,
                    React.createElement("ul", null, registerView)))));
    };
    return DebuggerView;
}(React.Component));
exports.DebuggerView = DebuggerView;
var MachineCodeView = (function (_super) {
    __extends(MachineCodeView, _super);
    function MachineCodeView(props) {
        var _this = _super.call(this, props) || this;
        _this.handleGoto = function () {
            _this.setState({
                current: document.getElementById("addr-line")["value"]
            });
        };
        _this.handleLeft = function () {
            if (_this.state.current > 0) {
                _this.setState({
                    current: _this.state.current - MachineCodeView.PAGE_SIZE
                });
            }
        };
        _this.handleRight = function () {
            if (_this.state.current < 1024 * 1024 / 4 - MachineCodeView.PAGE_SIZE * 2) {
                _this.setState({
                    current: _this.state.current + MachineCodeView.PAGE_SIZE
                });
            }
        };
        _this.state = {
            current: 0,
            pc: 0
        };
        return _this;
    }
    MachineCodeView.prototype.componentDidMount = function () {
        var that = this;
        // force update
        window["updateMachineCode"] = function (pc) {
            that.setState({
                pc: pc
            });
        };
    };
    MachineCodeView.prototype.render = function () {
        var items = [];
        for (var i = 0; i < MachineCodeView.PAGE_SIZE * 2; i++) {
            if (i >= this.props.data.length)
                break;
            var item = api_1.getAsmViewData(this.props.data, (i + this.state.current));
            items.push(React.createElement(material_ui_6.TableRow, { style: NarrowRow, key: i },
                React.createElement(material_ui_9.TableRowColumn, { style: NarrowColumn }, (i + this.state.current) * 4 == this.state.pc ? '*' : ' '),
                React.createElement(material_ui_9.TableRowColumn, { style: Narrow2Column }, item[0]),
                React.createElement(material_ui_9.TableRowColumn, { style: Narrow2Column }, item[1]),
                React.createElement(material_ui_9.TableRowColumn, { style: Narrow2Column }, item[3] ? "LABEL_" + (i + this.state.current) + ":" : ''),
                React.createElement(material_ui_9.TableRowColumn, { style: NormalColumn }, item[2])));
        }
        return (React.createElement("div", { style: { height: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column' } },
            React.createElement(material_ui_11.Toolbar, null,
                React.createElement(material_ui_12.ToolbarGroup, { firstChild: true, style: { marginLeft: "0px" } },
                    React.createElement(material_ui_14.TextField, { hintText: "Line Address", id: "addr-line" }),
                    React.createElement(RaisedButton_1.default, { onClick: this.handleGoto, label: "Goto", primary: true })),
                React.createElement(material_ui_12.ToolbarGroup, { lastChild: true },
                    React.createElement(material_ui_13.ToolbarSeparator, null),
                    React.createElement(IconButton_1.default, { onClick: this.handleLeft, touch: true, tooltipPosition: "bottom-right" },
                        React.createElement(keyboard_arrow_left_1.default, null)),
                    React.createElement(IconButton_1.default, { onClick: this.handleRight, touch: true, tooltipPosition: "bottom-right" },
                        React.createElement(keyboard_arrow_right_1.default, null)))),
            React.createElement(material_ui_4.Table, { selectable: true, multiSelectable: true, wrapperStyle: { display: 'flex', flexDirection: 'column', height: '100%' } },
                React.createElement(material_ui_5.TableHeader, { displaySelectAll: false },
                    React.createElement(material_ui_6.TableRow, { style: NarrowRow },
                        React.createElement(material_ui_7.TableHeaderColumn, { style: Narrow2Column }, "Address"),
                        React.createElement(material_ui_7.TableHeaderColumn, { style: Narrow2Column }, "Machine Code"),
                        React.createElement(material_ui_7.TableHeaderColumn, { style: Narrow2Column }, "Flag"),
                        React.createElement(material_ui_7.TableHeaderColumn, { style: NormalColumn }, "Assembly"))),
                React.createElement(material_ui_8.TableBody, { style: { overflowY: 'auto' }, displayRowCheckbox: false }, items))));
    };
    return MachineCodeView;
}(React.Component));
MachineCodeView.PAGE_SIZE = 64;
//
var Application = (function (_super) {
    __extends(Application, _super);
    function Application(props) {
        var _this = _super.call(this, props) || this;
        _this.runLine = function () {
            api_1.runline(function () {
                var reg = api_1.getRegisterInfo();
                _this.setState({
                    register: reg
                });
                window["updateMachineCode"](reg[32][1]);
            });
        };
        _this.handleChangeView = function () {
            if (window["readOnly"])
                return;
            if (_this.state.onResultView) {
                _this.setState({ onResultView: false });
            }
            else {
                window["codeStorage"] = window["editor"].getValue();
                _this.setState({
                    onResultView: true,
                    assemblyData: null
                });
                var that_1 = _this;
                setTimeout(function () {
                    var assemblyData = api_1.assemble(window["editor"].getValue());
                    api_1.initvm(assemblyData);
                    that_1.setState({
                        assemblyData: assemblyData
                    });
                }, 500);
            }
        };
        _this.updateView = function (mode) { return function () {
            if (mode = 'asm') {
                if (_this.state.onResultView) {
                    _this.setState({ onResultView: false });
                    console.log('shit');
                }
                window["editor"].setValue(window["codeStorage_t"]);
            }
            _this.handleCreate('');
            //window["codeStorage"] = window["codeStorage_t"];
        }; };
        _this.handleCreate = function (path) {
            window["readOnly"] = false;
            window["editor"].setReadOnly(false);
        };
        _this.handleClose = function (path) {
            window["readOnly"] = true;
            window["editor"].setReadOnly(true);
        };
        _this.setFilePath = function (path) {
            _this.setState({ filePath: path });
        };
        _this.state = {
            text: [],
            onResultView: false,
            noFile: true,
            assemblyResult: null,
            register: api_1.getRegisterInfo(),
            filePath: null,
        };
        return _this;
    }
    Application.prototype.componentDidMount = function () {
        var that = this;
        window["logger"] = {
            log: function (text) {
                that.setState({
                    text: that.state.text.concat([React.createElement("p", { className: "console-text" }, text)])
                });
            }
        };
        window["logger"].log("ASmart MIPS Assembler v0.0.1");
    };
    Application.prototype.render = function () {
        return (React.createElement("div", { style: { overflow: 'hidden', height: "100%", display: 'flex', flexDirection: 'column' } },
            React.createElement(AppBar_1.default, { style: { minHeight: '64px' }, title: "ASmart", iconElementLeft: this.state.onResultView ?
                    React.createElement(IconButton_1.default, { onClick: this.handleChangeView },
                        React.createElement(arrow_back_1.default, { color: colors_1.white }))
                    : React.createElement(UtilMenu, { filePath: this.state.filePath, setFilePath: this.setFilePath, onCreate: this.handleCreate, onClose: this.handleClose, refreshView: this.updateView('asm') }), iconStyleRight: { margin: 'auto' }, iconElementRight: this.state.onResultView ?
                    React.createElement("div", null,
                        React.createElement(material_ui_3.FlatButton, { style: { color: 'white' }, onClick: this.runLine, label: "RunLine" }))
                    : React.createElement("div", { style: { display: 'flex', alignItems: 'center' } },
                        React.createElement(material_ui_3.FlatButton, { style: { color: 'white' }, label: "Assemble", onClick: this.handleChangeView })) }),
            (!this.state.onResultView) ?
                React.createElement(editor_1.Editor, null) :
                React.createElement(ResultView, { register: this.state.register, data: this.state.assemblyData }),
            React.createElement("div", { style: { flexGrow: 1, flexDirection: 'column', display: 'flex', padding: '10px' } },
                React.createElement(material_ui_1.Card, { containerStyle: { padding: '0px' }, style: { overflowY: 'auto', flexGrow: 1 } },
                    React.createElement(material_ui_2.CardText, { style: { padding: '8px' } }, this.state.text)))));
    };
    return Application;
}(React.Component));
var About = function () { return (React.createElement("div", null, "hello world")); };
var App = function () { return (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(Application, null))); };
ReactDOM.render(React.createElement(App, null), document.getElementById('app'));
//# sourceMappingURL=index.js.map