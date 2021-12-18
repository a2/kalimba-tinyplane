import {
  BufferedGraphicsContext,
  GraphicsContext,
  GraphicsContextRotation,
} from "graphics";
import { I2C } from "i2c";

interface SSD1306Options {
  width?: number;
  height?: number;
  rst?: number;
  address?: number;
  extVcc?: boolean;
  rotation?: GraphicsContextRotation;
}

/** SSD1306 class */
export default class SSD1306 {
  private i2c: I2C;
  private width: number;
  private height: number;
  private rst: number;
  private address: number;
  private extVcc: boolean;
  private rotation: GraphicsContextRotation;
  private context?: BufferedGraphicsContext;

  constructor(
    i2c: I2C,
    {
      width = 128,
      height = 64,
      rst = -1,
      address = 0x3c,
      extVcc = false,
      rotation = 0,
    }: SSD1306Options
  ) {
    this.i2c = i2c;
    this.width = width;
    this.height = height;
    this.rst = rst;
    this.address = address;
    this.extVcc = extVcc;
    this.rotation = rotation;
    if (this.rst > -1) pinMode(this.rst, OUTPUT);
    this.reset();

    const initCmds = new Uint8Array([
      0xae, // 0 disp off
      0xd5, // 1 clk div
      0x80, // 2 suggested ratio
      0xa8,
      this.height - 1, // 3 set multiplex, height-1
      0xd3,
      0x00, // 5 display offset (no-offset)
      0x40, // 7 start line (line 0)
      0x8d,
      this.extVcc ? 0x10 : 0x14, // 8 charge pump
      0x20,
      0x00, // 10 memory mode
      0xa1, // 12 seg remap 1
      0xc8, // 13 comscandec
      0xda,
      this.width > 2 * this.height ? 0x02 : 0x12, // 14 set compins
      0x81,
      this.extVcc ? 0x9f : 0xcf, // 16 set contrast
      0xd9,
      this.extVcc ? 0x22 : 0xf1, // 18 set precharge
      0xdb,
      0x40, // 20 set vcom detect
      0xa4, // 22 display all on
      0xa6, // 23 display normal (non-inverted)
      0x2e, // 24 deactivate scroll
      0xad,
      0x30,
      0xaf, // 25 disp on
    ]);
    this.sendCommands(initCmds);

    delay(50);
  }

  sendCommands(cmds: Uint8Array) {
    cmds.forEach((c) => this.i2c.write(new Uint8Array([0, c]), this.address));
  }

  /** Reset */
  reset() {
    if (this.rst > -1) {
      pinMode(this.rst, OUTPUT);
      digitalWrite(this.rst, HIGH);
      delay(1);
      digitalWrite(this.rst, LOW);
      delay(10);
      digitalWrite(this.rst, HIGH);
    }
  }

  /** Returns the display's graphic context */
  getContext(): BufferedGraphicsContext {
    if (!this.context) {
      this.context = new BufferedGraphicsContext(this.width, this.height, {
        rotation: this.rotation,
        bpp: 1,
        display: (buffer) => {
          var x0 = 0;
          var x1 = this.width - 1;
          if (this.width !== 128) {
            var colOffset = (128 - this.width) >> 1;
            x0 += colOffset;
            x1 += colOffset;
          }
          var cmds = new Uint8Array([
            0x22, // pages
            0,
            (this.height >> 3) - 1,
            0x21, // columns
            x0,
            x1,
          ]);
          this.sendCommands(cmds);
          var WIRE_MAX = 128;
          for (var i = 0; i < buffer.byteLength; i += WIRE_MAX) {
            var count = Math.min(WIRE_MAX, buffer.byteLength - i);
            var chunk = new Uint8Array(count + 1);
            chunk[0] = 0x40;
            chunk.set(new Uint8Array(buffer.buffer, i, count), 1);
            this.i2c.write(chunk, this.address);
          }
        },
      });
    }
    return this.context;
  }

  /** Turn display on */
  on() {
    this.i2c.write(new Uint8Array([0, 0xaf]), this.address);
  }

  /** Turn display off */
  off() {
    this.i2c.write(new Uint8Array([0, 0xae]), this.address);
  }

  /** Set display contrast */
  setContrast(c: number) {
    this.i2c.write(new Uint8Array([0, 0x81, c]), this.address);
  }
}
