"use strict";
exports.__esModule = true;
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 11/5/2016
 */
exports["default"] = "\n    beq $t1,$t2,flag;\n    bgez $t1,flag;\n    abs $t1, $t2;\nsort: addi $sp,$sp,-20  ; \n    sw $ra,16($sp);\n    sw $s3,12($sp);\n    sw $s2,8($sp);\n    sw $s1,4($sp);\n    sw $s0,0($sp);\n    move $s2, $a0;\n    move $s3, $a1;\n    move $s0, $zero;\n    \nfor1tst: slt $t0,$s0,$s3;\n    beq $t0,$zero,exit1;\n    addi $s1,$s0,-1;\nfor2tst: slti $t0,$s1,0;\n    bne $t0,$zero,exit;\n    sll $t1,$s1,2;\n    add $t2,$s2,$t3;\n    lw $t3,0($t2);\n    lw $t4,4($t2);\n    slt $t0,$t0,$t3;\n    beq $t0,$zero,exit2;\n    \n    move $a0,$s2;\n    move $a2,$s1;\n    jal swap;\n    \n    addi $s1,$s1,-1;\n    j for2tst;\nexit2: addi $s0,$s0,1;\n    j for1tst;\nexit1: lw $s0, 0($sp);\n    lw $s0, 0($sp);\n    lw $s1, 4($sp);\n    lw $s2, 8($sp);\n    lw $s3, 12($sp);\n    lw $ra, 16($sp);\n    addi $sp,$sp,20;\n";
