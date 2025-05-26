/*

        Bella TinyVM
        LICENSE: MIT

        AUTHOR(S): LE NGOC CUONG
*/
class tinyVM {
    constructor(memorySize, ROMImage) {
        this.memory = [];
        this.register = [];
        this.flags = {
            zero: false,
            negative: false
        };

        for (let i = 0; i < memorySize;i++)  this.memory.push(0x0); //initial memory
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
        (async () => {
            while (true) {
                //to do
                await new Promise(resolve => setTimeout(resolve, 100)); // để tránh lock CPU
            }
        })();

        while (true) {
            let instr = [0,0,0,0];
            for (let i = 0; i < 4; i++) instr[i] = this.memory[this.register[15] + i];
            
            let LR = instr[1] >> 4; //Left Register //Rs
            let RR = instr[1] & 0b1111; //Right Register //RR
            
            //VMBRK/HWLT
            if (instr[0] == 0) {
                break;
            }

            //LDR
            if (instr[0] ==  1) {
                let offset = instr[2];
                let neg = false;
                if (instr[3] == 0) neg = true;
                
                //positve
                if (neg == false) this.register[LR] = this.memory[this.register[15] + (offset*4) ];
                //negative
                if (neg == true) this.register[LR] = this.memory[this.register[15] - (offset*4) ];                
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
                let offset = instr[2];
                let neg = false;
                if (instr[3] == 0) neg = true;

                //positve
                if (neg == false) this.register[15] = this.register[15] + (offset*4) ;
                //negative
                if (neg == true) this.register[15] = this.register[15] - (offset*4) ;
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


            this.register[15] += 4;
        }

        console.warn("Runtime was done.");
    }

}

function vuint32(a) {
    return a >>> 0;
}

function vsint32(a) {
    return a | 0;
}

/*
function _8bitTo32bit(a,b,c,d) {
    let r;
    r = a << 24;
    r = r | (b << 16);
    r = r | (c << 8);
    r = r | d;
    return r;
}

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