import { BufferedGraphicsContext } from "graphics";
import SSD1306 from "./ssd1306-i2c";

enum Input {
  A = 24,
  B = 27,
  UP = 4,
  DOWN = 6,
  LEFT = 3,
  RIGHT = 5,
}

const Speaker = 28;

export default class Thumby {
  static Speaker = Speaker;
  static Input = Input;
  static Button = class Button {
    pin: Input;
    private lastState: boolean = false;

    constructor(pin: Input) {
      this.pin = pin;
    }

    get value() {
      return digitalRead(this.pin);
    }

    pressed(): boolean {
      return !!(1 - this.value);
    }

    justPressed() {
      let returnValue = false;
      const currentState = this.pressed;
      if (!this.lastState && currentState) returnValue = true;
      this.lastState = currentState();
      return returnValue;
    }
  };

  lcd: SSD1306;
  gc: BufferedGraphicsContext;
  buttons: { [key in Lowercase<keyof typeof Input>]: Thumby.Button };

  constructor() {
    pinMode(
      [Input.A, Input.B, Input.UP, Input.DOWN, Input.LEFT, Input.RIGHT],
      INPUT_PULLUP
    );

    const i2c = board.i2c(0, { sda: 16, scl: 17, baudrate: 1000000 });
    this.lcd = new SSD1306(i2c, { width: 72, height: 40, rst: 18 });

    this.gc = this.lcd.getContext();
    this.gc.clearScreen();
    this.gc.display();

    this.buttons = {
      a: new Thumby.Button(Input.A),
      b: new Thumby.Button(Input.B),
      up: new Thumby.Button(Input.UP),
      down: new Thumby.Button(Input.DOWN),
      left: new Thumby.Button(Input.LEFT),
      right: new Thumby.Button(Input.RIGHT),
    };
  }

  button(key: Input): Thumby.Button {
    const inputKey = Input[key].toLowerCase() as Lowercase<keyof typeof Input>;
    return this.buttons[inputKey];
  }

  tone(freq: number, duration: number) {
    tone(Speaker, freq, { duration });
  }
}

declare namespace Thumby {
  type Button = typeof Thumby.Button.prototype;
}
