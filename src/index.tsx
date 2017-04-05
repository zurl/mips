/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 2017/3/8
 */
import * as injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import {Editor} from "./editor";

const electron = eval(`require('electron')`);
import {Paper} from "material-ui/Paper";
import {Card} from "material-ui";
import {CardHeader} from "material-ui";
import {CardMedia} from "material-ui";
import {CardTitle} from "material-ui";
import {CardText} from "material-ui";
import {CardActions} from "material-ui";
import {FlatButton} from "material-ui";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import {MenuItem} from "material-ui/Menu";
import MoreVertIcon from 'material-ui/svg-icons/navigation/menu';

import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import Component = React.Component;
import {NavigationClose} from "material-ui/svg-icons";
import {white} from "material-ui/styles/colors";
import RaisedButton from "material-ui/RaisedButton";
import Drawer from "material-ui/Drawer";
import {List} from "material-ui";
import {ListItem} from "material-ui";
import {Checkbox} from "material-ui";
import {Table} from "material-ui";
import {TableHeader} from "material-ui";
import {TableRow} from "material-ui";
import {TableHeaderColumn} from "material-ui";
import {TableBody} from "material-ui";
import {TableRowColumn} from "material-ui";
import {assemble, getAsmViewData, runline, getRegisterInfo, initvm, decodeCOE, decodeBIN} from "./api";
import {CircularProgress} from "material-ui";
import {Toolbar} from "material-ui";
import {ToolbarGroup} from "material-ui";
import {DropDownMenu} from "material-ui";
import {ToolbarTitle} from "material-ui";
import {FontIcon} from "material-ui";
import {ToolbarSeparator} from "material-ui";
import {TextField} from "material-ui";

import KeyBoardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import KeyBoardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
//const dialog = {};
//const fs = {};
const dialog = electron.remote.dialog;
const fs = eval(`require('fs')`);

function addFrontZero(str: string){
    str ='000000000000'+str;
    return str.substring(str.length-8,str.length);
}
class UtilMenu extends Component<any, any>{
    static muiName = 'IconMenu';

    constructor(props){
        super(props);
    }

    open = (mode) => () => {
        if(this.props.filePath){
            this.close();
        }
        let path = dialog.showOpenDialog({properties: ['openFile']});
        if(path.length == 0)return;
        this.props.setFilePath(path[0]);
        if( mode == 'asm'){
            window["codeStorage_t"] = fs.readFileSync(path[0],"utf-8");
            this.props.refreshView();
         }
         else if(mode == "coe"){

            const tt = fs.readFileSync(path[0],"utf-8");
            window["codeStorage_t"] = decodeCOE(tt);
            this.props.refreshView();
            path+=".asm";
        }
        else if(mode == "bin"){
            const tt = fs.readFileSync(path[0],null);
            window["codeStorage_t"] = decodeBIN(tt);
            this.props.refreshView();
            path+=".asm";
        }

    };

    saveThis = ()=>{
        window["codeStorage"] = window["editor"].getValue();
        fs.writeFileSync(this.props.filePath,window["codeStorage"], "utf8")
    };

    save = (mode) => () => {
        const path = dialog.showSaveDialog();
        if(!path)return;
        if( mode == 'asm'){
            //window["codeStorage"] = window["editor"].getValue();
            fs.writeFileSync(path,window["editor"].getValue(), "utf8")
        }
        else if(mode == 'bin'){
            const assemblyData = assemble(window["editor"].getValue());
            fs.writeFileSync(path,new Uint8Array(assemblyData.buffer.slice(0, 1024)), "utf8");
        }
        else if(mode == 'coe'){
            //window["codeStorage_r"] = window["editor"].getValue();
            const assemblyData = assemble(window["editor"].getValue());
            let coe = "memory_initialization_radix=16;\n"+
                "memory_initializaton_vector=";
            for(let i = 0; i < 256; i++){
                if(i != 0)coe += ',';
                const v = assemblyData.getUint32(i * 4);
                coe += addFrontZero(v.toString(16));
            }
            coe +=';\n';
            fs.writeFileSync(path,coe, "utf8");
        }

    };

    create = ()=>{
        if(this.props.filePath){
            this.close();
        }
        const path = dialog.showSaveDialog();
        if(!path)return;
        this.props.setFilePath(path);
        this.props.onCreate(path);
    };

    onSave = ()=>{
        window["codeStorage"] = window["editor"].getValue();
        fs.writeFileSync(this.props.filePath,window["codeStorage"], "utf8")
    };

    close = ()=>{
        this.props.setFilePath(null);
        window["codeStorage"] = '';
        window["editor"].setValue('');
        this.props.onClose('');
    };

