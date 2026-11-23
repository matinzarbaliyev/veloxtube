document.documentElement.dataset.theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"

const KEYS = [

    // ===== HOME PAGE ===== //
    "homeShortsEnabled",
    "homeYoutubeFeaturedEnabled",
    "homeHomeFeedEnabled",
    "homeSubscriptionsButtonEnabled",
    "homeYoutubePlayablesEnabled",
    "homeTopicBarEnabled",
    // ====================== //


    // ===== SEARCH PAGE ===== //
    "searchShortsEnabled",
    "searchTopicBarEnabled",
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
    "channelWallpaperEnabled",
    "channelFeaturedContentEnabled",
    "channelShortsEnabled",


    "moreFromYouTubeEnabled",
    "exploreMenuEnabled",
    "sidebarSubscriptionsMenuEnabled",

    "inFeedAdsEnabled",
] as const

type Key = (typeof KEYS)[number]


const THEME_KEY = "themePreference" as const
const LEGACY_THEME_KEY = "lightThemeEnabled" as const
const THEME_DEFAULT = "system" as const

type ThemePreference = "system" | "light" | "dark"


const DEFAULTS: Record<Key, boolean> = {

    // =========== HOME PAGE =========== //
    homeShortsEnabled: false,
    homeYoutubeFeaturedEnabled: false,
    homeHomeFeedEnabled: false,
    homeSubscriptionsButtonEnabled: false,
    homeYoutubePlayablesEnabled: false,
    homeTopicBarEnabled: false,
    // ================================== //



    // =========== SEARCH PAGE =========== //
    searchShortsEnabled: false,
    searchTopicBarEnabled: false,
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
    channelWallpaperEnabled: false,
    channelFeaturedContentEnabled: false,


    moreFromYouTubeEnabled: false,
    exploreMenuEnabled: false,
    sidebarSubscriptionsMenuEnabled: false,
    channelShortsEnabled: false,

    inFeedAdsEnabled: false,
}

const getInput = (id: string): HTMLInputElement => {
    const input = document.getElementById(id)

    if (!(input instanceof HTMLInputElement)) {
        throw new Error(`Missing popup input: ${id}`)
    }

    return input
}

const getSelect = (id: string): HTMLSelectElement => {
    const select = document.getElementById(id)

    if (!(select instanceof HTMLSelectElement)) {
        throw new Error(`Missing popup select: ${id}`)
    }

    return select
}

const inputs = KEYS.map((key) => [key, getInput(key)] as const)

const themeSelect = getSelect(THEME_KEY)

const applyTheme = (preference: ThemePreference): void => {
    const isDark =
        preference === "dark" ||
        (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    document.documentElement.dataset.theme = isDark ? "dark" : "light"
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

void browser.storage.local.get([THEME_KEY, LEGACY_THEME_KEY]).then((stored) => {
    const saved = stored[THEME_KEY] as ThemePreference | undefined
    const legacy = stored[LEGACY_THEME_KEY] as boolean | undefined
    let preference: ThemePreference = saved ?? THEME_DEFAULT

    if (saved === undefined && legacy !== undefined) {
        preference = legacy ? "light" : "dark"
    }

    applyTheme(preference)
    themeSelect.value = preference
})

themeSelect.addEventListener("change", () => {
    const preference = themeSelect.value as ThemePreference

    applyTheme(preference)
    void browser.storage.local.set({ [THEME_KEY]: preference })
})
