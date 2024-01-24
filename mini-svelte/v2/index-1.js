import * as fs from 'fs';
import * as acorn from 'acorn'; // todo 作用？
import * as periscopic from 'periscopic'; // todo 作用？
import * as estreewalker from 'estree-walker'; // todo 作用？
import * as escodegen from 'escodegen'; // todo 作用？

// 将svelte文件转成浏览器可以执行的js文件
function buildAppJs() {
  const content = fs.readFileSync('./app.svelte', 'utf-8');
  fs.writeFileSync('./app.js', compile(content), 'utf-8');
}

function compile(content) {
  const ast = parse(content); // 解析svelte文件内容成ast
  return generate(ast)
}

function parse(content) {
  let i = 0;
  const ast = {};
  ast.html = parseFragments(() => i <= content.length);
  return ast;

  function parseFragments(condition) {
    const fragments = [];
    while(condition()) {
      const fragment = parseFragment();
      if (fragment) {
        fragments.push(fragment);
      }
    }
  }

  function parseFragment() {
    return parseScript() ?? parseElement() ?? parseExpression() ?? parseText();
  }

  function parseScript() {

  }

  function parseElement() {}

  function parseExpression() {}

  function parseText() {}

  function analyze() {}

  function generate() {
    const code = {
      variables: [],
      create: [],
      update: [],
      destroy: [],
      reactiveDeclarations: [], // todo
    };

    function traverse(){}
    return `
      export default function() {

      }
    `
  }
}