const KEYS = [

    // ===== HOME PAGE ===== //
    "homeShortsEnabled",
    "homeYoutubeFeaturedEnabled",
    "homeHomeFeedEnabled",
    "homeSubscriptionsButtonEnabled",
    "homeYoutubePlayablesEnabled",
    // ====================== //


    // ===== SEARCH PAGE ===== //
    "searchShortsEnabled",
    // ====================== //


    "sidebarShortsEnabled",
    "sidebarFooterEnabled",
    "topLogoEnabled",
    "notificationBellEnabled",
    "micButtonEnabled",

    // ===== VIDEO PAGE ===== //
    "videoJoinButtonEnabled",
    "videoThanksButtonEnabled",
    "videoShareButtonEnabled",
    "videoShowRelatedVideosEnabled",
    "videoShowCommentsEnabled",
    "videoShowDescriptionEnabled",
    "videoShowLiveChatEnabled",
    "videoMoreActionsEnabled",
    // ====================== //

    "channelJoinButtonEnabled",
    "topicBarEnabled",


    "moreFromYouTubeEnabled",
    "exploreMenuEnabled",
    "sidebarSubscriptionsMenuEnabled",

    "inFeedAdsEnabled",
] as const

type Key = (typeof KEYS)[number]

/*
NOTES ON THEME_KEY
    Theme is intentionally NOT in KEYS: it uses its own storage key and does not
    reload the YouTube tab - if the page reloads at every toggle switch of dark/light theme,
    the user experiene would be horrible.
    
    Besides this, declaring it as a named constant makes that explicit
    and easier for everyone to read and udnerstand the code.
*/
const THEME_KEY = "lightThemeEnabled" as const
const THEME_DEFAULT = false // dark by default


const DEFAULTS: Record<Key, boolean> = {

    // =========== HOME PAGE =========== //
    homeShortsEnabled: false,
    homeYoutubeFeaturedEnabled: false,
    homeHomeFeedEnabled: false,
    homeSubscriptionsButtonEnabled: false,
    homeYoutubePlayablesEnabled: false,
    // ================================== //



    // =========== SEARCH PAGE =========== //
    searchShortsEnabled: false,
    // ================================== //   


    sidebarShortsEnabled: false,
    sidebarFooterEnabled: false,
    topLogoEnabled: false,
    notificationBellEnabled: false,
    micButtonEnabled: false,

    // Video Page
    videoJoinButtonEnabled: false,
    videoThanksButtonEnabled: false,
    videoShareButtonEnabled: false,
    videoShowRelatedVideosEnabled: false,
    videoShowCommentsEnabled: false,
    videoShowDescriptionEnabled: false,
    videoShowLiveChatEnabled: false,
    videoMoreActionsEnabled: false,

    channelJoinButtonEnabled: false,
    topicBarEnabled: false,


    moreFromYouTubeEnabled: false,
    exploreMenuEnabled: false,
    sidebarSubscriptionsMenuEnabled: false,

    inFeedAdsEnabled: false,
}

const getInput = (id: string): HTMLInputElement => {
    const input = document.getElementById(id)

    if (!(input instanceof HTMLInputElement)) {
        throw new Error(`Missing popup input: ${id}`)
    }

    return input
}

const inputs = KEYS.map((key) => [key, getInput(key)] as const)

const themeInput = getInput(THEME_KEY)

const applyTheme = (light: boolean): void => {
    document.documentElement.dataset.theme = light ? "light" : "dark"
}

const reloadYouTubeTab = async (): Promise<void> => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true })

    if (tab?.id !== undefined && tab.url?.startsWith("https://www.youtube.com")) {
        await browser.tabs.reload(tab.id)
    }
}

void browser.storage.local.get([...KEYS]).then((stored) => {
    for (const [key, input] of inputs) {
        input.checked = (stored[key] as boolean | undefined) ?? DEFAULTS[key]
    }
})

for (const [key, input] of inputs) {
    input.addEventListener("change", () => {
        void browser.storage.local.set({ [key]: input.checked }).then(reloadYouTubeTab)
    })
}

void browser.storage.local.get("lightThemeEnabled").then((stored) => {
    const light = (stored[THEME_KEY] as boolean | undefined) ?? THEME_DEFAULT;

    themeInput.checked = light
    applyTheme(light)
})

themeInput.addEventListener("change", () => {
    applyTheme(themeInput.checked)
    void browser.storage.local.set({ [THEME_KEY]: themeInput.checked })
})
