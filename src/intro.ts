import { GraphicsBitmap } from "graphics";
import { Scene, Game } from "./game";
import plane from "./plane";
import TinyPlane from "./tinyplane";

export default class Intro implements Scene<TinyPlane> {
  private sx = 7;
  private sy = 2;
  private timer = 0;
  private bitmap!: GraphicsBitmap;

  update(game: Game<TinyPlane>) {
    this.timer += 1;
    const t0 = millis();

    const angle = 22.5 * Math.round(4 * Math.sin(this.timer / 12));
    this.bitmap = plane(angle);

    if (this.sy - this.bitmap.height / 2 < game.gc.getHeight()) {
      const angleRadians = ((90 - angle) * Math.PI) / 180;
      this.sx += 2 * Math.cos(angleRadians);
      this.sy += 0.1 + 2 * Math.sin(angleRadians);
    }

    if (game.buttons.a.pressed) {
      game.change(TinyPlane.PLAY);
    }
  }

  draw(game: Game<TinyPlane>) {
    game.gc.clearScreen();
    if (this.sy - this.bitmap.height / 2 < game.gc.getHeight()) {
      game.gc.drawBitmap(
        this.sx - this.bitmap.width / 2,
        this.sy - this.bitmap.height / 2,
        this.bitmap
      );
    } else if (Math.floor(this.timer / 30) % 2 == 0) {
      const start = "start";
      const startSize = game.gc.measureText(start);
      game.gc.drawText(
        (game.gc.getWidth() - startSize.width) >> 1,
        game.gc.getHeight() - startSize.height,
        start
      );
    }

    const tinyPlane = "TinyPlane";
    const tinyPlaneSize = game.gc.measureText(tinyPlane);
    game.gc.drawText(
      (game.gc.getWidth() - tinyPlaneSize.width) >> 1,
      (game.gc.getHeight() - tinyPlaneSize.height) >> 1,
      tinyPlane.substring(0, Math.floor(this.timer / 5))
    );
    game.gc.display();
  }
}