    render(){
        const apped = [<MenuItem primaryText="Save File" onClick={this.onSave}/>,
        <MenuItem primaryText="Save as Asm" onClick={this.save('asm')}/>,
        <MenuItem primaryText="Save as Bin" onClick={this.save('bin')}/>,
        <MenuItem primaryText="Save as Coe" onClick={this.save('coe')}/>,
            <MenuItem primaryText="Close File" onClick={this.close}/>];
        return (
            <IconMenu
                iconButtonElement={
                      <IconButton><MoreVertIcon color={white} /></IconButton>
                    }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
                <MenuItem primaryText="New File" onClick={this.create}/>
                <MenuItem primaryText="Open Asm" onClick={this.open('asm')} />
                <MenuItem primaryText="Open Bin" onClick={this.open('bin')}/>
                <MenuItem primaryText="Open Coe" onClick={this.open('coe')}/>
                {
                    this.props.filePath ? apped : []
                }
                </IconMenu>
        )
    }
}

const NarrowColumn = {
    width : '8px',
    height : '36px'
};


const Narrow2Column = {
    width : '78px',
    height : '36px',
    fontFamily: 'monospace'
};

const NarrowRow = {
    height : '36px'
};

const NormalColumn = {
    height : '36px',
    paddingLeft: '8px',
    paddingRight: '8px',
    fontFamily: 'monospace'
};

class ResultView extends React.Component<any,{}>{


