import { parse_expression_at } from './acorn.mjs'

export default function read_expression(parser) {
  try {
		const node = parse_expression_at(parser.template, parser.index);

		let num_parens = 0;

		for (let i = parser.index; i < node.start; i += 1) {
			if (parser.template[i] === '(') num_parens += 1;
		}

		let index = node.end;
		while (num_parens > 0) {
			const char = parser.template[index];

			if (char === ')') {
				num_parens -= 1;
			}

			index += 1;
		}

		parser.index = index;

		return node;
	} catch (err) {
		console.error(err);
	}
}