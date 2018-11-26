/**
 * Squeezes val inside the [min, max] interval
 */
export function clamp(val: number, min: number, max: number) {
    return Math.min(max, Math.max(val, min));
}

/**
 * Checks that val is inside [min, max] interval
 */
export function isBetween(val: number, min: number, max: number) {
    return val >= min && val <= max;
}
