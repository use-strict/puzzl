/**
 * Escapes special regex characters
 */
export function escape(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
