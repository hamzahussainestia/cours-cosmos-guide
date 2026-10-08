/**
 * La vague du logo Coursinus, relevée sur le tracé du logo lui-même
 * (public/coursinus-logo.png) : ligne plate, creux, pic haut, creux,
 * bosse plus douce, ligne plate. Les deux extrémités sont horizontales et
 * à la même hauteur — c'est ce qui permet de la raccorder à un filet.
 *
 * Le viewBox est volontairement plus haut que le tracé (0→72 pour un tracé
 * qui va de 3 à 60) afin que les extrémités plates tombent pile au centre
 * vertical : les filets qui la prolongent s'alignent alors parfaitement.
 */
export const WAVE_PATH =
  "M 0 36 H 40 C 47 36 49 59 58 59 C 65 59 68 56 72 48 C 78 31 82 2 87 2 " +
  "C 92 2 97 31 103 44 C 108 53 111 53 116 52 C 124 49 128 19 140 19 " +
  "C 150 19 157 27 162 34 H 167";

export const WAVE_VIEWBOX = "0 0 167 72";
