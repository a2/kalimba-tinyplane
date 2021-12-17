import { BufferedGraphicsContext, GraphicsContextRotation } from "graphics";
import { I2C } from "i2c";

interface SSD1306Options {
  width?: number
  height?: number
  rst?: number
  address?: number
  extVcc?: boolean
  rotation?: GraphicsContextRotation
}

/**
 * SSD1306 class
 */
export default class SSD1306 {
  i2c: I2C
  width: number
  height: number
  rst: number
  address: number
  extVcc: boolean
  rotation: GraphicsContextRotation
  context: BufferedGraphicsContext

  /**
   * Setup SSD1306
   * @param i2c
   * @param options
   */
  setup(i2c: I2C, { width = 128, height = 64, rst = -1, address = 0x3C, extVcc = false, rotation = 0 }: SSD1306Options) {
    this.i2c = i2c;
    this.width = width;
    this.height = height;
    this.rst = rst;
    this.address = address;
    this.extVcc = extVcc;
    this.rotation = rotation;
    this.context = null;
    if (this.rst > -1) pinMode(this.rst, OUTPUT);
    this.reset();
    var initCmds = new Uint8Array([
      0xAE, // 0 disp off
      0xD5, // 1 clk div
      0x80, // 2 suggested ratio
      0xA8, this.height - 1, // 3 set multiplex, height-1
      0xD3, 0x00, // 5 display offset (no-offset)
      0x40, // 7 start line (line #0)
      0x8D, this.extVcc ? 0x10 : 0x14, // 8 charge pump
      0x20, 0x00, // 10 memory mode
      0xA1, // 12 seg remap 1
      0xC8, // 13 comscandec
      0xDA, this.width > 2 * this.height ? 0x02 : 0x12, // 14 set compins
      0x81, this.extVcc ? 0x9F : 0xCF, // 16 set contrast
      0xD9, this.extVcc ? 0x22 : 0xF1, // 18 set precharge
      0xDB, 0x40, // 20 set vcom detect
      0xA4, // 22 display all on
      0xA6, // 23 display normal (non-inverted)
      0x2E, // 24 deactivate scroll
      0xAD, 0x30,
      0xAF, // 25 disp on
    ]);
    this.sendCommands(initCmds);
    delay(50);
  }

  private sendCommands(cmds: Uint8Array) {
    cmds.forEach(c => this.i2c.write(new Uint8Array([0, c]), this.address));
  }

  /**
   * Reset
   */
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

  /**
   * Return a graphic context
   * @return {GraphicContext}
   */
  getContext() {
    if (!this.context) {
      this.context = new BufferedGraphicsContext(this.width, this.height, {
        rotation: this.rotation,
        bpp: 1,
        display: (buffer) => {
          var x0 = 0;
          var x1 = this.width - 1;
          if (this.width !== 128) {
            var colOffset = (128 - this.width) >> 1
            x0 += colOffset;
            x1 += colOffset;
          }
          var cmds = new Uint8Array([
            0x22, // pages
            0, (this.height >> 3) - 1,
            0x21, // columns
            x0, x1
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
        }
      });
    }
    return this.context;
  }

  /**
   * Turn on
   */
  on() {
    this.i2c.write(new Uint8Array([0, 0xAF]), this.address);
  }

  /**
   * Turn off
   */
  off() {
    this.i2c.write(new Uint8Array([0, 0xAE]), this.address);
  }

  /**
   * Set contrast
   */
  setContrast(c: number) {
    this.i2c.write(new Uint8Array([0, 0x81, c]), this.address);
  }
}
