import Thumby from "./thumby";

export type SceneIndex = string | number | symbol;
export type SceneMap<Index extends SceneIndex> = {
  [key in Index]: Scene<Index>;
};

export interface Scene<Index extends SceneIndex> {
  update(game: Game<Index>): void;
  draw(game: Game<Index>): void;
}

export class Game<Index extends SceneIndex> extends Thumby {
  scenes: SceneMap<Index>;
  sceneIndex: Index;
  private frame: number;

  constructor(scenes: SceneMap<Index>, initialScene: Index) {
    super();
    this.scenes = scenes;
    this.sceneIndex = initialScene;
    this.frame = 0;
  }

  change(index: Index) {
    this.sceneIndex = index;
  }

  private update() {
    const frame = this.frame;
    const scene = this.scenes[this.sceneIndex];
    scene.update(this);
    if (this.frame === frame) {
      scene.draw(this);
      this.frame = frame + 1;
    }
  }

  play(fps = 30) {
    setInterval(() => this.update(), 1000 / fps);
  }
}
