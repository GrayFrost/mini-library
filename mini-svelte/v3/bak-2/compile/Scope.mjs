export default class TemplateScope {
  names;
  parent;
  constructor(parent) {
    this.parent = parent;
    this.names = new Set(parent ? parent.names : [])
  }

}