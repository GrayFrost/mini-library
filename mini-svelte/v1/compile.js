const walk = require('./walk');
const parse = require('./parseTemplate');

function generate(content) {
  const ast = parse(content);
  console.log('ast', ast);
  let code = '';
  let varMap = new Map();
  code += `
    function append(node, target) {
      target.appendChild(node);
    }
    let fragment = document.createDocumentFragment();
  `;
  walk(ast, {
    enter: (node) => {
      if (varMap.has(node.name || node.type)) {
        varMap.set(node.name || node.type, varMap.get(node.name || node.type) + 1)
      } else {
        varMap.set(node.name || node.type, 1);
      }
      if (node.type === 'Element') {
        const varName = node.name + varMap.get(node.name);
        code += `
          let ${varName} = document.createElement("${node.name}");\n
        `;
        if (node.attrs) {
          node.attrs.forEach(attr => {
            code += `${varName}.setAttribute(${attr.name}, ${attr.value});\n`;
          })
        }
      } else if (node.type === 'Text') {
        code += `
          let t${varMap.get(node.type)} = document.createTextNode(\`${node.data.replace("\n", "\\n")}\`);\n
        `
      } else if (node.type === 'Mustache') {
        code += `
          document.createTextNode("MustacheTag");\n
        `
      }
    },
    leave: (node) => {
      if (node.type === 'Element') {
        code += `
          append(${node.name}${varMap.get(node.name)}, ${node.parent.type === 'Fragment' ? 'fragment' : `${node.parent.name}${varMap.get(node.parent.name)}`})
        `
      } else if (node.type === 'Text') {
        code += `
          append(t${varMap.get(node.type)}, ${node.parent.type === 'Fragment' ? 'fragment' : `${node.parent.name}${varMap.get(node.parent.name)}`});\n
        `;
      }
    }
  });

  code += "document.body.appendChild(fragment);";

  return code;
}

module.exports = generate;