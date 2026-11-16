const WATCH_METADATA = "ytd-watch-flexy"
const DESCRIPTION = "#description"
const HIDE_DESCRIPTION_CSS = `${WATCH_METADATA} ${DESCRIPTION} {\n    display: none !important;\n}`

let styleElement: HTMLStyleElement | null = null;
let observer: MutationObserver | null = null;
let observedRoot: Element | null = null;
let scheduled = false;

const detachDesription = (): void => {
    scheduled = false;

    if (!observedRoot?.isConnected) {
        observedRoot = document.querySelector(WATCH_METADATA);
    }

    if (!observedRoot) return;

    for (const joinButton of observedRoot.querySelectorAll(HIDE_DESCRIPTION_CSS)) {
        joinButton.remove();
    }
};

const scheduleDetach = (): void => {
    if (scheduled) return;

    scheduled = true;
    queueMicrotask(detachDesription);
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
    styleElement.textContent = HIDE_DESCRIPTION_CSS;
    (document.head ?? document.documentElement).append(styleElement);
};

const stopObserving = (): void => {
    observer?.disconnect();
    observer = null;
    observedRoot = null;
    scheduled = false;
};

export const initDesription = (enabled: boolean): void => {
    setStyles(enabled);

    if (!enabled) {
        stopObserving();
        return;
    }

    const root = document.querySelector(WATCH_METADATA);

    if (root === observedRoot && root?.isConnected) {
        detachDesription();
        return;
    }

    stopObserving();

    if (!root) {
        return;
    }

    observedRoot = root;
    observer = new MutationObserver(onMutations);
    observer.observe(root, { childList: true, subtree: true });
    detachDesription();
};
