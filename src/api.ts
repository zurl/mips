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

const assembler = new MIPSAssembler();
const vm = new MIPSVM(new WebOS());

export function assemble(text){
    return assembler.parse(text);
}

export function getAsmViewData(memory, i){
    const x = memory.getUint32(i);
    return [
            addFrontZero((i).toString(16)),
            addFrontZero(x.toString(16)),
            disassmble(x)
    ];
}

export function initvm(memory){
    vm.cleanup();
    vm.setMemory(memory);
    window["vm"] = vm;
}

export function runline(){
    vm.runLine();
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