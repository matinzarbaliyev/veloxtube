// DEVELOPMENT NOTE: THIS IS FULLY OPTIMIZED WORKING CSS PATTERN

const ROOT = "ytd-watch-metadata"
// Selector for querySelectorAll and building the style rule
const SHARE_SELECTOR = `${ROOT} #top-level-buttons-computed > yt-button-view-model:has([aria-label='Share'])`

// Full CSS rule for the injection style tag
const HIDING_CSS = `
    ${SHARE_SELECTOR} {
        display: none !important;
    }
`;

let styleElement: HTMLStyleElement | null = null;
let observer: MutationObserver | null = null;
let observedRoot: Element | null = null;
let scheduled = false;

const removeShareButton = (): void => {
    scheduled = false;

    if (!observedRoot?.isConnected) {
        observedRoot = document.querySelector(ROOT);
    }

    if (!observedRoot) return;

    // Use SHARE_SELECTOR here instead of HIDING_CSS
    for (const joinButton of observedRoot.querySelectorAll(SHARE_SELECTOR)) {
        joinButton.remove();
    }
};

const scheduleDetach = (): void => {
    if (scheduled) return;

    scheduled = true;
    queueMicrotask(removeShareButton);
};

const onMutations = (records: MutationRecord[]): void => {
    if (records.some((record) => record.addedNodes.length > 0)) {
        scheduleDetach();
    }
};

const setStyles = (enabled: boolean): void => {
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

const stopObserving = (): void => {
    observer?.disconnect();
    observer = null;
    observedRoot = null;
    scheduled = false;
};

export const initVideoShareButtonHider = (enabled: boolean): void => {
    setStyles(enabled);

    if (!enabled) {
        stopObserving();
        return;
    }

    const root = document.querySelector(ROOT);

    if (root === observedRoot && root?.isConnected) {
        removeShareButton();
        return;
    }

    stopObserving();

    if (!root) {
        return;
    }

    observedRoot = root;
    observer = new MutationObserver(onMutations);
    observer.observe(root, { childList: true, subtree: true });
    removeShareButton();
};
