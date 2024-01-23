import { walker } from 'estree-walker';
import acorn from 'acorn';

const sourceCode = `let a = 123`;
const options = {
  ecmaVersion: 2015
}

const ast = acorn.parse(sourceCode, options); // https://github.com/acornjs/acorn

console.log(walker);
// walk(ast, {
//   enter(node, parent, prop, index) {
//     // some code happens
//     console.log('enter node', node);
//     console.log('enter parent', parent);
//     console.log('enter prop', prop);
//   },
//   leave(node, parent, prop, index) {
//     // some code happens
//     console.log('leave', node);
//   }
// });