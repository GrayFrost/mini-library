import TemplateScope from "./Scope.mjs";

export default class Node {
  start;
  end;
  component;
  parent;
  typeof;
  var;
  constructor(component, parent, _scope, info) {
    this.start = info.start;
    this.end = info.end;
    this.type = info.type;
    Object.defineProperties(this, {
			component: {
				value: component
			},
			parent: {
				value: parent
			}
		});
  }
}

export class Fragment extends Node {
  constructor(component, info) { // info: ast.html的信息
    const scope = new TemplateScope();
    super(component, null, scope, info);
    this.scope = scope;
  }
}