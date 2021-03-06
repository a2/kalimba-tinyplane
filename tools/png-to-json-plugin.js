const { Plugin } = require("esbuild");

/** @type {Plugin} */
module.exports = {
  name: "png",
  setup(build) {
    const fs = require("fs");
    const { PNG } = require("pngjs");

    build.onLoad(
      { filter: /\.png$/ },
      async (args) =>
        new Promise((resolve) => {
          fs.createReadStream(args.path)
            .pipe(new PNG())
            .on("parsed", function () {
              const page = Math.floor((this.width + 7) / 8);
              const result = Buffer.alloc(this.height * page, 0);

              for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                  const idx = (this.width * y + x) << 2;

                  const r = this.data[idx];
                  const g = this.data[idx + 1];
                  const b = this.data[idx + 2];

                  const brightness = (r + g + b) / 3;
                  if (brightness > 127) {
                    result[page * y + Math.floor(x / 8)] |= 1 << (7 - (x % 8));
                  }
                }
              }

              const object = {
                width: this.width,
                height: this.height,
                bpp: 1,
                data: result.toString("base64"),
              };

              resolve({
                contents: JSON.stringify(object),
                loader: "json",
              });
            });
        })
    );
  },
};
