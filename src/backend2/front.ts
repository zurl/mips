/*
import {MIPSAssembler} from "./assembler/assembler";
import {disassmble} from "./assembler/disassmbler";
import {MIPSVM} from "./assembler/fastvm";
import Vue from 'vue'
import {WebOS} from "./webos";


window["editor"] = window["ace"].edit("editor");
window["editor"] .getSession().setMode("ace/mode/assembly_x86");
window["editor"].setTheme("ace/theme/tomorrow");
function addFrontZero(str: string){
    str ='000000000000'+str;
    return str.substring(str.length-8,str.length);
}

const asmer = new MIPSAssembler();
const vm = new MIPSVM(new WebOS());

let program;

var app = new Vue({
    el: '#app',
    data: {
        info :[],
        vm: vm.getInfo(),
        pc: 0,
        message: 'You loaded this page on ' + new Date()
    },
    methods :{
        addFrontZero : addFrontZero,
        compile(){
            const cmd = window["editor"].getValue();
            program = asmer.parse(cmd);
            vm.setMemory(program);
            const ret = [];
            for (let i = 0; i <= 50; i++) {
                let x = program.getUint32(i * 4);
                ret[i] = [
                    addFrontZero((i * 4).toString(16)),
                    addFrontZero(x.toString(16)),
                    disassmble(x)
                ];
            }
            this["info"] = ret;
            vm.cleanup();
        },
        runLine(){
            vm.runLine();
            this["vm"] = vm.getInfo();
            this["pc"] = vm.PC;
        },
        run(){
            vm.run(40 * 4);
            this["vm"] = vm.getInfo();
            this["pc"] = vm.PC;
        }
    },
    template : `
    <div class="flex">
        <div  style="padding-right: 20px">
            <button @click="compile()"> compile</button>
            <button @click="runLine()"> runLine</button>
            <button @click="run()"> run</button>
            <div class="flex">
            
            <ul >
                <div> PC </div>
              <li v-for="item in vm">
                {{ item[0]  }}
              </li>
            </ul>
            <ul >
                <div> {{pc}}</div>
              <li v-for="item in vm">
                {{ addFrontZero(item[1]) }}
              </li>
            </ul>
            </div>
        </div>
        <div> 
            <ul >
              <li v-for="item in info">
                       <span v-if="parseInt(item[0],16) == pc"> *</span>
                    {{item[0]}}:{{item[1]}}:{{item[2]}}
              </li>
            </ul>
        </div>
    </div>
    `
});
*/



