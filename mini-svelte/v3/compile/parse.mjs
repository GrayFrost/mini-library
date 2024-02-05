const regex_whitespace = /\s/;

export class Parser {
  template = undefined;

  index = 0;
  stack = [];
  html = undefined;
  js = [];

  constructor(template, options) {
    if (typeof template !== 'string') {
      throw new TypeError('Template must be a string');
    }

    this.html = {
      start: null,
      end: null,
      type: 'Fragment',
      children: []
    }
    this.stack.push(this.html);

    // todo? 空白？
    if (this.html.children.length) {
      let start = this.html.children[0].start;
			while (regex_whitespace.test(template[start])) start += 1;
			let end = this.html.children[this.html.children.length - 1].end;
			while (regex_whitespace.test(template[end - 1])) end -= 1;
			this.html.start = start;
			this.html.end = end;
    }
  }
  current() {
    return this.stack[this.stack.length - 1];
  }
  match(str) {
    return this.template.slice(this.index, this.index + str.length) === str;
  }
  eat(str) {
    if (this.match(str)) {
      this.index += str.length;
      return true;
    }
    return false;
  }
  allow_whitespace() {
		while (this.index < this.template.length && regex_whitespace.test(this.template[this.index])) {
			this.index++;
		}
	}
  require_whitespace() {
		// if (!regex_whitespace.test(this.template[this.index])) {
		// 	this.error({
		// 		code: 'missing-whitespace',
		// 		message: 'Expected whitespace'
		// 	});
		// }
		this.allow_whitespace();
	}
  read_until(pattern) {
		const start = this.index;
		const match = pattern.exec(this.template.slice(start));
		if (match) {
			this.index = start + match.index;
			return this.template.slice(start, this.index);
		}
		this.index = this.template.length;
		return this.template.slice(start);
	}
  read_identifier() { // todo
    const identifier = '';
    return identifier;
  }
  // todo parser完善
}

export default function parse(template, options = {}) {
  const parser = new Parser(template, options);
  const instance_scripts = parser.js.filter((script) => script.context === 'default');

  return {
    html: parser.html,
    instance: instance_scripts[0],
  }
}