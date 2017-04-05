import {MIPSAssembler} from "./backend/assembler/assembler";
import {disassmble, registerTable} from "./backend/assembler/disassmbler";
import {MIPSVM} from "./backend/assembler/fastvm";
import {WebOS} from "./backend/webos";
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 2017/3/9
 */

function addFrontZero(str: string){
    str ='000000000000'+str;
    return str.substring(str.length-8,str.length);
}

let assembler = new MIPSAssembler();
let vm = new MIPSVM(new WebOS());

let disdata = [];
let ctx = [];
export function assemble(text){
    assembler = new MIPSAssembler();
    vm = new MIPSVM(new WebOS());
    console.log(text);
    const ret = assembler.parse(text);
    const memory = assembler.__program;
    disdata=[];ctx=[];
    for(let i =0; i < 1024;i ++){
        const x = memory.getUint32(i * 4);
        disdata.push([
            addFrontZero((i * 4).toString(16)),
            addFrontZero(x.toString(16)),
            disassmble(x, ctx, i )
        ])
    }
    return ret;
}
export function decodeBIN(file){
    console.log(file);
    const tmp = [];
    for(let i = 0; i < 1024 / 4; i++){
        console.log(file.readUInt32BE(i*4).toString(16));
        tmp[i] = disassmble(file.readUInt32BE(i*4), ctx, i);
    }
    let ret = "";
    for(let i = 0; i < 256; i++){
        if(ctx[i]) ret+= `LABEL_${i}: `;
        ret+=tmp[i] + "\n";
    }
    return ret;
}
export function decodeCOE(file){
    const arr = file.split('=')[2].split(/\s*,\s*/).map(x=>parseInt(x,16));
    const tmp = [];
    for(let i = 0; i < 1024 / 4; i++){
        tmp[i] = disassmble(arr[i], ctx, i);
    }
    let ret = "";
    for(let i = 0; i < 256; i++){
        if(ctx[i]) ret+= `LABEL_${i}: `;
        ret+=tmp[i] + "\n";
    }
    return ret;
}

export function getAsmViewData(memory, i){
    if(i > 1024)return [];
    return disdata[i].concat(ctx[i]);
}

export function initvm(memory){
    vm.cleanup();
    vm.setMemory(memory);
    window["vm"] = vm;
}

export function runline(cb){
    vm.runLine(cb);
}

export function getRegisterInfo(){
    let result = [];
    for(let i = 0; i < 35; i ++){
        result.push([
            registerTable.get(i),
            vm.register.getUint32(i * 4)
        ]);
    }
    return result;
}