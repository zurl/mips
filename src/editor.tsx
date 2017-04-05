/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 2017/3/8
 */

import * as React from 'react';
window["codeStorage"] = '';
window["readOnly"] = true;
export class Editor extends React.Component<any, any>{
    componentDidMount(){
        console.log('mounted');
        window["editor"] = window["ace"].edit("editor");
        window["editor"] .getSession().setMode("ace/mode/assembly_x86");
        window["editor"].setTheme("ace/theme/tomorrow");
        if(window["readOnly"]){
            window["editor"].setReadOnly(true);
        }
        else{
            window["editor"].setReadOnly(false);
        }
    }
    render(){
        console.log('r1');
        console.log('r2');
        return (
            <div id="editor">
                {window["codeStorage"]}
            </div>
        )
    }
}