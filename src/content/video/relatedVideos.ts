const WATCH_METADATA = "ytd-watch-flexy"
const RELATED = "ytd-watch-next-secondary-results-renderer"
const HIDE_RELATED_CSS = `${WATCH_METADATA} ${RELATED} {\n    display: none !important;\n}`

let styleElement: HTMLStyleElement | null = null;
let observer: MutationObserver | null = null;
let observedRoot: Element | null = null;
let scheduled = false;

const detachRelatedVideos = (): void => {
    scheduled = false;

    if (!observedRoot?.isConnected) {
        observedRoot = document.querySelector(WATCH_METADATA);
    }

    if (!observedRoot) return;

    for (const joinButton of observedRoot.querySelectorAll(HIDE_RELATED_CSS)) {
        joinButton.remove();
    }
};

const scheduleDetach = (): void => {
    if (scheduled) return;

    scheduled = true;
    queueMicrotask(detachRelatedVideos);
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
    styleElement.textContent = HIDE_RELATED_CSS;
    (document.head ?? document.documentElement).append(styleElement);
};

const stopObserving = (): void => {
    observer?.disconnect();
    observer = null;
    observedRoot = null;
    scheduled = false;
};

export const initRelatedVideos = (enabled: boolean): void => {
    setStyles(enabled);

    if (!enabled) {
        stopObserving();
        return;
    }

    const root = document.querySelector(WATCH_METADATA);

    if (root === observedRoot && root?.isConnected) {
        detachRelatedVideos();
        return;
    }

    stopObserving();

    if (!root) {
        return;
    }

    observedRoot = root;
    observer = new MutationObserver(onMutations);
    observer.observe(root, { childList: true, subtree: true });
    detachRelatedVideos();
};
