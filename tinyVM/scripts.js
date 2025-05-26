/*

        Bella TinyVM
        LICENSE: MIT

        AUTHOR(S): LE NGOC CUONG
*/
class tinyVM {
    constructor(memorySize, ROMImage, mode) {
        this.mode = {
            //debug: false, //debug mode
            verbose: mode.verbose, //verbose mode
            stepLimit: mode.stepLimit, //step limit for the VM
            dumpMemoryAtEnd: mode.dumpMemoryAtEnd //dump memory at the end of execution
        }
        this.memory = [];
        this.register = [];
        this.flags = {
            zero: false,
            negative: false,
            
        };

        this.memory = new Uint8Array(memorySize);
        for (let i = 0; i < 16;i++) this.register[i] = 0x0;
        this.register[15] = 0; //avoid the risk.

        //check ROM valid
        for (let i = 0; i < ROMImage.length;i++) {
            if (ROMImage[i] > 255) {
                throw new Error("invalid limition of bit-width per character.");
            }
        }
        let validMemory = memorySize;
        let count = 0;
        if (memorySize < ROMImage.length) {
            console.warn("warning: ROM size was bigger than memory size.");
            count = memorySize;
        }
        else {
            count = ROMImage.length;
        }

        for (let i = 0;i < count;i++) {
            this.memory[i] = ROMImage[i];
        }        
        
    }




    runtime() {
        let step = 0;
        while (true) {


            


            let instr = [0,0,0,0];
            for (let i = 0; i < 4; i++) instr[i] = this.memory[this.register[15] + i];
            
            let LR = instr[1] >> 4; //Left Register //Rs
            let RR = instr[1] & 0b1111; //Right Register //RR

            
            console.log("Running step:", step);
            
            step++;
            if (step >= this.mode.stepLimit) {
                console.warn("Step limit reached. Stopping execution.");
                console.warn("use tinyVM.destroy() to destroy the VM.");
                console.warn(`the step have stopped at: ${step}`);
                console.warn("instruction structure is:", instr);

                break;
            }

            //VMBRK/HWLT
            if (instr[0] == 0) {
                break;
            }

            //LDR
            if (instr[0] ==  1) {
                let offset = instr[2];
                let neg = false;
                if (instr[3] == 0) neg = true;
                
                /*
                //positve
                if (neg == true) this.register[LR] = this.memory[this.register[15] + (offset*4) ];
                //negative
                if (neg == false) this.register[LR] = this.memory[this.register[15] - (offset*4) ];   
                */

                let v32Int = 0;
                if (neg == true) {
                    v32Int = _8bitTo32bit(
                        this.memory[this.register[15] + (offset*4)],
                        this.memory[this.register[15] + (offset*4) + 1],
                        this.memory[this.register[15] + (offset*4) + 2],
                        this.memory[this.register[15] + (offset*4) + 3]
                    );
                }
                else {
                    v32Int = _8bitTo32bit(
                        this.memory[this.register[15] - (offset*4)],
                        this.memory[this.register[15] - (offset*4) + 1],
                        this.memory[this.register[15] - (offset*4) + 2],
                        this.memory[this.register[15] - (offset*4) + 3]
                    );
                }
                this.register[LR] = v32Int; //fixed the bug of 8-bit to 32-bit conversion.

                console.warn("LDR instruction executed. LR:", LR, "Value:", this.register[LR], "Offset:", offset, "Negative:", neg);             
            }

            //CPR
            if (instr[0] == 2) {
                this.register[RR] = this.register[LR];
            }
            
            //STR
            if (instr[0] == 3) {
                let address = this.register[RR];
                
                this.memory[address] = this.register[LR];
            }

            //B
            if (instr[0] == 4) {
                this.register[15] = this.register[LR]; 
                continue;
                //be careful, the code may broke if you branch not to a address that is not factor of 4.
            }

            //BO
            if (instr[0] == 5) {
                let offset = instr[1];
                let neg = false;
                if (instr[3] == 0) neg = true;

                

                //positve
                if (neg == true) this.register[15] = this.register[15] + (offset*4) ;
                //negative
                if (neg == false) this.register[15] = this.register[15] - (offset*4) ;
                continue;    
            }

            //ADD
            if (instr[0] == 6) {
                if (instr[2] > 15) {
                    
                }
                else {
                    if (instr[3] == 1) {
                        //signed
                       this.register[instr[2]] = (vsint32(this.register[LR]) + vsint32(this.register[RR])) | 0;
                       if (this.register[instr[2]] < 0) {
                            this.flags.negative = true;
                       }
                       else if (this.register[instr[2]] == 0) {
                        this.flags.negative = true;
                       }
                    }
                    else {
                        this.register[instr[2]] = (vuint32(this.register[LR]) + vuint32(this.register[RR])) >>> 0;
                  
                        if (this.register[instr[2]] < 0) {
                            this.flags.negative = true;
                       }
                       else if (this.register[instr[2]] == 0) {
                        this.flags.negative = true;
                       }
                    }
                }
            }


            //SUB
            if (instr[0] == 7) {
                if (instr[2] > 15) {
                    
                }
                else {
                    if (instr[3] == 1) {
                        //signed
                       this.register[instr[2]] = (vsint32(this.register[LR]) - vsint32(this.register[RR])) | 0;
                       if (this.register[instr[2]] < 0) {
                        this.flags.negative = true;
                   }
                   else if (this.register[instr[2]] == 0) {
                    this.flags.negative = true;
                   }
                   
                    }
                    else {
                        this.register[instr[2]] = (vuint32(this.register[LR]) - vuint32(this.register[RR])) >>> 0;
                        if (this.register[instr[2]] < 0) {
                            this.flags.negative = true;
                       }
                       else if (this.register[instr[2]] == 0) {
                        this.flags.negative = true;
                       }
                    }
                }
            }

            //MUL
            if (instr[0] == 8) {
                if (instr[2] > 15) {
                    
                }
                else {
                    if (instr[3] == 1) {
                        //signed
                       this.register[instr[2]] = (vsint32(this.register[LR]) * vsint32(this.register[RR])) | 0;
                    }
                    else {
                        this.register[instr[2]] = (vuint32(this.register[LR]) * vuint32(this.register[RR])) >>> 0;
                    }
                }
            }

            //DIV (in development.) (stub was so risky.)


            //AND
            if (instr[0] == 10) {
                if (instr[2] > 15) {
                    
                }
                else {
                    this.register[instr[2]] = this.register[LR] & this.register[RR];
                }
            }

            //OR
            if (instr[0] == 11) {
                if (instr[2] > 15) {
                    
                }
                else {
                    this.register[instr[2]] = this.register[LR] | this.register[RR];
                }
            }

            //XOR
            if (instr[0] == 12) {
                if (instr[2] > 15) {
                    
                }
                else {
                    this.register[instr[2]] = this.register[LR] ^ this.register[RR];
                }
            }

            //NOT
            if (instr[0] == 13) {
                if (instr[2] > 15) {
                    
                }
                else {
                    this.register[instr[2]] = ~ this.register[LR];
                }
            }

            //NB
            if (instr[0] == 14) {
                if (this.flags.negative == true) {
                    this.register[15] = this.register[LR]; 
                    continue;
                    //re-check the `B`(4) instruction comment.
                }
               
            }

            //ZB
            if (instr[0] == 15) {
                if (this.flags.zero == true) {
                    this.register[15] = this.register[LR]; 
                    continue;
                    //re-check the `B`(4) instruction comment.
                }
               
            }

            //SHL
            if (instr[0] == 16) {
                if (instr[2] > 255) {

                }
                else {
                    this.register[instr] = vuint32(this.register[LR] << this.register[RR]);
                }
            }

            
            //SHR
            if (instr[0] == 17) {
                if (instr[2] > 255) {

                }
                else {
                    this.register[instr] = vuint32(this.register[LR] >> this.register[RR]);
                }
            }

            //CLF
            if (instr[0] == 18) {
                if (instr[2] > 255) {

                }
                else {
                    this.flags.zero = false;
                    this.flags.negative = false;
                }
            }

            //ESBC
            if (instr[0] = 19) {
                //todo
                //extension.
            }

            console.log("Step:", step, "Instruction:", instr, "PC:", this.register[15], "Registers:", this.register, "Flags:", this.flags);

            this.register[15] += 4;
        }
        if (this.mode.dumpMemoryAtEnd) {
            console.log("Memory dump at end of execution:", this.memory);
            console.log("Register dump at end of execution:", this.register);
            console.log("Flags dump at end of execution:", this.flags);
        }
        console.warn("Runtime was done.");
    }

