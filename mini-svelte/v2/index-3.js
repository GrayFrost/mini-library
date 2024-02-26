import * as fs from "fs";
// import path from "path";
import * as acorn from "acorn";
// import * as periscopic from "periscopic"; // todo 作用？
// import * as estreewalker from "estree-walker"; // todo 作用？
import * as escodegen from "escodegen"; // todo 作用？

import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'


const modulePath = dirname(fileURLToPath(import.meta.url));
console.log('zzh modulepath', modulePath);

// 将svelte文件转成浏览器可以执行的js文件
function buildAppJs() {
  try {
    console.log('here');
    const content = fs.readFileSync(resolve(modulePath, "./app.svelte"), "utf-8");
    fs.writeFileSync(resolve(modulePath, "./app.js"), compile(content), "utf-8");
  } catch (e) {
    console.error(e);
  }
}

function compile(content) {
  console.log('compile', content);
  const ast = parse(content); // 解析svelte文件内容成ast
  return generate(ast);
}

function parse(content) {
  console.log('parse')
  let i = 0;
  const ast = {};
  ast.html = parseFragments(() => i <= content.length);
  return ast;

  function parseFragments(condition) {
    console.log('parseFragments');
    const fragments = [];
    // while (condition()) {
    //   const fragment = parseFragment();
    //   if (fragment) {
    //     fragments.push(fragment);
    //   }
    // }
    parseFragment();
    return fragments;
  }

  function parseFragment() {
    console.log('parseFragment');
    // return parseScript() ?? parseElement() ?? parseExpression() ?? parseText();
    return parseScript() ?? parseElement();
  }

  function parseScript() {
    skipWhitespace();
    console.log('parseScript', match("<script>"));
    if (match("<script>")) {
      eat("<script>");
      const startIndex = i;
      const endIndex = content.indexOf("</script>", i);
      const code = content.slice(startIndex, endIndex);
      ast.script = acorn.parse(code, { ecmaVersion: 2023 });
      i = endIndex;
      eat("</script>");
      skipWhitespace();
    }
  }

  function parseElement() {
    console.log('parseElement', match('<'));
    skipWhitespace();
    if (match('<')) {
      eat('<');
      const tagName = readWhileMatching(/[a-z]/);
      console.log('zzh tagname', tagName);
      const attributes = parseAttributeList();
      eat('>');
      const endTag = `</${tagName}>`;
      const element = {
        type: 'Element',
        name: tagName,
        attributes,
        children: parseFragments(() => !match(endTag)),
      };
      eat(endTag);
      return element;
    }
  }

  function parseAttributeList() {
    console.log('parseAttributeList');
    const attributes = [];
    skipWhitespace();
    while (!match('>')) {
      attributes.push(parseAttribute());
      skipWhitespace();
    }
    return attributes;
  }

  function parseAttribute() {
    console.log('parseAttribute');
    const name = readWhileMatching(/[^=]/);
    if (match('={')) {
      eat('={');
      const value = parseJavaScript();
      eat('}');
      return {
        type: 'Attribute',
        name,
        value,
      };
    }
  }

  function parseExpression() {
    console.log('parseExpression')
    if (match('{')) {
      eat('{');
      const expression = parseJavaScript();
      eat('}');
      return {
        type: 'Expression',
        expression,
      };
    }
  }

  function parseText() {
    console.log('parseText')
    const text = readWhileMatching(/[^<{]/);
    if (text.trim() !== '') {
      return {
        type: 'Text',
        value: text.trim(),
      };
    }
  }

  function parseJavaScript() {
    const js = acorn.parseExpressionAt(content, i, { ecmaVersion: 2023 });
    i = js.end;
    return js;
  }

  function match(str) {
    return content.slice(i, i + str.length) === str;
  }

  function eat(str) {
    if (match(str)) {
      i += str.length;
    } else {
      throw new Error(`Parse error: expecting "${str}"`);
    }
  }

  function readWhileMatching(reg) {
    let startIndex = i;
    while(i < content.length && reg.test(content[i])) {
      i++;
    }
    return content.slice(startIndex, i);
  }

  function skipWhitespace() {
    readWhileMatching(/[\s\n]/);
  }
}

function analyze() {}

function generate(ast) {
  console.log('generate')
  const code = {
    variables: [],
    create: [],
    update: [],
    destroy: [],
    reactiveDeclarations: [], // todo
  };

  let counter = 1;
  
  function traverse(node, parent) {
    switch(node.type) {
      case 'Element': {
        const variableName = `${node.name}_${counter++}`;
        code.variables.push(variableName);
        code.create.push(
          `${variableName} = document.createElement('${node.name}')`
        )
        node.attributes.forEach(attribute => {
          traverse(attribute, variableName);
        })

        node.children.forEach(child => {
          traverse(child, variableName);
        })

        code.create.push(`${parent}.appendChild(${variableName})`);
        code.destroy.push(`${parent}.removeChild(${variableName})`);
        break;
      }
      case 'Text': {
        const variableName = `txt_${counter++}`;
        code.variables.push(variableName);
        code.create.push(`${variableName} = document.createTextNode('${node.value}');`);
        code.create.push(`${parent}.appendChild(${variableName})`);
        break;
      }
      case 'Attribute': {
        if (node.name.startsWith('on:')) {
          const eventName = node.name.slice(3);
          const eventHandler = node.value.name;
          code.create.push(`${parent}.addEventListener('${eventName}', ${eventHandler});`);
          code.destroy.push(`${parent}.removeEventListener('${eventName}', '${eventHandler}');`);
        }
        break;
      }
      case 'Expression': {
        break;
      }
    }
  }

  ast.html.forEach((fragment) => traverse(fragment, 'target'));

  return `
      export default function() {
        ${code.variables.map(v => `let ${v};`).join('\n')}

        function update() {}

        ${escodegen.generate(ast.script)}

        var lifecycle = {
          create(target) {
            ${code.create.join('\n')}
          },
          update(changed) {
            ${code.update.join('\n')}
          },
          destroy(target) {
            ${code.destroy.join('\n')}
          }
        };
        return lifecycle;
      }
    `;
}

buildAppJs();
