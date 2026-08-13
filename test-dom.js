const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const html = fs.readFileSync('frontend/index.html', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (err) => {
  console.error("DOM ERROR:", err);
});
virtualConsole.on("jsdomError", (err) => {
  console.error("JSDOM ERROR:", err.message);
});
virtualConsole.on("log", (...args) => {
  console.log("DOM LOG:", ...args);
});

const dom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "dangerously",
  resources: "usable",
  virtualConsole
});

setTimeout(() => {
  console.log("Done checking.");
  process.exit(0);
}, 2000);