    //destroy the VM
    destroy() {
        this.memory = [];
        this.register = [];
        this.flags = {
            zero: false,
            negative: false
        };
        console.warn("VM was destroyed.");
    }

    //debug 
    getMemory() {
        return this.memory;
    }
    getRegister() {
        return this.register;
    }
    getFlags() {
        return this.flags;
    }
    getMode() {
        return this.mode;
    }
    setMemory(address, value) {
        if (address < 0 || address >= this.memory.length) {
            throw new Error("Memory address out of bounds.");
        }
        if (value < 0 || value > 255) {
            throw new Error("Value must be between 0 and 255.");
        }
        this.memory[address] = value;
    }
    setRegister(index, value) {
        if (index < 0 || index >= this.register.length) {
            throw new Error("Register index out of bounds.");
        }
        if (value < -2147483648 || value > 2147483647) {
            throw new Error("Value must be a signed 32-bit integer.");
        }
        this.register[index] = value | 0; // Ensure it's a signed 32-bit integer
    }       
    setFlags(flags) {
        if (typeof flags.zero !== 'boolean' || typeof flags.negative !== 'boolean') {
            throw new Error("Flags must be an object with boolean properties zero and negative.");
        }
        this.flags = flags;
    }

}

function vuint32(a) {
    return a >>> 0;
}

function vsint32(a) {
    return a | 0;
}


function _8bitTo32bit(a,b,c,d) {
    let r;
    r = a << 24;
    r = r | (b << 16);
    r = r | (c << 8);
    r = r | d;
    return r;
}

/*
const t = new tinyVM(100, [
    0b11000000,0b11111111,0b00000011,0b11000000,
    0b00000000,0b00000000,0b00000000,0b00000000,
    0b00000000,0b00000000,0b00000000,0b00000000,
    0b00000000,0b00000000,0b00000000,0b00000000,
    0b00000000,0b00000000,0b00000000,0b00000000,
    0b00000000,0b00000000,0b00000000,0b00000000,
    0b00000000,0b00000000,0b00000000,0b00000000,
    0b00000000,0b00000000,0b00000000,0b00000000,
    0b00000000,0b00000000,0b00000000,0b00000000,
    0b00000000,0b00000000,0b00000000,0b00000000,
    0b00000000,0b00000000,0b00000000,0b00000000,
    0b00000000,0b00000000,0b00000000,0b00000000,
    0b00000000,0b00000000,0b00000000,0b00000000,
    0b00000000,0b00000000,0b00000000,0b00000000,
    0b00000000,0b00000000,0b00000000,0b00000000,
    0b00000000,0b00000000,0b00000000,0b00000000
]);
t.runtime();
*/
