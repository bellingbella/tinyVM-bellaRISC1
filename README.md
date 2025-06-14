
> [!WARNING]
> the division currently is not available and only `ADD`, `SUB` and `CLF` can affect on `tinyVM.flags` (btw `tinyVM.overflow` is not available).

> [!NOTE]
> please read the license in `LICENSE/` directory before fork, clone or use this source code.

# TinyVM.js: Bella-RISC

## Introducing

- This Virtual Machine uses Bella-RISC architecture that designed by `Belling Bella` (Me) and based on [RISC](https://en.wikipedia.org/wiki/Reduced_instruction_set_computer)
- TinyVM can run a simple software on your website, your console,etc.

## Bella-RISC Instructions structure and list

1. Instructions Structure (Left to Right)
2. There're the my TinyVM instruction's structure:


|   | 8-bit         | 8-bit    | 8-bit      | 8-bit      |
| --- | --------------- | ---------- | ------------ | ------------ |
|   | Operator Code | Register | Operator 2 | Operator 3 |
| M |               | Ra, Rb   | Rd         | Mode (S/U) |
| B |               | Ra, Rb   | Rc         | Mode       |
|   |               | Rs, Rd   |            |            |

2. Instruction List
   **Note:**
   - `Rd` is destination register, `Rs` is source register, `R(a, b and c)` is additional register
   - Offset value is 32-bits, not 8-bits and based on r15 (pc register).
   - (*1): Virtualization only (if it is real machine, it would halt the cpu.)
   - the `Operator Code` binary identification based on the `N` column.
   - Read the `WARNING` and `NOTE` on the README's header.


| N  | Operator Code                      | Main Register(s) / Offset | Offset / Addtional Register | (Mostly is) Mode                             |
| ---- | :----------------------------------- | --------------------------- | ----------------------------- | ---------------------------------------------- |
| 0  | VMBRK/HWLT (*1)                    | ignored                   | ignored                     | ignored                                      |
| 1  | LDR (Load to Reg)                  | Rd                        | Offset                      | 0 = Positive (Before) ; 1 = Negative (After) |
| 2  | CPR (Copy to Reg)                  | Rs, Rd                    | Ignored                     | Ignored                                      |
| 3  | STR (Store Reg)                    | Rs, Rd(Address)           | Ignored                     | Ignored                                      |
| 4  | RMA (Read Memory from Address)     | Rd, Rs                    | Ignored                     | Ignored                                      |
| 5  | B (Branch)                         | Rs                        | Ignored                     | Ignored                                      |
| 6  | BO (Branch with offset)            | Offset                    | Ignored                     | 0 = Positive (Before) ; 1 = Negative (After) |
| 7  | ADD                                | Ra, Rb                    | Rd                          | 1 = Signed                                   |
| 8  | SUB                                | Ra, Rb                    | Rd                          | 1 = Signed                                   |
| 9  | MUL                                | Ra, Rb                    | Rd                          | 1 = Signed                                   |
| 10 | DIV                                | Ra, Rb                    | Rd                          | 1 = Signed                                   |
| 11 | AND                                | Ra, Rb                    | Rd                          | Ignored                                      |
| 12 | OR                                 | Ra, Rb                    | Rd                          | Ignored                                      |
| 13 | XOR                                | Ra, Rb                    | Rd                          | Ignored                                      |
| 14 | NOT                                | Rs                        | Rd                          | Ignored                                      |
| 15 | NB (Branch if Negative)            | Rs                        | Ignored                     | Ignored                                      |
| 16 | ZB (Branch if Zero)                | Rs                        | Ignored                     |                                              |
| 17 | SHL                                | Rs, Ra                    | Rd                          | Ignored                                      |
| 18 | SHR                                | Rs, Ra                    | Rd                          | Ignored                                      |
| 19 | CLF (Reset Flags)                  | Ignored                   | Ignored                     | Ignored                                      |
| 20 | ESBC (External System Binary Code) | Data                      | Data                        | Dat                                          |
