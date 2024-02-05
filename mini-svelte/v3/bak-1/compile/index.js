import parse from './parse';
import Component from './Component';

export default function compile(source, options = {}) {
  const ast = parse(source, options);
  const component = new Component(ast, source, options);
  const result = render_dom(component, options);
  return component.generate(result);
}