import read_expression from "./read.mjs";

const regex_whitespace_or_slash_or_closing_tag = /(\s|\/|>)/;

function read_attribute(parser) {
  const start = parser.index;
  if (parser.eat('{')) {
    const value_start = parser.index;
    const name = parser.read_identifier();
    parser.allow_whitespace();
		parser.eat('}');
    return {
      start,
      end: parser.index,
      type: 'Attribute',
      name,
      value: [
        {
          start: value_start,
          end: value_start + name.length,
          type: 'AttributeShorthand',
          expression: {
            start: value_start,
            end: value_start + name.length,
            type: 'Identifier',
            name
          }
        }
      ]
    }
  }
}

function read_tag_name(parser) {
  const start = parser.index;
  const name = parser.read_until(regex_whitespace_or_slash_or_closing_tag);
  return name
}

function tag(parser) {
  const start = parser.index;
  parser.index += 1;
  let parent = parser.current();
  const name = read_tag_name(parser);
  const type = 'Element';
  const element = {
    start,
    end: null,
    type,
    name,
    attributes: [],
    children: []
  }
  parser.allow_whitespace();
}

function mustache(parser) {
  const start = parser.index;
  parser.index += 1;
  parser.allow_whitespace();
  // {/if}
  if (parser.eat('/')) {
    let block = parser.current();
    let expected = 'if';
    parser.eat(expected);
    parser.allow_whitespace();
		parser.eat('}');

    // trim_whitespace(block, trim_before, trim_after); todo
    block.end = parser.index;
		parser.stack.pop();
  } else if (parser.eat('#')) { // {#if}
    let type;
    if (parser.eat('if')) {
      type = 'IfBlock';
    }
    parser.require_whitespace();
    const expression = read_expression(parser);
    const block = {
      start,
      end: null,
      type,
      expression,
      children: []
    }
    parser.eat('}');
    parser.current().children.push(block);
    parser.stack.push(block);
  } else {
    const expression = read_expression(parser);
		parser.allow_whitespace();
		parser.eat('}', true);
		parser.current().children.push({
			start,
			end: parser.index,
			type: 'MustacheTag',
			expression
		});
  }
}

function text(parser) {
  const start = parser.index;
  
  let data = '';

  while (parser.index < parser.template.length && !parser.match('<') && !parser.match('{')) {
		data += parser.template[parser.index++];
	}

  const node = {
    start,
    end: parser.index,
    type: 'Text',
    raw: data,
    // data: decode_character_references(data, false) todo
  };
  parser.current().children.push(node);
}

export default function fragment(parser) {
  if (parser.match('<')) {
    return tag;
  }

  if (parser.match('{')) {
    return mustache;
  }

  return text;
}