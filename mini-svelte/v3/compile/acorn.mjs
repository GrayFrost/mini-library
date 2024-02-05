import * as code_red from "code-red";

export const parse = (source) =>
  code_red.parse(source, {
    sourceType: "module",
    ecmaVersion: 13,
    locations: true,
  });

export const parse_expression_at = (source, index) =>
  code_red.parseExpressionAt(source, index, {
    sourceType: "module",
    ecmaVersion: 13,
    locations: true,
  });
