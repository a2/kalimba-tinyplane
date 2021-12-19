import plane from "./plane";
import Thumby from "./thumby";

export default class TinyPlane extends Thumby {
  private scene?: number;
  fps = 1000 / 30;

  play() {
    this.title();
  }

  private repeatUntil(callback: (done: () => void) => void) {
    this.scene = setInterval(() => {
      callback(() => {
        clearInterval(this.scene);
        this.scene = undefined;
      });
    }, this.fps);
  }

  private title() {
    let spriteX = 7;
    let spriteY = 2;
    let frame = 0;

    this.repeatUntil((done) => {
      if (this.buttonA.pressed()) {
        done();
        this.title();
        return;
      }

      frame += 1;
      const angle = 22.5 * Math.round(4 * Math.sin(frame / 12));
      const bitmap = plane(angle);

      if (spriteY - bitmap.height / 2 < this.ctx.getHeight()) {
        const angleRadians = ((90 - angle) * Math.PI) / 180;
        spriteX += 2 * Math.cos(angleRadians);
        spriteY += 0.1 + 2 * Math.sin(angleRadians);
      }

      this.ctx.clearScreen();
      if (spriteY - bitmap.height / 2 < this.ctx.getHeight()) {
        this.ctx.drawBitmap(
          spriteX - bitmap.width / 2,
          spriteY - bitmap.height / 2,
          bitmap
        );
      } else if (Math.floor(frame / 30) % 2 == 0) {
        const start = "start";
        const startSize = this.ctx.measureText(start);
        this.ctx.drawText(
          (this.ctx.getWidth() - startSize.width) >> 1,
          this.ctx.getHeight() - startSize.height,
          start
        );
      }

      const tinyPlane = "TinyPlane";
      const tinyPlaneSize = this.ctx.measureText(tinyPlane);
      this.ctx.drawText(
        (this.ctx.getWidth() - tinyPlaneSize.width) >> 1,
        (this.ctx.getHeight() - tinyPlaneSize.height) >> 1,
        tinyPlane.substring(0, Math.floor(frame / 5))
      );
      this.ctx.display();
    });
  }
}
