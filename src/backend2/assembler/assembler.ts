/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 10/30/2016
 */
import {
    buildAsmInstructionRRR, buildAsmInstructionRRN, buildAsmInstructionRN, buildAsmInstructionN,
    buildAsmInstructionR, buildAsmInstructionRR
} from "./instruction";
import {buildAsm} from "./ins";
function isArray(arr){
    return Object.prototype.toString.call(arr) === "[object Array]";
}

function convertStrToArray( str: string ){
    const result = [];
    for(let i = 1; i < str.length - 2; i++){
        result.push( str.charCodeAt(i))
    }
    return result;
}

export class MIPSAssembler{
    __resolvedLabelSet : any;
    __unresolvedLabelSet : any;
    __now : number;
    __programBuffer : ArrayBuffer;
    __program : DataView;
    __hashString = (str: string, delta: boolean = true):number=>{
        if( !isNaN(parseInt(str))) return parseInt(str);
        if(this.__resolvedLabelSet.hasOwnProperty(str)){
            if( delta ) return (this.__resolvedLabelSet[str] - this.__now)/4 - 1;
            else return this.__resolvedLabelSet[str] / 4;
        }else{
            if(this.__unresolvedLabelSet.hasOwnProperty(str))this.__unresolvedLabelSet[str].push(this.__now );
            else this.__unresolvedLabelSet[str] = [this.__now ];
            return 0;
        }
    };

    __resolveLabel( label : string ){
        this.__resolvedLabelSet[label] = this.__now;
        if(this.__unresolvedLabelSet.hasOwnProperty(label)){
            this.__unresolvedLabelSet[label].forEach(line=>{
                if((this.__program.getInt32(line) & 0xFC000000) == 0x8000000// jmp
                    || (this.__program.getInt32(line) & 0xFC000000) == 0xc000000){ // jal
                    this.__program.setInt32(line, this.__program.getInt32(line) | ((this.__now / 4) & 0x03FFFFFF));
                }else{
                    this.__program.setInt16(line + 2, (this.__now - line) / 4 - 1);
                }
            });
        }
    }

    __buildData( arr: string[] ){
        if( /dd|db|dw/.test(arr[1]) ){
            const data = arr[2].split(/\s*,\s*/);
            for( let i = 0; i < data.length; i++){
                if(!isNaN(parseInt(data[i]))){
                    if(arr[1] == 'dd') {
                        this.__program.setUint32(this.__now, parseInt(data[i]));
                        this.__now += 4;
                    }
                    else if( arr[1] == 'dw') {
                        this.__program.setUint16(this.__now, parseInt(data[i]));
                        this.__now += 2;
                    }
                    else{
                        this.__program.setUint8(this.__now, parseInt(data[i]));
                        this.__now += 1;
                    }
                }
                else if(/^'.*'$/.test(data[i])){
                    const arr = convertStrToArray(data[i]);
                    for( let item of arr ){
                        this.__program.setUint8(this.__now, item);
                        this.__now += 1;
                    }
                }
                else return false; // failed
            }
            return true;
        }
        else if(!isNaN(parseInt(arr[1]))){
            this.__now += parseInt(arr[1]);
        }
        return false; // failed
    }

    __buildIns( arr: string[] ){
        if(arr[5] && arr[3] =="")arr[3] = "0"; //trick;
        if( arr[3] ){
            if( arr[4] ){
                if( arr[4].charAt(0) == '$' ){          // add $t1, $t2, $t3
                    return buildAsm(arr[1],arr[2],arr[3],arr[4]);
                }
                else if( !isNaN(parseInt(arr[4])) ) {   // addi $t1, $t2, -1
                    return buildAsm(arr[1],arr[2],arr[3],parseInt(arr[4]));
                }
                else{                                   // beq $t1, $t2, flag
                    return buildAsm(arr[1],arr[2],arr[3],this.__hashString(arr[4]));
                }
            }
            else if( arr[5] ){// lb $t1,-16($t2)
                return buildAsm(arr[1],arr[2],parseInt(arr[3]),arr[5]);
            }
            else if(arr[3].charAt(0) == '$'){           // div $t1, $t2
                return buildAsm(arr[1],arr[2],arr[3], null);
            }
            else if( !isNaN(parseInt(arr[3])) ) {       // lui $t1, 1
                return buildAsm(arr[1],arr[2],parseInt(arr[3]), null);
            }
            else{                                       // blez $t1,flag
                return buildAsm(arr[1],arr[2],this.__hashString(arr[3]), null);
            }
        }
        else if(arr[2].charAt(0) == '$'){               // mfhi $t1
            return buildAsm(arr[1],arr[2], null, null);
        }
        else{                                           //  j flag
            return buildAsm(arr[1], (this.__hashString(arr[2], false)) & 0x03FFFFFF, null, null);
        }
    }

    parse(source: string){
        window["woc"] = source;
        const code = source.toLowerCase().split('\n');
        this.__now = 0;
        for(let index = 0 ; index < code.length; index++){
            let ins = code[index];
            ins = ins.replace(/((#)|(\/\/)).*/g, "");
            const labelResult = /^\s*([a-z0-9_]+)\s*:/.exec(ins);
            if( labelResult ){
                ins = ins.replace(/^\s*([a-z0-9_]+)\s*:/, "");
                if( (labelResult[1] == "baseaddre" || labelResult[1] == "dataaddre")
                    && /^\s*[0-9a-f]+\s*;\s*$/.test(ins)){
                    const address = parseInt(ins, 16);
                    if(isNaN(address))console.log(`failed at ${ index }`);
                    else if(address < this.__now)console.log(`failed at ${ index } : illegal address`);
                    else this.__now = address;
                    continue;
                }
                this.__resolveLabel(labelResult[1]);
            }
            const dataResult = /^\s*(dd|dw|db|resb|resw|resd)\s*(.+\s*);?\s*$/.exec(ins);
            if( dataResult && this.__buildData(dataResult)) continue;
            const insResult = /^\s*([a-z]+)\s+([$a-z0-9_-]+)\s*(?:,\s*([$a-z0-9_-]*)\s*(?:(?:,\s*([$a-z0-9_-]+)\s*)|(?:\(\s*([$a-z0-9_-]+)\s*\)))?)?;?\s*$/.exec(ins);
            if( insResult ){
                console.log(insResult);
                try {
                    const ret = this.__buildIns(insResult);
                    if (!isArray(ret)) {
                        this.__program.setUint32(this.__now, ret as number);
                        this.__now += 4;
                        continue;
                    } else {
                        ret["forEach"]((x) => {
                            this.__program.setUint32(this.__now, x);
                            this.__now += 4;
                        });
                        continue;
                    }
                }catch(e){
                    window["logger"].log(`failed at ${ index } : ${ins}`);
                    console.log(`failed at ${ index }`);
                    continue;
                }
            }
            if(/^\s*syscall\s*;?\s*$/.test(ins)){
                this.__program.setUint32(this.__now, 0xc);
                this.__now += 4;
                continue;
            }else if(/^\s*nop\s*;?\s*$/.test(ins)) {
                this.__program.setUint32(this.__now, 0x0);
                this.__now += 4;
                continue;
            }
            if(/\S/.test(ins)){
                window["logger"].log(`failed at ${ index } : ${ins}`);
                console.log(`failed at ${ index }`)
            }
        }
        return this.__program;
    }


    constructor( memorySize: number = 1024 * 1024 ){// 1MB for default
        this.__programBuffer = new ArrayBuffer(memorySize);
        this.__program = new DataView(this.__programBuffer);
        this.__resolvedLabelSet = {};
        this.__unresolvedLabelSet = {};
    }
}