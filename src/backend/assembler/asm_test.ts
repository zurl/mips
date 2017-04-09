/**
 *  @file
 *  @author zcy <zurl@live.com>
 *  Created at 1/22/2017
 */
// The assembler test
export default `
    // arithmetic and logical command

     dd 14, 27;
    BaseAddre: 00000010 ;

    add $t1, $t2, $t3;
    addu $t1, $t2, $t3;
    and $t1, $t2, $t3;
    sub $t1, $t2, $t3;
    subu $t1, $t2, $t3;
    xor $t1, $t2, $t3;
    nor $t1, $t2, $t3;
    or $t1, $t2, $t3;
    slt $t1, $t2, $t3 ;
    sltu $t1, $t2, $t3;
    
    sllv $t1, $t2, $t3;
    srav $t1, $t2, $t3;
    srlv $t1, $t2, $t3;
    
    sll $t1, $t2, 1;
    sra $t1, $t2, 1;
    srl $t1, $t2, 1;
    
    ori $t1, $t2, 1;
    addi $t1, $t2, -1;
    addiu $t1, $t2, -1;
    andi $t1, $t2, 1;
    xori $t1, $t2, 1;
    slti $t1, $t2, -1;
    sltiu $t1, $t2, -1;
 
    lb $t1,-16($t2);
    lbu $t1,-16($t2);
    lh $t1,-16($t2);
    lhu $t1,-16($t2);
    lw $t1,-16($t2);
    sb $t1,-16($t2);
    sh $t1,-16($t2);
    sw $t1,-16($t2);
    
    beq $t1,$t2,flag;
    bne $t1,$t2,flag;
    blez $t1,flag;
    bgez $t1,flag;
    bltz $t1,flag;
    bgtz $t1,flag;
    
   
    
    flag:  
    div $t1, $t2;
    divu $t1, $t2;
    mult $t1, $t2;
    multu $t1, $t2;
    jalr $t1, $t2;
    move $t1, $t2;
    mfhi $t1;
    mflo $t1;
    mthi $t1;
    mtlo $t1;
    jr $t1;
    j flag;
    jal flag;
    
    
    break 12;
    lui $t1, 1;
    syscall;
    
`;
