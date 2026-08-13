const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (...err) => {
  console.error("DOM ERROR:", ...err);
});
virtualConsole.on("jsdomError", (err) => {
  console.error("JSDOM ERROR:", err.message);
});
virtualConsole.on("log", (...args) => {
  console.log("DOM LOG:", ...args);
});
virtualConsole.on("warn", (...args) => {
  console.warn("DOM WARN:", ...args);
});

JSDOM.fromURL("http://localhost:8081/index.html", {
  runScripts: "dangerously",
  resources: "usable",
  virtualConsole
}).then(dom => {
  setTimeout(() => {
    console.log("Done checking.");
    process.exit(0);
  }, 2000);
});
