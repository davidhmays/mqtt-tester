export default class DMElement extends HTMLElement
{
    constructor(files: ElementFiles)
    {
        super();
        this.attachShadow({ mode: "open" });
        if (files.cssText)
        {
            const stylesheet = new CSSStyleSheet();
            stylesheet.replaceSync(files.cssText);
            this.shadowRoot.adoptedStyleSheets = [stylesheet];
        }

        if (files.htmlText)
        {
            this.shadowRoot.innerHTML = files.htmlText;
        }
    }
}


type ElementFiles = {
    htmlText?: string;
    cssText?: string;
}