"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 2017/3/8
 */
const injectTapEventPlugin = require("react-tap-event-plugin");
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
const React = require("react");
const ReactDOM = require("react-dom");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const AppBar_1 = require("material-ui/AppBar");
const editor_1 = require("./editor");
const material_ui_1 = require("material-ui");
const material_ui_2 = require("material-ui");
const material_ui_3 = require("material-ui");
const IconMenu_1 = require("material-ui/IconMenu");
const IconButton_1 = require("material-ui/IconButton");
const Menu_1 = require("material-ui/Menu");
const more_vert_1 = require("material-ui/svg-icons/navigation/more-vert");
var Component = React.Component;
const colors_1 = require("material-ui/styles/colors");
const RaisedButton_1 = require("material-ui/RaisedButton");
const material_ui_4 = require("material-ui");
const material_ui_5 = require("material-ui");
const material_ui_6 = require("material-ui");
const material_ui_7 = require("material-ui");
const material_ui_8 = require("material-ui");
const material_ui_9 = require("material-ui");
const api_1 = require("./api");
const material_ui_10 = require("material-ui");
const material_ui_11 = require("material-ui");
const material_ui_12 = require("material-ui");
const material_ui_13 = require("material-ui");
const material_ui_14 = require("material-ui");
const keyboard_arrow_left_1 = require("material-ui/svg-icons/hardware/keyboard-arrow-left");
const keyboard_arrow_right_1 = require("material-ui/svg-icons/hardware/keyboard-arrow-right");
class UtilMenu extends Component {
    render() {
        return (React.createElement(IconMenu_1.default, { iconButtonElement: React.createElement(IconButton_1.default, null,
                React.createElement(more_vert_1.default, { color: colors_1.white })), targetOrigin: { horizontal: 'right', vertical: 'top' }, anchorOrigin: { horizontal: 'right', vertical: 'top' } },
            React.createElement(Menu_1.MenuItem, { primaryText: "Refresh" }),
            React.createElement(Menu_1.MenuItem, { primaryText: "Help" }),
            React.createElement(Menu_1.MenuItem, { primaryText: "Sign out" })));
    }
}
UtilMenu.muiName = 'IconMenu';
const NarrowColumn = {
    width: '8px',
    height: '36px'
};
const NarrowRow = {
    height: '36px'
};
const NormalColumn = {
    height: '36px',
    paddingLeft: '8px',
    paddingRight: '8px'
};
class ResultView extends React.Component {
    render() {
        return (this.props.data == null ?
            React.createElement("div", { style: { display: 'flex', height: '70%', minHeight: '70%', justifyContent: 'center', alignItems: 'center' } },
                React.createElement(material_ui_10.CircularProgress, { size: 80, thickness: 5 })) :
            React.createElement("div", { style: { display: 'flex', height: '70%', minHeight: '70%', justifyContent: 'center', alignItems: 'center' } },
                React.createElement(MachineCodeView, { data: this.props.data }),
                React.createElement(DebuggerView, null)));
    }
}
class DebuggerView extends React.Component {
    constructor(props) {
        super(props);
        this.runLine = () => {
            api_1.runline();
            this.setState({
                register: api_1.getRegisterInfo()
            });
            window["updateMachineCode"](this.state.register[32][1]);
        };
        this.state = {
            register: []
        };
    }
    render() {
        const registerView = [];
        for (let x of this.state.register) {
            registerView.push(React.createElement("li", null,
                x[0],
                " : ",
                x[1]));
        }
        return (React.createElement("div", { style: { minWidth: '200px', overflowY: 'auto' } },
            React.createElement(material_ui_1.Card, { style: { overflowY: 'auto' } },
                React.createElement(material_ui_2.CardText, null,
                    React.createElement(RaisedButton_1.default, { onClick: this.runLine, label: "RunLine", primary: true }),
                    React.createElement("ul", null, registerView)))));
    }
}
exports.DebuggerView = DebuggerView;
class MachineCodeView extends React.Component {
    constructor(props) {
        super(props);
        this.handleGoto = () => {
            this.setState({
                current: document.getElementById("addr-line")["value"]
            });
        };
        this.handleLeft = () => {
            if (this.state.current > 0) {
                this.setState({
                    current: this.state.current - MachineCodeView.PAGE_SIZE
                });
            }
        };
        this.handleRight = () => {
            if (this.state.current < 1024 * 1024 / 4 - MachineCodeView.PAGE_SIZE * 2) {
                this.setState({
                    current: this.state.current + MachineCodeView.PAGE_SIZE
                });
            }
        };
        this.state = {
            current: 0,
            pc: 0
        };
    }
    componentDidMount() {
        const that = this;
        // force update
        window["updateMachineCode"] = (pc) => {
            that.setState({
                pc: pc
            });
        };
    }
    render() {
        const items = [];
        for (let i = 0; i < MachineCodeView.PAGE_SIZE * 2; i++) {
            if (i >= this.props.data.length)
                break;
            const item = api_1.getAsmViewData(this.props.data, (i + this.state.current) * 4);
            items.push(React.createElement(material_ui_6.TableRow, { style: NarrowRow, key: i },
                React.createElement(material_ui_9.TableRowColumn, { style: NarrowColumn }, (i + this.state.current) * 4 == this.state.pc ? '*' : ' '),
                React.createElement(material_ui_9.TableRowColumn, { style: NormalColumn }, item[0]),
                React.createElement(material_ui_9.TableRowColumn, { style: NormalColumn }, item[1]),
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
                        React.createElement(material_ui_7.TableHeaderColumn, { style: NarrowColumn }, "Status"),
                        "9    ",
                        React.createElement(material_ui_7.TableHeaderColumn, { style: NormalColumn }, "Address"),
                        React.createElement(material_ui_7.TableHeaderColumn, { style: NormalColumn }, "Machine Code"),
                        React.createElement(material_ui_7.TableHeaderColumn, { style: NormalColumn }, "Assembly"))),
                React.createElement(material_ui_8.TableBody, { style: { overflowY: 'auto' }, displayRowCheckbox: false }, items))));
    }
}
MachineCodeView.PAGE_SIZE = 64;
const electron = require("./electron.js");
const dialog = electron.dialog;
console.log(dialog.showOpenDialog({ properties: ['openFile'] }));
class Application extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeView = () => {
            if (this.state.onResultView) {
                this.setState({ onResultView: false });
            }
            else {
                this.setState({
                    onResultView: true,
                    assemblyData: null
                });
                const that = this;
                window["codeStorage"] = window["editor"].getValue();
                setTimeout(() => {
                    const assemblyData = api_1.assemble(window["editor"].getValue());
                    api_1.initvm(assemblyData);
                    that.setState({
                        assemblyData: assemblyData
                    });
                }, 500);
            }
        };
        this.state = {
            text: [],
            onResultView: false,
            assemblyResult: null
        };
    }
    updateView() {
    }
    componentDidMount() {
        const that = this;
        window["logger"] = {
            log: (text) => {
                that.setState({
                    text: that.state.text.concat([React.createElement("p", { className: "console-text" }, text)])
                });
            }
        };
        window["logger"].log(`ASmart MIPS Assembler v0.0.1`);
    }
    render() {
        return (React.createElement("div", { style: { overflow: 'hidden', height: "100%", display: 'flex', flexDirection: 'column' } },
            React.createElement(AppBar_1.default, { style: { minHeight: '64px' }, title: "ASmart", iconElementRight: React.createElement("div", { style: { display: 'flex', alignItems: 'center' } },
                    React.createElement(material_ui_3.FlatButton, { style: { color: 'white' }, label: "Assemble", onClick: this.handleChangeView }),
                    React.createElement(UtilMenu, null)) }),
            (!this.state.onResultView) ? React.createElement(editor_1.Editor, null) : React.createElement(ResultView, { data: this.state.assemblyData }),
            React.createElement("div", { style: { flexGrow: 1, flexDirection: 'column', display: 'flex', padding: '10px' } },
                React.createElement(material_ui_1.Card, { containerStyle: { padding: '0px' }, style: { overflowY: 'auto', flexGrow: 1 } },
                    React.createElement(material_ui_2.CardText, { style: { padding: '8px' } }, this.state.text)))));
    }
}
const About = () => (React.createElement("div", null, "hello world"));
const App = () => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(Application, null)));
ReactDOM.render(React.createElement(App, null), document.getElementById('app'));
//# sourceMappingURL=index.js.map