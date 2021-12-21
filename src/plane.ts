import plane000 from "../assets/plane-000.png";
import plane225 from "../assets/plane-225.png";
import plane450 from "../assets/plane-450.png";
import plane675 from "../assets/plane-675.png";
import plane900 from "../assets/plane-900.png";

/**
 * Returns the sprite bitmap whose angle is closest to the argument
 * @param angle in degress, between 0 and 90
 */
export default function plane(angle: number) {
  if (angle < 0) angle = 0;
  if (angle > 90) angle = 90;
  return [plane000, plane225, plane450, plane675, plane900][
    Math.floor(angle / 22.5)
  ];
}
