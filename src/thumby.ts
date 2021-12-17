import SSD1306 from './ssd1306-i2c';
import { BufferedGraphicsContext } from 'graphics';
import Input from './input';

const Speaker = 28;

export default class Thumby {
  static Speaker = Speaker;
  static Input = Input;

  lcd: SSD1306;
  gc: BufferedGraphicsContext

  setup() {
    pinMode(Object.values(Input), INPUT_PULLUP);

    const i2c = board.i2c(0, { sda: 16, scl: 17, baudrate: 1000000 });
    this.lcd = new SSD1306();
    this.lcd.setup(i2c, { width: 72, height: 40, rst: 18 });

    this.gc = this.lcd.getContext();
    this.gc.clearScreen();
    this.gc.display();
  }

  input(key: number) {
    return 1 - digitalRead(key);
  }

  tone(freq: number, duration: number) {
    tone(Speaker, freq, { duration });
  }
}
