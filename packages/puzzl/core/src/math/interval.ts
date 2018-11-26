/** Checks if two intervals intersect */
export function intersect(i1: [number, number], i2: [number, number]) {
    return (i1[0] <= i2[0] && i1[1] >= i2[0]) || (i2[0] <= i1[0] && i2[1] >= i1[0]);
}
