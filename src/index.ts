import Thumby from "./thumby";
import Plane from "./plane";

class Game extends Thumby {
  plane: Plane;

  setup() {
    super.setup();
    this.plane = new Plane();
  }

  start() {
    this.setup();
    this.intro();
    this.play();
  }

  intro() {
    let sx = 7;
    let sy = 2;
    let timer = 0;

    while (!this.input(Thumby.Input.A)) {
      timer += 1;
      const t0 = millis();

      const angle = 22.5 * Math.round(4 * Math.sin(timer / 12));
      const bitmap = this.plane.bitmap(angle);
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
      } else if (Math.floor(timer / 30) % 2 == 0) {
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
        tinyPlane.substring(0, Math.floor(timer / 5))
      );
      this.gc.display();

      const t1 = millis();
      delay(1000 / 30 - (t1 - t0));
    }
  }

  play() {}
}

const game = new Game();
game.start();
