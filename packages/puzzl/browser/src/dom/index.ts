/**
 * Calculate the offset of an element relative to the document
 */
export function getOffset(elem: HTMLElement) {
    let top = 0;
    let left = 0;

    do {
        top += elem.offsetTop  || 0;
        left += elem.offsetLeft || 0;
        elem = elem.offsetParent as HTMLElement;
    } while (elem);

    return {
        top,
        left
    };
}

export function contains(haystack: HTMLElement, needle: HTMLElement) {
    do {
        if (needle === haystack) {
            return true;
        }
        needle = needle.parentElement!;
    } while (needle);

    return false;
}
