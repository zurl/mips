import { Register } from "./assembler/instruction";
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 2017/3/4
 */
export class WebOS {
    syscall(that, next_task) {
        const code = that.register.getUint32(Register["v0"] * 4);
        switch (code) {
            case 0x1:
                console.log(Register["a0"]);
                next_task();
                return true;
            case 0x4: return true; //print str
            case 0x5: return true; //read int
            case 0x6: return true; //print str
            default:
                return false;
        }
    }
}
//# sourceMappingURL=webos.js.map