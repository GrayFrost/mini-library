const fs = require('fs');
const path = require('path')

const compile = require('./compile');
const code = fs.readFileSync(path.resolve(__dirname, './index.svelte'), 'utf8'); // 配置utf8 否则得到buffer数据

fs.writeFileSync(path.resolve(__dirname, './compileCode.js'), compile(code)); // todo code.toString()