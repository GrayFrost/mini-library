// 遍历 ast //可以参考estree-walk
function walk(ast, { enter, leave }) {
  if (!ast || !ast.children || ast.children.length === 0) {
    leave(ast);
  } else if (ast.type === 'text' || ast.type === 'mustache') {
    leave(ast);
  } else { // type Element
    ast.children.forEach(node => {
      node.parent = ast;
      enter(node);
      walk(node, { enter, leave });
    });
    leave(ast);
  }
}

module.exports = walk;