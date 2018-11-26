// Inspired by https://github.com/eldargab/load-script

export interface IScriptLoaderOptions {
    /** A boolean value used for script.async. By default this is true. */
    async?: boolean;
    /** A map of attributes to set on the script node before appending it to the DOM. By default this is empty. */
    attrs?: {[attrName: string]: string};
    /** A string value used for script.charset. By default this is utf8. */
    charset?: string;
    /** A string of text to append to the script node before it is appended to the DOM. By default this is empty. */
    text?: string;
    /** A string used for script.type. By default this is text/javascript. */
    type?: string;
}

/**
 * Loads a JavaScript file by appending a script tag in the document header
 */
export class ScriptLoader {
    constructor(private document: Document) {

    }

    load(url: string, opts: IScriptLoaderOptions = {}) {
        return new Promise<void>((resolve, reject) => {
            // document.head should be set on supported browsers
            let head = this.document.head!;
            let script = this.document.createElement("script");
            script.type = opts.type || "text/javascript";
            script.charset = opts.charset || "utf8";
            script.async = opts.async !== void 0 ? opts.async : true;
            script.src = url;

            const attrs = opts.attrs;
            if (attrs) {
                Object.keys(attrs).forEach(k => script.setAttribute(k, attrs[k]));
            }

            if (opts.text) {
                script.text = opts.text;
            }

            script.onload = () => {
                resolve();
            }
            // We create the error object here and not inside "onerror" to ensure a proper stack trace
            let err = new Error(`Failed to load script "${url}"`);
            script.onerror = () => {
                reject(err);
            }

            head.appendChild(script);
        });
    }
}
