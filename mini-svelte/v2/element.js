import * as fs from "fs";
import * as acorn from "acorn";
// import * as periscopic from "periscopic"; // todo 作用？
// import * as estreewalker from "estree-walker"; // todo 作用？
import * as escodegen from "escodegen"; // todo 作用？

import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'


const modulePath = dirname(fileURLToPath(import.meta.url));

// 将svelte文件转成浏览器可以执行的js文件
function buildAppJs() {
  try {
    const content = fs.readFileSync(resolve(modulePath, "./app-2.svelte"), "utf-8");
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
  ast.html = parseFragments(() => i < content.length);
  return ast;

  function parseFragments(condition) {
    const fragments = [];
    // const fragment = parseFragment();
    while (condition()) {
      const fragment = parseFragment();
      if (fragment) {
        fragments.push(fragment);
      }
    }
    return fragments;
  }

  function parseFragment() {
    return parseScript() ?? parseElement();
  }

  function parseScript() {
    console.log('parseScript');
    skipWhitespace();
    if (match("<script>")) {
      eat("<script>");
      const startIndex = i;
      const endIndex = content.indexOf("</script>", i);
      const code = content.slice(startIndex, endIndex);
      ast.script = acorn.parse(code, { ecmaVersion: 2023 });
      i = endIndex;
      console.log('zzh endindex', endIndex);
      eat("</script>");
      skipWhitespace();
    }
  }

  function parseElement() {
    skipWhitespace();
    if (match('<')) {
      eat('<');
      const tagName = readWhileMatching(/[a-z]/);
      eat('>');
      const endTag = `</${tagName}>`;
      console.log('zzh endTag', endTag);
      const element = {
        type: 'Element',
        name: tagName,
        attributes: [],
        children: [],
      };
      eat(endTag);
      skipWhitespace();
      return element;
    }
    // if (match('<')) {
    //   eat('<');
    //   const tagName = readWhileMatching(/[a-z]/);
    //   eat('>');
    //   const endTag = `</${tagName}>`;
    //   const element = {
    //     type: 'Element',
    //     name: tagName,
    //     attributes: [],
    //     children: parseFragments(() => !match(endTag)),
    //   };
    //   eat(endTag);
    //   return element;
    // }
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

function generate(ast) {
  const code = {
    variables: [],
    create: [],
    update: [],
    destroy: [],
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
      case 'Expression': {
        break;
      }
    }
  }

  ast.html.forEach((fragment) => traverse(fragment, 'target'));

  return `
      export default function() {
        function update() {}
        ${escodegen.generate(ast.script)}

        var lifecircle = {
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
        return lifecircle;
      }
    `;
}

buildAppJs();
