import * as fs from "fs";
import * as acorn from "acorn";
import * as periscopic from "periscopic"; // todo 作用？
import * as estreewalker from "estree-walker"; // todo 作用？
import * as escodegen from "escodegen"; // todo 作用？
import * as prettier from "prettier";

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const modulePath = dirname(fileURLToPath(import.meta.url));

// 将svelte文件转成浏览器可以执行的js文件
async function buildAppJs() {
  try {
    const inputPath = resolve(modulePath, "./app-10.svelte");
    const outputPath = resolve(modulePath, "./app.js");
    const content = fs.readFileSync(inputPath, "utf-8");
    fs.writeFileSync(outputPath, compile(content), "utf-8");
    const compiledContent = fs.readFileSync(outputPath, "utf-8");
    const prettierContent = await prettier.format(compiledContent, {
      parser: "babel",
    });
    fs.writeFileSync(outputPath, prettierContent, "utf-8");
  } catch (e) {
    console.error(e);
  }
}

function compile(content) {
  console.log("compile");
  const ast = parse(content); // 解析svelte文件内容成ast
  const analysis = analyse(ast); // 解析有哪些会更新的变量
  return generate(ast, analysis);
}

function parse(content) {
  console.log("parse");
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
    return parseScript() ?? parseElement() ?? parseExpression() ?? parseText();
  }

  function parseScript() {
    console.log("parseScript");
    skipWhitespace();
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
    skipWhitespace();
    if (match("<")) {
      eat("<");
      const tagName = readWhileMatching(/[a-z]/);
      const attributes = parseAttributeList();
      eat(">");
      const endTag = `</${tagName}>`;
      const element = {
        type: "Element",
        name: tagName,
        attributes,
        children: parseFragments(() => !match(endTag)),
      };
      eat(endTag);
      skipWhitespace();
      return element;
    }
  }

  function parseAttributeList() {
    skipWhitespace();
    const attributes = [];
    while (!match(">")) {
      attributes.push(parseAttribute());
      skipWhitespace();
    }
    return attributes;
  }

  function parseAttribute() {
    console.log("parseAttribute");
    const name = readWhileMatching(/[^=]/);
    if (match("={")) {
      eat("={");
      const value = parseJavaScript();
      eat("}");
      return {
        type: "Attribute",
        name,
        value,
      };
    }
  }

  function parseExpression() {
    console.log("parseExpression");
    if (match("{") && !match("{#")) {
      eat("{");
      const expression = parseJavaScript();
      eat("}");
      return {
        type: "Expression",
        expression,
      };
    } else if (match("{#")) {
      return parseBlock();
    }
  }

  function parseBlock() {
    console.log("parseBlock");
    if (match("{#if")) {
      eat("{#if");
      skipWhitespace();
      const expression = parseJavaScript();
      eat("}");
      const endTag = "{/if}";
      const block = {
        type: "IfBlock",
        expression,
        children: parseFragments(() => !match(endTag)),
      };
      eat(endTag);
      return block;
    }
  }

  function parseJavaScript() {
    const js = acorn.parseExpressionAt(content, i, { ecmaVersion: 2023 });
    i = js.end;
    return js;
  }

  function parseText() {
    console.log("parseText");
    const text = readWhileMatching(/[^<{]/);
    if (text.trim() !== "") {
      return {
        type: "Text",
        value: text,
      };
    }
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
    while (i < content.length && reg.test(content[i])) {
      i++;
    }
    return content.slice(startIndex, i);
  }

  function skipWhitespace() {
    readWhileMatching(/[\s\n]/);
  }
}

function analyse(ast) {
  const result = {
    variables: new Set(),
    willChange: new Set(),
    willUseInTemplate: new Set(),
  };

  const { scope: rootScope, map, globals } = periscopic.analyze(ast.script);
  result.variables = new Set(rootScope.declarations.keys());
  result.rootScope = rootScope;
  result.map = map;

  let currentScope = rootScope;
  estreewalker.walk(ast.script, {
    enter(node) {
      if (map.has(node)) {
        currentScope = map.get(node);
      }
      if (
        node.type === "UpdateExpression" ||
        node.type === "AssignmentExpression"
      ) {
        const names = periscopic.extract_names(
          node.type === "UpdateExpression" ? node.argument : node.left
        );
        for (const name of names) {
          if (
            currentScope.find_owner(name) === rootScope ||
            globals.has(name)
          ) {
            result.willChange.add(name);
          }
        }
      }
    },
    leave(node) {
      if (map.has(node)) {
        currentScope = currentScope.parent;
      }
    },
  });

  function traverse(fragment) {
    switch (fragment.type) {
      case "Element":
        fragment.children.forEach((child) => traverse(child));
        fragment.attributes.forEach((attribute) => traverse(attribute));
        break;
      case "Attribute":
        result.willUseInTemplate.add(fragment.value.name);
        break;
      case "Expression": {
        extract_names(fragment.expression).forEach((name) => {
          result.willUseInTemplate.add(name);
        });
        break;
      }
    }
  }
  ast.html.forEach((fragment) => traverse(fragment));
  return result;
}

function extract_names(jsNode, result = []) {
  switch (jsNode.type) {
    case "Identifier":
      result.push(jsNode.name);
      break;
    case "BinaryExpression":
      extract_names(jsNode.left, result);
      extract_names(jsNode.right, result);
      break;
  }
  return result;
}

