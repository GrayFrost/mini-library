const acorn = require('acorn');

let str = 'let a = 123';
const ast = acorn.parse(str, { ecmaVersion: 2015 });
console.log(ast);