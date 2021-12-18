import { Scene, Game } from "./game";
import TinyPlane from "./tinyplane";

export default class Play implements Scene<TinyPlane> {
  update(game: Game<TinyPlane>) {}
  draw(game: Game<TinyPlane>) {}
}
