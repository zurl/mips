"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 11/5/2016
 */
exports.default = `
    beq $t1,$t2,flag;
    bgez $t1,flag;
    abs $t1, $t2;
sort: addi $sp,$sp,-20  ; 
    sw $ra,16($sp);
    sw $s3,12($sp);
    sw $s2,8($sp);
    sw $s1,4($sp);
    sw $s0,0($sp);
    move $s2, $a0;
    move $s3, $a1;
    move $s0, $zero;
    
for1tst: slt $t0,$s0,$s3;
    beq $t0,$zero,exit1;
    addi $s1,$s0,-1;
for2tst: slti $t0,$s1,0;
    bne $t0,$zero,exit;
    sll $t1,$s1,2;
    add $t2,$s2,$t3;
    lw $t3,0($t2);
    lw $t4,4($t2);
    slt $t0,$t0,$t3;
    beq $t0,$zero,exit2;
    
    move $a0,$s2;
    move $a2,$s1;
    jal swap;
    
    addi $s1,$s1,-1;
    j for2tst;
exit2: addi $s0,$s0,1;
    j for1tst;
exit1: lw $s0, 0($sp);
    lw $s0, 0($sp);
    lw $s1, 4($sp);
    lw $s2, 8($sp);
    lw $s3, 12($sp);
    lw $ra, 16($sp);
    addi $sp,$sp,20;
`;
//# sourceMappingURL=sort.test.js.map 
//# sourceMappingURL=sort.test.js.map