function generate(ast, analysis) {
  const code = {
    variables: [],
    create: [],
    update: [],
    destroy: [],
  };

  let counter = 1;

  function traverse(node, parent) {
    switch (node.type) {
      case "Element": {
        const variableName = `${node.name}_${counter++}`;
        code.variables.push(variableName);
        code.create.push(`${variableName} = element('${node.name}')`);
        node.attributes.forEach((attribute) => {
          traverse(attribute, variableName);
        });

        node.children.forEach((child) => {
          traverse(child, variableName);
        });

        code.create.push(`append(${parent}, ${variableName})`);
        code.destroy.push(`detach(${variableName})`);
        break;
      }
      case "Attribute": {
        if (node.name.startsWith("on:")) {
          const eventName = node.name.slice(3);
          const eventHandler = node.value.name;
          const eventNameCall = `${eventName}_${counter++}`;
          code.variables.push(eventNameCall);
          code.create.push(
            `${eventNameCall} = listen(${parent}, "${eventName}", ${eventHandler})`
          );
          code.destroy.push(`${eventNameCall}()`);
        }
        break;
      }
      case "Text": {
        const variableName = `txt_${counter++}`;
        code.variables.push(variableName);
        code.create.push(`${variableName} = text('${node.value}');`);
        code.create.push(`append(${parent}, ${variableName})`);
        code.destroy.push(`detach(${variableName})`);
        break;
      }
      case "Expression": {
        const variableName = `txt_${counter++}`;
        const expressionStr = escodegen.generate(node.expression);
        code.variables.push(variableName);
        code.create.push(`${variableName} = text(${expressionStr})`);
        code.create.push(`append(${parent}, ${variableName});`);

        // 更新
        const names = extract_names(node.expression); // todo extract_names
        if (names.some((name) => analysis.willChange.has(name))) {
          const changes = new Set();
          names.forEach((name) => {
            if (analysis.willChange.has(name)) {
              changes.add(name);
            }
          });
          let condition;
          if (changes.size > 1) {
            condition = `${JSON.stringify(
              Array.from(changes)
            )}.some(name => changed.includes(name))`;
          } else {
            condition = `changed.includes('${Array.from(changes)[0]}')`;
          }
          code.update.push(`if (${condition}) {
            ${variableName}.data = ${expressionStr};
          }`);
        }
        break;
      }
      case "IfBlock": {
        const variableName = `if_block_${counter++}`;
        const funcName = `${variableName}_func`;
        const funcCallName = `${funcName}_call`;
        const expressionStr = escodegen.generate(node.expression);
        code.variables.push(variableName);
        code.variables.push(funcName);
        code.variables.push(funcCallName);
        code.create.push(`${funcName} = () => {`);

        code.create.push(`if (${expressionStr}) {
          if (${funcCallName}) {return;}
        `);
        code.create.push(`
          ${variableName} = element('span');
        `);
        node.children.forEach((subNode) => {
          traverse(subNode, variableName);
        });
        code.create.push(`append(${parent}, ${variableName})`);

        code.destroy.push(`detach(${variableName})`);

        code.create.push(`
          ${funcCallName} = true;
        } else {
          ${funcCallName} = false;
        `);
        code.create.push(`if (${variableName}) {detach(${variableName})}`);
        code.create.push("}}");

        code.create.push(`${funcName}()`); // call function
        code.update.push(`${funcName}()`);

        break;
      }
    }
  }

  ast.html.forEach((fragment) => traverse(fragment, "target"));

  const { rootScope, map } = analysis;
  let currentScope = rootScope;
  estreewalker.walk(ast.script, {
    enter(node, parent) {
      if (map.has(node)) {
        currentScope = map.get(node);
      }
      if (
        node.type === "UpdateExpression" ||
        node.type === "AssignmentExpression"
      ) {
        const names = periscopic
          .extract_names(
            node.type === "UpdateExpression" ? node.argument : node.left
          )
          .filter(
            (name) =>
              currentScope.find_owner(name) === rootScope &&
              analysis.willUseInTemplate.has(name)
          );
        if (names.length > 0) {
          this.replace({
            // todo
            type: "SequenceExpression",
            expressions: [
              node,
              acorn.parseExpressionAt(`update(${JSON.stringify(names)})`, 0, {
                ecmaVersion: 2023,
              }),
            ],
          });
          this.skip(); // todo
        }
      }
    },
    leave(node) {
      if (map.has(node)) {
        currentScope = currentScope.parent;
      }
    },
  });

  return `
      function element(name) {
        return document.createElement(name);
      }

      function text(data) {
        return document.createTextNode(data);
      }

      function append(target, node) {
        target.appendChild(node);
      }

      function detach(node) {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }

      export function listen(node, event, handler) {
        node.addEventListener(event, handler);
        return () => node.removeEventListener(event, handler);
      }

      export default function() {
        ${code.variables.map((v) => `let ${v};`).join("\n")}
        
        let collectChanges = [];
        let updateCalled = false;
        function update(changed) {
          changed.forEach(c => collectChanges.push(c));

          if (updateCalled) return;
          updateCalled = true;

          if (typeof lifecycle !== 'undefined') {
            lifecycle.update(collectChanges);
          }
          collectChanges = [];
          updateCalled = false;
        }
        ${escodegen.generate(ast.script)}

        var lifecycle = {
          create(target) {
            ${code.create.join("\n")}
          },
          update(changed) {
            ${code.update.join("\n")}
          },
          destroy(target) {
            ${code.destroy.join("\n")}
          }
        };
        return lifecycle;
      }
    `;
}

buildAppJs();
