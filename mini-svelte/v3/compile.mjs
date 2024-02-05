import * as fs from "fs";
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import compile from './compile/index.mjs';


const modulePath = dirname(fileURLToPath(import.meta.url));

async function bootstrap() {
  try {
    const inputPath = resolve(modulePath, "./app.svelte")
    const outputPath = resolve(modulePath, "./app.js")
    const content = fs.readFileSync(inputPath, "utf-8");
    compile(content);
    // fs.writeFileSync(outputPath, compile(content), "utf-8");
    // const compiledContent = fs.readFileSync(outputPath, "utf-8");
    // const prettierContent = await prettier.format(compiledContent, {parser: 'babel'});
    // fs.writeFileSync(outputPath, prettierContent, "utf-8");
  } catch (e) {
    console.error(e);
  }
}

bootstrap();