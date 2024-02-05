import { walk } from 'estree-walker';
import { print, b } from 'code-red';
import { clone } from './utils.mjs';
import { Fragment } from './Node.mjs';

export default class Component {
  name;
  ast;
  source;
  fragment;
  compile_options;
  vars = [];

  constructor(ast, source, compile_options) {
    this.name = {type: 'Identifier', name: 'TODO'};
    this.ast = ast;
    this.source = source;
    this.compile_options = compile_options;

    this.original_ast = clone({
			html: ast.html,
			instance: ast.instance,
		});

    this.walk_module_js();
    this.walk_instance_js_pre_template(); // todo不用？
    this.fragment = new Fragment(this, ast.html);
    this.walk_instance_js_post_template();
  }
  generate(result){
    let js = null;
    if (result) {
      const { compile_options, name } = this;
      const program = { type: 'Program', body: result.js };
      walk(program, {
        enter:() => {}
      });

      js = print(program)
    }
    return {
      js,
      ast: this.original_ast,
      vars: this.get_vars_report(),
    }
  }
  walk_module_js() {}
  walk_instance_js_pre_template() {}
  walk_instance_js_post_template() {
    const script = this.ast.instance;
    if (!script) {
      return;
    }
    this.post_template_walk();
    //this.hoist_instance_declarations(); todo
		// this.extract_reactive_declarations(); todo
  }
  post_template_walk() {

  }
  get_vars_report() {}
}