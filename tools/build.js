const esbuild = require("esbuild");
const pngPlugin = require("./png-to-json-plugin");

const kalumaModules = [
  "adc",
  "at",
  "button",
  "dgram",
  "events",
  "gpio",
  "graphics",
  "http",
  "i2c",
  "led",
  "net",
  "pwm",
  "rp2",
  "spi",
  "stream",
  "uart",
  "url",
  "wifi",
];

esbuild
  .build({
    bundle: true,
    entryPoints: ["src/index.ts"],
    external: kalumaModules,
    outfile: "dist/bundle.js",
    platform: "node",
    plugins: [pngPlugin],
    sourcemap: true,
  })
  .catch(() => process.exit(1));
