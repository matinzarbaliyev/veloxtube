// DEVELOPMENT NOTE: THIS IS FULLY OPTIMIZED WORKING CSS PATTERN
const ROOT = "ytd-tabbed-page-header"
const SELECTOR = "#page-header-banner-sizer"
const HIDING_CSS = `
    ${ROOT} :has(> ${SELECTOR}) {
        display: none !important;
    }
`

let styleElement: HTMLStyleElement | null = null;
let observer: MutationObserver | null = null;
let observedRoot: Element | null = null;
let scheduled = false;

const removeChannelWallpaper = (): void => {
    scheduled = false;

    if (!observedRoot?.isConnected) {
        observedRoot = document.querySelector(ROOT);
    }

    if (!observedRoot) return;

    for (const comments of observedRoot.querySelectorAll(SELECTOR)) {
        comments.remove();
    }
};

const scheduleDetach = (): void => {
    if (scheduled) return;

    scheduled = true;
    queueMicrotask(removeChannelWallpaper);
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

export const initChannelWallpaperHider = (enabled: boolean): void => {
    setStyles(enabled);

    if (!enabled) {
        stopObserving();
        return;
    }

    const root = document.querySelector(ROOT);

    if (root === observedRoot && root?.isConnected) {
        removeChannelWallpaper();
        return;
    }

    stopObserving();

    if (!root) {
        return;
    }

    observedRoot = root;
    observer = new MutationObserver(onMutations);
    observer.observe(root, { childList: true, subtree: true });
    removeChannelWallpaper();
};