    render(){
        return(
            this.props.data == null ?
                <div style={{display: 'flex',height: '70%', minHeight: '70%', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress size={80} thickness={5}/>
                </div>:
                <div style={{display: 'flex',height: '70%', minHeight: '70%', justifyContent: 'center', alignItems: 'center'}}>
                    < MachineCodeView data={this.props.data}/>
                    < DebuggerView register={this.props.register} />
                </div>
        )
    }
}


export class DebuggerView extends React.Component<any,any>{


    constructor(props){
        super(props);
        this.state={
            page: 0
        }
    }

    handlePage = ()=>{
        this.setState({
            page : this.state.page == 0 ? 1: 0
        })
    };


    render(){
        const registerView = [];
        for(let i = 0 ; i < 18;i++){
            const x = this.props.register[this.state.page == 0 ? i:i+18];
            if(!x)break;
            registerView.push(
                <li>{x[0]} : {x[1]}</li>
            )
        }
        return (
            <div style={{minWidth: '200px', overflowY: 'auto'}}>
                <RaisedButton onClick={this.handlePage} label="Switch" primary={true} />
                <Card style={{overflowY: 'auto'}}>
                    <CardText >
                        <ul>{registerView}</ul>
                    </CardText>
                </Card>
            </div>
        )
    }
}

class MachineCodeView extends React.Component<any, any>{
    static PAGE_SIZE = 64;

    constructor(props){
        super(props);
        this.state = {
            current: 0,
            pc: 0
        }
    }

    componentDidMount(){
        const that = this;
        // force update
        window["updateMachineCode"] = (pc)=>{
            that.setState({
                pc : pc
            });
        }
    }

    handleGoto = ()=>{
        this.setState({
            current : document.getElementById("addr-line")["value"]
        })
    };

    handleLeft = ()=>{
        if(this.state.current > 0){
            this.setState({
                current: this.state.current - MachineCodeView.PAGE_SIZE
            })
        }
    };

    handleRight = ()=>{
        if(this.state.current < 1024 * 1024 / 4 - MachineCodeView.PAGE_SIZE * 2){
            this.setState({
                current: this.state.current + MachineCodeView.PAGE_SIZE
            })
        }
    };


    render(){
        const items = [];
        for(let i = 0; i < MachineCodeView.PAGE_SIZE * 2; i++) {
            if( i >= this.props.data.length)break;
            const item = getAsmViewData(this.props.data,(i + this.state.current));
            items.push(
                <TableRow style={NarrowRow} key={i}>
                    <TableRowColumn style={NarrowColumn}>{ (i + this.state.current) * 4 == this.state.pc ?  '*' : ' '}</TableRowColumn>
                    <TableRowColumn style={Narrow2Column}>{ item[0] }</TableRowColumn>
                    <TableRowColumn style={Narrow2Column}>{ item[1] }</TableRowColumn>
                    <TableRowColumn style={Narrow2Column}>{ item[3]?`LABEL_${(i + this.state.current)}:`:'' }</TableRowColumn>
                    <TableRowColumn style={NormalColumn}>{ item[2]}</TableRowColumn>
                </TableRow>
            );
        }
        return (
            <div style={{height: '100%', flexGrow: 1, display: 'flex',flexDirection: 'column'}}>
                <Toolbar>
                    <ToolbarGroup firstChild={true} style={{marginLeft: "0px"}}>
                        <TextField hintText="Line Address" id="addr-line"/>
                        <RaisedButton onClick={this.handleGoto} label="Goto" primary={true} />
                    </ToolbarGroup>
                    <ToolbarGroup lastChild={true}>
                        <ToolbarSeparator />
                        <IconButton onClick={this.handleLeft} touch={true} tooltipPosition="bottom-right">
                            <KeyBoardArrowLeft />
                        </IconButton>
                        <IconButton onClick={this.handleRight} touch={true} tooltipPosition="bottom-right">
                            <KeyBoardArrowRight />
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>
                <Table
                    selectable={true}
                    multiSelectable={true}
                    wrapperStyle={{display: 'flex',flexDirection: 'column',height: '100%'}}
                >
                    <TableHeader displaySelectAll={false}>
                        <TableRow style={NarrowRow}>
                            <TableHeaderColumn style={Narrow2Column}>Address</TableHeaderColumn>
                            <TableHeaderColumn style={Narrow2Column}>Machine Code</TableHeaderColumn>
                            <TableHeaderColumn style={Narrow2Column}>Flag</TableHeaderColumn>
                            <TableHeaderColumn style={NormalColumn}>Assembly</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody style={{overflowY: 'auto'}} displayRowCheckbox={false}>
                        {items}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

//

class Application extends React.Component<any, any>{

    constructor(props){
        super(props);
        this.state = {
            text: [],
            onResultView: false,
            noFile: true,
            assemblyResult: null,
            register: getRegisterInfo(),
            filePath: null,
        };
    }


    componentDidMount(){
        const that = this;
        window["logger"] = {
            log : ( text )=>{
                that.setState({
                    text : that.state.text.concat([<p className="console-text">{text}</p>])
                })
            }
        };
        window["logger"].log(`ASmart MIPS Assembler v0.0.1`);
    }



    runLine = ()=>{
        runline(()=>{
            const reg =getRegisterInfo();
            this.setState({
                register : reg
            });
            window["updateMachineCode"](
                reg[32][1]
            );
        });
    };

    handleChangeView = ()=>{
        if(window["readOnly"])return;
        if( this.state.onResultView){
            this.setState( {onResultView: false });
        }
        else{
            window["codeStorage"] = window["editor"].getValue();
            this.setState( {
                onResultView: true,
                assemblyData: null
            });
            const that = this;
            setTimeout(()=>{
                const assemblyData = assemble(window["editor"].getValue());
                initvm(assemblyData);
                that.setState( {
                    assemblyData: assemblyData
                });
            },500);
        }
    };

    updateView = (mode)=> () =>{
        if( mode = 'asm'){
            if( this.state.onResultView){
                this.setState( {onResultView: false });
                console.log('shit');
            }
            window["editor"].setValue(window["codeStorage_t"])
        }
        this.handleCreate('');
        //window["codeStorage"] = window["codeStorage_t"];
    };

    handleCreate = (path) => {
        window["readOnly"] = false;
        window["editor"].setReadOnly(false);
    };

    handleClose = (path)=>{
        window["readOnly"] = true;
        window["editor"].setReadOnly(true);
    };

    setFilePath = (path)=>{
        this.setState({filePath: path});
    }

    render(){
        return (
            <div style={{overflow: 'hidden', height: "100%", display: 'flex', flexDirection: 'column'}}>
                <AppBar
                    style={{minHeight: '64px'}}
                    title="ASmart"
                    iconElementLeft={
                        this.state.onResultView ?
                        <IconButton onClick={this.handleChangeView}><ArrowBackIcon color={white} /></IconButton>

                        :<UtilMenu
                            filePath={this.state.filePath}
                            setFilePath={this.setFilePath}
                            onCreate={this.handleCreate}
                            onClose={this.handleClose}
                            refreshView={this.updateView('asm')}/>
                    }
                    iconStyleRight={{ margin: 'auto'}}
                    iconElementRight={
                    this.state.onResultView ?
                        <div>
                            <FlatButton style={{color: 'white'}} onClick={this.runLine} label="RunLine"  />
                        </div>
                    : <div style={{display: 'flex', alignItems: 'center'}}>
                           <FlatButton style={{color: 'white'}} label="Assemble" onClick={this.handleChangeView}/>
                    </div>
                    }

                />
                {
                    (!this.state.onResultView) ?
                        <Editor/> :
                        <ResultView register={this.state.register} data={this.state.assemblyData}/>
                }
                <div
                    style={{flexGrow: 1, flexDirection: 'column', display: 'flex', padding: '10px'}}>
                    <Card containerStyle={{padding: '0px'}} style={{overflowY: 'auto',flexGrow: 1 }}>
                        <CardText style={{padding: '8px'}}>
                            {this.state.text}
                        </CardText>
                    </Card>
                </div>
            </div>
        )
    }
}

const About = ()=>(
    <div>
        hello world
    </div>
);

const App = () => (
    <MuiThemeProvider>
        <Application />
    </MuiThemeProvider>
);

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
