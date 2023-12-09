/* 
  What is simple?
    Simple<number> is a project where I try to make esoteric programming language, from really simple (v.1) to more complex (v.??) and well designed esoteric programming languages.
    This is only made for fun so there's most likely not gonna be any updates or optimizations whatsoever.
    !!! ATTENTION !!!
    This is not meant to be a fully functional programming language.

  ---- SIMPLE1 ----
    To start off with number 1 (the simplest of all), we should begin with creating a really simple set of rules and tokens for a small number of possible operations. (version 1 is based off of brainfuck too btw)

    --- Process ---
      1. Tokenize each character.
      2. Parse it into a set of instructions, runnable by the compiler.
      3. Compile each instruction into JS operations and stuff.

    --- Structure ---
      3 main modules are started, a, b and c. You can define each to it's own value. Then, output. Or get input from the user as well by registering the input in one of the 2 main modules.
      
      --- Module A ---
        Even though you can set the modules a and b to a character or a number, module A is mostly recommended to be used for integers.

      --- Module B ---
        Module B is pretty much for anything, but it's also recommended to be used for simple stuff, such as characters or integers. (Don't forget that any type of complex algorithm is pretty much discouraged on version 1. This is because version 1 is REALLY loop-heavy.)

      --- Module C ---
        Module C serves ONLY as a stacker. It's recommended to create stuff such as strings or arrays in this module.

      --- Other Modules? ---
        It is pretty much possible to create other modules, however, you have to do it in a modder file by using <filename>.simple1.mod and including it in your main file by using this as your first line: ["filename.simple1.mod"]. 

        !!! Attention !!!
        Since this is an array, you can use more than 1 file by separating the path to each file with a comma, like ["../path1/to/file.simple1.mod","../path2/to/anotherfile.simple1.mod"]
      
      
    --- Operations ---

    .simple1
    
    -- Default Modules --
      a - module A
      b - module B
      c - module C
    ---------------------
    + - increase value of module by 1
    - - decrease value of module by 1
    > - output module data
    < - get input from user 
    , - push (ONLY for stacker modules)
    * - multiplication
    / - division
    % - repeats the last instruction n times
    # - comment
    $ - marks end of instruction
    & - creates operation with a name
    \ - assigns operation with instruction until $
    ! - calls operation by name
    ~ - reset module value
    
    .simple1.mod
    !nameOfModule:anotherModule:anotherModule!

    (anything other than this is gonna be ignored in this file)
    (also, to make a module stackable, just put s_ before their name)

    --- Examples ---
    check ./examples for a better idea of what examples will look like.


    Anyways, this version was really fun to make and since it was very simple and strict, it wasn't that much of a headache to make.
*/

const compile = require("./compiler/comp"), logger = require("./logger");

function run(code) {
  try {
    compile(code);
  } catch(e) {
    logger.NodeError(e);
  }
}

module.exports = run;