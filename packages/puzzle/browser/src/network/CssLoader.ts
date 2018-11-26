export class CssLoader {
    constructor(private document: Document) {

    }

    async load(cssUrl: string) {
        return new Promise((resolve, reject) => {
            let linkEl = document.createElement("link");
            linkEl.rel = "stylesheet";
            linkEl.type = "text/css";
            linkEl.href = cssUrl;
            if ('onload' in linkEl) {
                linkEl.onload = resolve;
            }
            if ('onerror' in linkEl) {
                linkEl.onerror = () => reject(new Error(`Couldn't load CSS at "${cssUrl}"`));
            }
            // document.head should be not null on supported browsers
            this.document.head!.appendChild(linkEl);
            if (!('onload' in linkEl)) {
                resolve();
            }
        });
    }
}
