import * as fs from "fs";
import * as acorn from "acorn";
import * as periscopic from "periscopic"; // todo 作用？
import * as estreewalker from "estree-walker"; // todo 作用？
import * as escodegen from "escodegen"; // todo 作用？

// 将svelte文件转成浏览器可以执行的js文件
function buildAppJs() {
  const content = fs.readFileSync("./app.svelte", "utf-8");
  fs.writeFileSync("./app.js", compile(content), "utf-8");
}

function compile(content) {
  const ast = parse(content); // 解析svelte文件内容成ast
  return generate(ast);
}

function parse(content) {
  let i = 0;
  const ast = {};
  ast.html = parseFragments(() => i <= content.length);
  return ast;

  function parseFragments(condition) {
    const fragments = [];
    while (condition()) {
      const fragment = parseFragment();
      if (fragment) {
        fragments.push(fragment);
      }
    }
    return fragments;
  }

  function parseFragment() {
    return parseScript() ?? parseElement() ?? parseExpression() ?? parseText();
  }

  function parseScript() {
    if (match("<script>")) {
      eat("<script>");
      const startIndex = i;
      const endIndex = content.indexOf("</script>", i);
      const code = content.slice(startIndex, endIndex);
      ast.script = acorn.parse(code, { ecmaVersion: 2023 });
      i = endIndex;
      eat("</script>");
    }
  }

  function parseElement() {
    if (match('<')) {
      eat('<');
      const tagName = readWhileMatching(/[a-z]/);
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
    const attributes = [];
    skipWhitespace();
    while (!match('>')) {
      attributes.push(parseAttribute());
      skipWhitespace();
    }
    return attributes;
  }

  function parseAttribute() {
    const name = readWhileMatching(/[^=]/);
    eat('={');
    const value = parseJavaScript();
    eat('}');
    return {
      type: 'Attribute',
      name,
      value,
    };
  }

  function parseExpression() {
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
    const text = readWhileMatching(/[^<{]/);
    if (text.trim() !== '') {
      return {
        type: 'Text',
        value: text,
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

function generate() {
  const code = {
    variables: [],
    create: [],
    update: [],
    destroy: [],
    reactiveDeclarations: [], // todo
  };

  let counter = 1;
  
  function traverse(node) {
    switch(node.type) {
      case 'Element': {
        break;
      }
      case 'Text': {
        break;
      }
      case 'Attribute': {
        break;
      }
      case 'Expression': {
        break;
      }
    }
  }
  return `
      export default function() {
        var lifecycle = {
          create() {},
          update() {},
          destroy() {}
        }
        return lifecycle;
      }
    `;
}
