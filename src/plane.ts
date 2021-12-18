import { GraphicsBitmap } from "graphics";

import plane1 from "../assets/plane-1.png";
import plane2 from "../assets/plane-2.png";
import plane3 from "../assets/plane-3.png";
import plane4 from "../assets/plane-4.png";
import plane5 from "../assets/plane-5.png";
import plane6 from "../assets/plane-6.png";
import plane7 from "../assets/plane-7.png";
import plane8 from "../assets/plane-8.png";
import plane9 from "../assets/plane-9.png";

/**
 * Returns the sprite bitmap whose angle is closest to the argument
 * @param angle in degress
 */
export default function plane(angle: number): GraphicsBitmap {
  if (angle < -90) angle = -90;
  if (angle > 90) angle = 90;
  return [
    plane1,
    plane2,
    plane3,
    plane4,
    plane5,
    plane6,
    plane7,
    plane8,
    plane9,
  ][Math.floor(angle / 22.5) + 4];
}
