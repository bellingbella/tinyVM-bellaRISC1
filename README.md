> [!CAUTION]
> **DO NOT TRY**, the project isn't tested yet and this repository is for the my("our") fallback.


> [!WARNING]
> the division currently was not available and only `ADD`, `SUB` and `CLF` could affect on `tinyVM.flags` (btw `tinyVM.overflow` was not available).

> [!NOTE]
> please read the license in `LICENSE` file before fork, clone or use this source code.

# TinyVM.js: Bella-RISC

## Introducing

- This Virtual Machine uses Bella-RISC architecture that desgined by `Belling Bella` (Me) and based in [RISC]("https://en.wikipedia.org/wiki/Reduced_instruction_set_computer")
- TinyVM can run a simple software on your website, your console,etc.

## Bella-RISC Instructions structure and list

1. Instructions Structure (Left to Right)
2. There're the my TinyVM instruction's structure:


|         | 8-bit         | 8-bit    | 8-bit      | 8-bit      |
| --------- | --------------- | ---------- | ------------ | ------------ |
|         | Operator Code | Register | Operator 2 | Operator 3 |
| Math    |               | Ra, Rb   | Rd         | Mode (S/U) |
| Bitwise |               | Ra, Rb   | Rc         | Mode       |
|         |               | Rs, Rd   |            |            |

2. Instruction List
   **Note:**
   - `Rd` was destination register, `Rs` was source register, `R(a, b and c)` was additional register
   - Offset value was 32-bits, not 8-bits and based on r15 (pc register).
   - Registers' order on `Main Register(s) / Offset` will be ordered from left (after `Operator Code`) to right (before `Offset / Addtional Register`) of bit order.
   - (*1): Virtualizating only (if it was real machine, it would halt the cpu.) (if you do then your vm will be fucked up.)
   - the `Operator Code` binary identification based on the `N` column.
   - Read the `WARNING` and `NOTE` on the README's header.


| N  | Operator Code                      | Main Register(s) / Offset | Offset / Addtional Register | Mostly is Mode                                     |
| ---- | :----------------------------------- | --------------------------- | ----------------------------- | ---------------------------------------------------- |
| 0  | VMBRK/HWLT (*1)                    | ignored                   | ignored                     | ignored                                            |
| 1  | LDR (Load to Reg)                  | Rd                        | Offset                      | 0 = Positive (Before) ; 1 = Negative (After)       |
| 2  | CPR (Copy to Reg)                  | Rs, Rd                    | Ignored                     | Ignored                                            |
| 3  | STR (Store Reg)                    | Rs                        | Rd(Address)                 | Ignored                                            |
| 4  | B (Branch)                         | Rs                        | Ignored                     | Ignored                                            |
| 5  | BO (Branch with offset)            | Offset                    | Ignored                     | 0 = Positive (Before) ; 1 = Negative (After)Ignore |
| 6  | ADD                                | Ra, Rb                    | Rd                          | 1 = Signed                                         |
| 7  | SUB                                | Ra, Rb                    | Rd                          | 1 = Signed                                         |
| 8  | MUL                                | Ra, Rb                    | Rd                          | 1 = Signed                                         |
| 9  | DIV                                | Ra, Rb                    | Rd                          | 1 = Signed                                         |
| 10 | AND                                | Ra, Rb                    | Rd                          | Ignored                                            |
| 11 | OR                                 | Ra, Rb                    | Rd                          | Ignored                                            |
| 12 | XOR                                | Ra, Rb                    | Rd                          | Ignored                                            |
| 13 | NOT                                | Rs                        | Rd                          | Ignored                                            |
| 14 | NB (Branch if Negative)            | Rs                        | Ignored                     | Ignored                                            |
| 15 | ZB (Branch if Zero)                | Rs                        | Ignored                     |                                                    |
| 16 | SHL                                | Rs, Ra                    | Rd                          | Ignored                                            |
| 17 | SHR                                | Rs, Ra                    | Rd                          | Ignored                                            |
| 18 | CLF (Reset Flags)                  | Ignored                   | Ignored                     | Ignored                                            |
| 19 | ESBC (External System Binary Code) | Ra, Rb                    | Rc                          | Rd                                                 |
