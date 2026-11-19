// DEVELOPMENT NOTE: THIS IS FULLY OPTIMIZED WORKING CSS PATTERN
const ROOT = "ytd-mini-guide-renderer"
const SELECTOR = `ytd-mini-guide-entry-renderer:has(a#endpoint[href="/feed/subscriptions"])`
const HIDING_CSS = `
    ${SELECTOR} {
        display: none !important;
    }
`

let styleElement: HTMLStyleElement | null = null;
let observer: MutationObserver | null = null;
let observedRoot: Element | null = null;
let removalScheduled = false;

const removeSubscriptionsButton = (): void => {
    removalScheduled = false;

    if (!observedRoot?.isConnected) {
        observedRoot = document.querySelector(ROOT);
    }

    // Not on a watch page right now, so do not do anything
    if (!observedRoot) return;

    for (const descriptionElement of observedRoot.querySelectorAll(SELECTOR)) {
        descriptionElement.remove();
    }
};

const scheduleRemoval = (): void => {
    if (removalScheduled) return;

    removalScheduled = true;
    queueMicrotask(removeSubscriptionsButton);
};

const onDomMutations = (records: MutationRecord[]): void => {
    /* 
    Sorry for that horrible comments
    
    onDomMutations only reacts when nodes were added, which means 
    removals and attribute changes don't trigger a re-scan. 
    
    Sometimes YouTube can add the description element dynamically after initial paint, 
    so the observer catches that insertion and starts a removal process,
    so everything is being kept clean.
    */

    if (records.some((record) => record.addedNodes.length > 0)) {
        scheduleRemoval();
    }
};

const setStyleElement = (enabled: boolean): void => {
    if (!enabled) {
        styleElement?.remove();
        styleElement = null;
        return;
    }

    if (styleElement?.isConnected) {
        return;
    }

    styleElement = document.createElement("style");
    styleElement.textContent = HIDING_CSS;
    (document.head ?? document.documentElement).append(styleElement);
};

const disconnectObserver = (): void => {
    observer?.disconnect();
    observer = null;
    observedRoot = null;
    removalScheduled = false;
};

export const initSubcriptionsButtonHider = (enabled: boolean): void => {
    setStyleElement(enabled);

    if (!enabled) {
        disconnectObserver();
        return;
    }

    const root = document.querySelector(ROOT);

    if (root === observedRoot && root?.isConnected) {
        removeSubscriptionsButton();
        return;
    }

    disconnectObserver();

    if (!root) {
        return;
    }

    observedRoot = root;
    observer = new MutationObserver(onDomMutations);
    observer.observe(root, { childList: true, subtree: true });
    removeSubscriptionsButton();
};
