import plane from "./plane";
import Thumby from "./thumby";

export default class TinyPlane extends Thumby {
  scene?: number;
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
    let sx = 7;
    let sy = 2;
    let frame = 0;

    this.repeatUntil((done) => {
      if (this.buttons.a.pressed()) {
        done();
        this.title();
        return;
      }

      frame += 1;
      const angle = 22.5 * Math.round(4 * Math.sin(frame / 12));
      const bitmap = plane(angle);

      if (sy - bitmap.height / 2 < this.gc.getHeight()) {
        const angleRadians = ((90 - angle) * Math.PI) / 180;
        sx += 2 * Math.cos(angleRadians);
        sy += 0.1 + 2 * Math.sin(angleRadians);
      }

      this.gc.clearScreen();
      if (sy - bitmap.height / 2 < this.gc.getHeight()) {
        this.gc.drawBitmap(
          sx - bitmap.width / 2,
          sy - bitmap.height / 2,
          bitmap
        );
      } else if (Math.floor(frame / 30) % 2 == 0) {
        const start = "start";
        const startSize = this.gc.measureText(start);
        this.gc.drawText(
          (this.gc.getWidth() - startSize.width) >> 1,
          this.gc.getHeight() - startSize.height,
          start
        );
      }

      const tinyPlane = "TinyPlane";
      const tinyPlaneSize = this.gc.measureText(tinyPlane);
      this.gc.drawText(
        (this.gc.getWidth() - tinyPlaneSize.width) >> 1,
        (this.gc.getHeight() - tinyPlaneSize.height) >> 1,
        tinyPlane.substring(0, Math.floor(frame / 5))
      );
      this.gc.display();
    });
  }
}
