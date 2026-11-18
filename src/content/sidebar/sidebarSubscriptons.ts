function injectStyle(css: string): void {
    const style = document.createElement("style")
    style.textContent = css
    document.head.appendChild(style)
}

const HIDING_CSS = `
    ytd-guide-section-renderer:has(ytd-guide-collapsible-section-entry-renderer a[href="/feed/subscriptions"]
    ) {
        display: none !important;
    }
`

export const initSubcriptionsMenuHider = (enabled: boolean): void => {

    if (enabled) {
        injectStyle(HIDING_CSS)
    }
};