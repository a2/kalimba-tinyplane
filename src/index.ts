import { Game } from "./game";
import Intro from "./intro";
import Play from "./play";
import TinyPlane from "./tinyplane";

const scenes = {
  [TinyPlane.INTRO]: new Intro(),
  [TinyPlane.PLAY]: new Play(),
};

const tinyPlane = new Game<TinyPlane>(scenes, TinyPlane.INTRO);
tinyPlane.play();
