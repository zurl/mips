"use strict";
exports.__esModule = true;
/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 1/22/2017
 */
// The assembler test
exports["default"] = "\n    // arithmetic and logical command\n\n        dd 14, 27;\n    BaseAddre: 00000010 ;\n\n    add $t1, $t2, $t3;\n    addu $t1, $t2, $t3;\n    and $t1, $t2, $t3;\n    sub $t1, $t2, $t3;\n    subu $t1, $t2, $t3;\n    xor $t1, $t2, $t3;\n    nor $t1, $t2, $t3;\n    or $t1, $t2, $t3;\n    slt $t1, $t2, $t3 ;\n    sltu $t1, $t2, $t3;\n    \n    sllv $t1, $t2, $t3;\n    srav $t1, $t2, $t3;\n    srlv $t1, $t2, $t3;\n    \n    sll $t1, $t2, 1;\n    sra $t1, $t2, 1;\n    srl $t1, $t2, 1;\n    \n    ori $t1, $t2, 1;\n    addi $t1, $t2, -1;\n    addiu $t1, $t2, -1;\n    andi $t1, $t2, 1;\n    xori $t1, $t2, 1;\n    slti $t1, $t2, -1;\n    sltiu $t1, $t2, -1;\n \n    lb $t1,-16($t2);\n    lbu $t1,-16($t2);\n    lh $t1,-16($t2);\n    lhu $t1,-16($t2);\n    lw $t1,-16($t2);\n    sb $t1,-16($t2);\n    sh $t1,-16($t2);\n    sw $t1,-16($t2);\n    \n    beq $t1,$t2,flag;\n    bne $t1,$t2,flag;\n    blez $t1,flag;\n    bgez $t1,flag;\n    bltz $t1,flag;\n    bgtz $t1,flag;\n    \n   \n    \n    flag:  \n    div $t1, $t2;\n    divu $t1, $t2;\n    mult $t1, $t2;\n    multu $t1, $t2;\n    jalr $t1, $t2;\n    move $t1, $t2;\n    mfhi $t1;\n    mflo $t1;\n    mthi $t1;\n    mtlo $t1;\n    jr $t1;\n    j flag;\n    jal flag;\n    \n    \n    break 12;\n    lui $t1, 1;\n    syscall;\n    \n";
