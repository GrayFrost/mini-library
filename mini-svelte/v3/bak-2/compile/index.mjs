import parse from './parse.mjs';
import Component from './Component.mjs';
import render_dom from './render_dom.mjs';

export default function compile(source, options = {}) {
  console.log('zzh parse', parse);
  const ast = parse(source, options);
  console.log('zzh ast', ast);
  const component = new Component(ast, source, options);
  const result = render_dom(component, options);
  return component.generate(result);
}