import { EventEmitter } from "events";

export { }

declare global {
  interface ButtonOptions {
    mode?: PinMode
    event?: PinEvent
    debounce?: number
  }

  interface ButtonEvents {
    click: () => void
  }

  class Button extends EventEmitter<ButtonEvents> {
    constructor(pin: number, options?: ButtonOptions)
    read(): number
    close(): void
  }
}
