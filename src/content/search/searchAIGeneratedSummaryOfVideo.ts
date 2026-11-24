import { rememberRemoval } from "../shared/removalRegistry";

// DEVELOPMENT NOTE: THIS IS FULLY OPTIMIZED WORKING CSS PATTERN
const ROOT = "ytd-expandable-metadata-renderer";
const SELECTOR = ":has(video-summary-content-view-model)";
const MATCH = `${ROOT}${SELECTOR}`;
const FEATURE_KEY = "searchAIGeneratedSummariesEnabled";

const HIDING_CSS = `
    ${MATCH} {
        display: none !important;
    }
`

let styleElement: HTMLStyleElement | null = null;
let observer: MutationObserver | null = null;
let observedRoot: Element | null = null;
let scheduled = false;

const removeAISummarizationFromSearchFeed = (): void => {
    scheduled = false;

    const matches = document.querySelectorAll<Element>(MATCH);

    for (const summarization of matches) {
        rememberRemoval(FEATURE_KEY, summarization);
    }
};

const scheduleRemoval = (): void => {
    if (scheduled) return;

    scheduled = true;
    queueMicrotask(removeAISummarizationFromSearchFeed);
};

const onMutations = (records: MutationRecord[]): void => {
    if (records.some((record) => record.addedNodes.length > 0)) {
        scheduleRemoval();
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

export const initSearchAIGeneratedSummariesHider = (enabled: boolean): void => {
    setStyles(enabled);

    if (!enabled) {
        stopObserving();
        return;
    }

    const root = document.body;

    if (root === observedRoot && root?.isConnected) {
        removeAISummarizationFromSearchFeed();
        return;
    }

    stopObserving();

    if (!root) {
        return;
    }

    observedRoot = root;
    observer = new MutationObserver(onMutations);
    observer.observe(root, { childList: true, subtree: true });
    removeAISummarizationFromSearchFeed();
};
