export class Clipboard {
    constructor(private document: Document) {

    }

    /** Copies given text to Clipboard. Uses an off-screen textarea element to access the clipboard */
    copy(text: string) {
        let document = this.document;
        // Text area preserves line breaks
        let textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.top = "0px";
        textarea.style.left = "0px";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }
}
