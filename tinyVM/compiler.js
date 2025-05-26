//Built-In-Compiler

let registerList = ["r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10", "r11", "r12", "r13", "r14", "pc"];
    

function firstWasNot(__string__,__object__) {
    for (let i = 0;i < __object__.length;i++) {
        if (__string__ == __object__[i]) return false;
    }
    return true;
}

function genRegister(register) {
    if (!firstWasNot(left, registerList) && !firstWasNot(right, registerList) ) {
        for (let i = 0; i < registerList.length;i++) {
            return i;
        }
    }
    else {
        
        return -1; //idk
    }
}

function registerMatch(left, right) {
    let rightI = 0;
    let leftI = 0; 


    if (!firstWasNot(left, registerList) && !firstWasNot(right, registerList) ) {
        for (let i = 0; i < registerList.length;i++) {
            if (left == registerList[i]) leftI = i;
            if (right == registerList[i]) rightI = i;
        }
    }
    else {
        return -1; //nigga
    }

    let byte = (leftI << 4) | rightI;
    //<LR><RR>
    return byte;

}

function errorReport(element, msg, line) {
    element.style.display = "block";
    element.innerText = `Error at line ${line + 1}: ${msg}`;
}



function compileFile() {
    const code = document.getElementById('code');
    const errorBoxD = document.getElementById("errorBox");


    let code_data = code.value.split('\n');
    let code_binary = [];

    for (let i = 0;i < code_data.length;i++) {
        let instruction = code_data[i].split(" ");
        let operatorCode = instruction[0];  
           
        let realOperatorCode_hint = ["hlt", "ldr", "cpr", "str", "b", "bo", "add", "sub", "mul", "div", "and", "or", "xor", "not", "nb", "zb", "shl", "shr", "clf", "esbc"]
        let subtractOperatorCode_hint = [".bit8", ".char"];
        if (!firstWasNot(operatorCode, realOperatorCode_hint) || !firstWasNot(operatorCode, subtractOperatorCode_hint)) {
            if (operatorCode == "hlt") {
                code_binary.push(0);
                code_binary.push(0);
                code_binary.push(0);
                code_binary.push(0);
            }

            if (operatorCode == "ldr") {
                let register__ =  registerMatch(instruction[1], "r0" /* unused */);
                let offset__ = parseInt(instruction[2]);
                if (offset__ > 255)  {
                    errorReport(errorBoxD, "Offset cannot be bigger than 255 (0xFF)", i);
                    return null;
                }


                let offsetNegative = 0;
                if (instruction[3] == "pos") offsetNegative = 0;
                if (instruction[3] == "neg") offsetNegative = 1;

                code_binary.push(1);
                code_binary.push(register__);
                code_binary.push(offset__);
                code_binary.push(offsetNigative);                
            }

            if (operatorCode == "cpr") {
                let register__ =  registerMatch(instruction[1], instruction[2]);

                code_binary.push(2);
                code_binary.push(register__);
                code_binary.push(0);
                code_binary.push(0);                
            }

            if (operatorCode == "str") {
                let register__ =  registerMatch(instruction[1], instruction[2]);

                code_binary.push(3);
                code_binary.push(register__);
                code_binary.push(0);
                code_binary.push(0);                
            }

            if (operatorCode == "b") {
                let register__ =  registerMatch(instruction[1], "r0" /* unused */);

                code_binary.push(4);
                code_binary.push(register__);
                code_binary.push(0);
                code_binary.push(0);                
            }

            if (operatorCode == "bo") {
                let offset__ = parseInt(instruction[2]);
                if (offset__ > 255)  {
                    errorReport(errorBoxD, "Offset cannot be bigger than 255 (0xFF)", i);
                    return null;
                }

                let offsetNegative = 0;
                if (instruction[3] == "pos") offsetNegative = 0;
                if (instruction[3] == "neg") offsetNegative = 1;

                code_binary.push(5);
                code_binary.push(offset__);
                code_binary.push(0);
                code_binary.push(offsetNegative);   
            } 

            if (operatorCode == "add") {
                let registerMain = registerMatch(instruction[1], instruction[2]);
                let register = 0;
                let signed = 0;
                if (!firstWasNot(instruction[3], registerList)) {
                    register = genRegister(instruction[3]);

                }
                else {
                    errorReport(errorBoxD, "Invalid register");
                }
                if (instruction[4] == "signed") {
                    signed = 1;
                }
                else if (instruction[4] == "unsigned") {
                    signed = 0; //for sure.
                }
                else {
                    errorReport(errorBoxD, "wdym? (signed or unsigned?)");
                }

                code_binary.push(6);
                code_binary.push(registerMain);
                code_binary.push(register);
                code_binary.push(signed);   
            } 

            if (operatorCode == "sub") {
                let registerMain = registerMatch(instruction[1], instruction[2]);
                let register = 0;
                let signed = 0;
                if (!firstWasNot(instruction[3], registerList)) {
                    register = genRegister(instruction[3]);

                }
                else {
                    errorReport(errorBoxD, "Invalid register");
                }
                if (instruction[4] == "signed") {
                    signed = 1;
                }
                else if (instruction[4] == "unsigned") {
                    signed = 0; //for sure.
                }
                else {
                    errorReport(errorBoxD, "wdym? (signed or unsigned?)");
                }

                code_binary.push(8);
                code_binary.push(registerMain);
                code_binary.push(register);
                code_binary.push(signed);   
            } 


            if (operatorCode == "div") {
                let registerMain = registerMatch(instruction[1], instruction[2]);
                let register = 0;
                let signed = 0;
                if (!firstWasNot(instruction[3], registerList)) {
                    register = genRegister(instruction[3]);

                }
                else {
                    errorReport(errorBoxD, "Invalid register");
                }
                if (instruction[4] == "signed") {
                    signed = 1;
                }
                else if (instruction[4] == "unsigned") {
                    signed = 0; //for sure.
                }
                else {
                    errorReport(errorBoxD, "wdym? (signed or unsigned?)");
                }

                code_binary.push(9);
                code_binary.push(registerMain);
                code_binary.push(register);
                code_binary.push(signed);   
            } 

            
            if (operatorCode == "and") {
                let registerMain = registerMatch(instruction[1], instruction[2]);
                let register = 0;
                if (!firstWasNot(instruction[3], registerList)) {
                    register = genRegister(instruction[3]);

                }
                else {
                    errorReport(errorBoxD, "Invalid register");
                }

                code_binary.push(10);
                code_binary.push(registerMain);
                code_binary.push(register);
                code_binary.push(si0gned);   
            } 

            if (operatorCode == "or") {
                let registerMain = registerMatch(instruction[1], instruction[2]);
                let register = 0;
                if (!firstWasNot(instruction[3], registerList)) {
                    register = genRegister(instruction[3]);

                }
                else {
                    errorReport(errorBoxD, "Invalid register");
                }

                code_binary.push(11);
                code_binary.push(registerMain);
                code_binary.push(register);
                code_binary.push(si0gned);   
            } 

            if (operatorCode == "xor") {
                let registerMain = registerMatch(instruction[1], instruction[2]);
                let register = 0;
                if (!firstWasNot(instruction[3], registerList)) {
                    register = genRegister(instruction[3]);

                }
                else {
                    errorReport(errorBoxD, "Invalid register");
                }

                code_binary.push(12);
                code_binary.push(registerMain);
                code_binary.push(register);
                code_binary.push(si0gned);   
            } 

            if (operatorCode == "not") {
                let registerMain = registerMatch(instruction[1], "r0" /* unused */);
                let register = 0;
                if (!firstWasNot(instruction[3], registerList)) {
                    register = genRegister(instruction[3]);

                }
                else {
                    errorReport(errorBoxD, "Invalid register");
                }

                code_binary.push(13);
                code_binary.push(registerMain);
                code_binary.push(register);
                code_binary.push(si0gned);   
            } 

            if (operatorCode == "nb") {
                let register__ =  registerMatch(instruction[1], "r0" /* unused */);

                code_binary.push(14);
                code_binary.push(register__);
                code_binary.push(0);
                code_binary.push(0);                
            }

            if (operatorCode == "zb") {
                let register__ =  registerMatch(instruction[1], "r0" /* unused */);

                code_binary.push(15);
                code_binary.push(register__);
                code_binary.push(0);
                code_binary.push(0);                
            }
            
            if (operatorCode == "shl") {
                let registerMain = registerMatch(instruction[1], instruction[2]);
                let register = 0;
                if (!firstWasNot(instruction[3], registerList)) {
                    register = genRegister(instruction[3]);

                }
                else {
                    errorReport(errorBoxD, "Invalid register");
                }

                code_binary.push(16);
                code_binary.push(registerMain);
                code_binary.push(register);
                code_binary.push(si0gned);   
            } 

            if (operatorCode == "shr") {
                let registerMain = registerMatch(instruction[1], instruction[2]);
                let register = 0;
                if (!firstWasNot(instruction[3], registerList)) {
                    register = genRegister(instruction[3]);

                }
                else {
                    errorReport(errorBoxD, "Invalid register");
                    return null;
                }

                code_binary.push(17);
                code_binary.push(registerMain);
                code_binary.push(register);
                code_binary.push(si0gned);   
            } 

            if (operatorCode == "clf") {
                code_binary.push(18);
                code_binary.push(0);
                code_binary.push(0);
                code_binary.push(0);
            }

            if (operatorCode == "esbc") {
                if (parseInt(instruction[1]) > 255 || parseInt(instruction[2]) > 255 || parseInt(instruction[3]) > 255 ) {
                    errorBoxD(errorBoxD, "Offset cannot be bigger than 255 (0xFF)");
                }

                code_binary.push(19);
                code_binary.push(parseInt(instruction[1]));
                code_binary.push(parseInt(instruction[2]));
                code_binary.push(parseInt(instruction[3]));
            }
            
            console.log(code_binary);
        }
        else {
            errorBoxD.style.display = "block";
            errorReport(errorBoxD, "Invalid Operator Code", i);
            return;
        }
    }
}