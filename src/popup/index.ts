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
    "searchChannelsEnabled",
    "searchAIGeneratedSummariesEnabled",
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

    // ===== POPUP ===== //
    "reloadOnChangeEnabled",
    // ================= //
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
    searchChannelsEnabled: false,
    searchAIGeneratedSummariesEnabled: false,
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

    reloadOnChangeEnabled: true,
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
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)")

let reloadOnChange = DEFAULTS.reloadOnChangeEnabled
let currentPreference: ThemePreference = THEME_DEFAULT

const applyTheme = (preference: ThemePreference): void => {
    const isDark = preference === "dark" || (preference === "system" && darkQuery.matches)

    document.documentElement.dataset.theme = isDark ? "dark" : "light"
}

darkQuery.addEventListener("change", () => {
    if (currentPreference === "system") {
        applyTheme(currentPreference)
    }
})


const reloadTabIfEnabled = (): void => {
    if (!reloadOnChange) {
        return
    }

    void browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
        if (tab?.id !== undefined && tab.url?.startsWith("https://www.youtube.com")) {
            void browser.tabs.reload(tab.id)
        }
    })
}

void browser.storage.local.get([...KEYS]).then((stored) => {
    for (const [key, input] of inputs) {
        input.checked = (stored[key] as boolean | undefined) ?? DEFAULTS[key]
    }

    reloadOnChange =
        (stored.reloadOnChangeEnabled as boolean | undefined) ?? DEFAULTS.reloadOnChangeEnabled
})

for (const [key, input] of inputs) {
    input.addEventListener("change", () => {
        if (key === "reloadOnChangeEnabled") {
            reloadOnChange = input.checked
        }

        const saved = browser.storage.local.set({ [key]: input.checked })

        if (key !== "reloadOnChangeEnabled" && reloadOnChange) {
            void saved.then(reloadTabIfEnabled)
        }
    })
}

void browser.storage.local.get([THEME_KEY, LEGACY_THEME_KEY]).then((stored) => {
    const saved = stored[THEME_KEY] as ThemePreference | undefined
    const legacy = stored[LEGACY_THEME_KEY]
    let preference: ThemePreference = saved ?? THEME_DEFAULT

    if (saved === undefined) {
        try {
            if (typeof legacy === "boolean") {
                preference = legacy ? "light" : "dark"
                void browser.storage.local.set({ [THEME_KEY]: preference })
                void browser.storage.local.remove(LEGACY_THEME_KEY)
            }
        } catch (error) {
            console.error("VeloxTube: theme migration failed", error)
        }
    }

    currentPreference = preference
    applyTheme(preference)
    themeSelect.value = preference
})

themeSelect.addEventListener("change", () => {
    const preference = themeSelect.value as ThemePreference

    currentPreference = preference
    void browser.storage.local.set({ [THEME_KEY]: preference })
    applyTheme(preference)
})
