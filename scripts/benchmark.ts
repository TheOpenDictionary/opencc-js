import { createConverter } from "../src/cn2t";

const text = await fetch(
  "https://raw.githubusercontent.com/weiyinfu/MaoZeDongAnthology/refs/heads/master/src/000-%E4%B8%AD%E5%9B%BD%E7%A4%BE%E4%BC%9A%E5%90%84%E9%98%B6%E7%BA%A7%E7%9A%84%E5%88%86%E6%9E%90.md",
).then((res) => res.text());

const len = [...text].length;
const loopTimes = 20;
const startTime = Date.now();
const converter = createConverter({ from: "cn", to: "hk" });

for (let i = 0; i < loopTimes; i += 1) {
  converter(text);
}

const endTime = Date.now();

console.log(`File contains ${len} characters`);
console.log(`Converted ${loopTimes} times`);
console.log(`Total time ${endTime - startTime} milliseconds`);
