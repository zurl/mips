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
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
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
import {assemble, getAsmViewData, runline, getRegisterInfo, initvm} from "./api";
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

class UtilMenu extends Component<any, {}>{
    static muiName = 'IconMenu';

    render(){
        return (
            <IconMenu
                iconButtonElement={
                      <IconButton><MoreVertIcon color={white} /></IconButton>
                    }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
                <MenuItem primaryText="Refresh" />
                <MenuItem primaryText="Help" />
                <MenuItem primaryText="Sign out" />
            </IconMenu>
        )
    }
}

const NarrowColumn = {
    width : '8px',
    height : '36px'
};

const NarrowRow = {
    height : '36px'
};

const NormalColumn = {
    height : '36px',
    paddingLeft: '8px',
    paddingRight: '8px'
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
                    < DebuggerView />
                </div>
        )
    }
}


export class DebuggerView extends React.Component<any,any>{

    constructor(props){
        super(props);
        this.state = {
            register : []
        };
    }

    runLine = ()=>{
        runline();
        this.setState({
            register : getRegisterInfo()
        });
        window["updateMachineCode"](
            this.state.register[32][1]
        );
    }

    render(){
        const registerView = [];
        for(let x of this.state.register){
            registerView.push(
                <li>{x[0]} : {x[1]}</li>
            )
        }
        return (
            <div style={{minWidth: '200px', overflowY: 'auto'}}>
                <Card style={{overflowY: 'auto'}}>
                    <CardText >
                        <RaisedButton onClick={this.runLine} label="RunLine" primary={true} />
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
            const item = getAsmViewData(this.props.data,(i + this.state.current) * 4);
            items.push(
                <TableRow style={NarrowRow} key={i}>
                    <TableRowColumn style={NarrowColumn}>{ (i + this.state.current) * 4 == this.state.pc ?  '*' : ' '}</TableRowColumn>
                    <TableRowColumn style={NormalColumn}>{ item[0] }</TableRowColumn>
                    <TableRowColumn style={NormalColumn}>{ item[1] }</TableRowColumn>
                    <TableRowColumn style={NormalColumn}>{ item[2] }</TableRowColumn>
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
                            <TableHeaderColumn style={NarrowColumn}>Status</TableHeaderColumn>
                           9    <TableHeaderColumn style={NormalColumn}>Address</TableHeaderColumn>
                            <TableHeaderColumn style={NormalColumn}>Machine Code</TableHeaderColumn>
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

class Application extends React.Component<any, any>{

    constructor(props){
        super(props);
        this.state = {
            text: [],
            onResultView: false,
            assemblyResult: null
        };
    }

    updateView(){
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

    handleChangeView = ()=>{
        if( this.state.onResultView){
            this.setState( {onResultView: false });
        }
        else{
            this.setState( {
                onResultView: true,
                assemblyData: null
            });
            const that = this;
            window["codeStorage"] = window["editor"].getValue();
            setTimeout(()=>{
                const assemblyData = assemble(window["editor"].getValue());
                initvm(assemblyData);
                that.setState( {
                    assemblyData: assemblyData
                });
            },500);
        }
    };

    render(){
        return (
            <div style={{overflow: 'hidden', height: "100%", display: 'flex', flexDirection: 'column'}}>
                <AppBar
                    style={{minHeight: '64px'}}
                    title="ASmart"
                    iconElementRight={
                    <div style={{display: 'flex', alignItems: 'center'}}>
                           <FlatButton style={{color: 'white'}} label="Assemble" onClick={this.handleChangeView}/>
                           <UtilMenu />
                    </div>
                }

                />
                {
                    (!this.state.onResultView) ? <Editor /> : <ResultView data={this.state.assemblyData}/>
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
