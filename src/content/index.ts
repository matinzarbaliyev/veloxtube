// ======================= HOME PAGE ====================== //
import { initHomeShorts } from "./home/homeShorts"
import { initYoutubeFeaturedHider } from "./home/youtubeFeatured"
import { initHomeFeedHider } from "./home/homeReccommended"
import { initSubcriptionsButtonHider } from "./home/homeSubcriptionsButton"
import { initHomeYoutubePlayablesHider } from "./home/homeYoutubePlayables"
import { initHomeTopicBarHider } from "./home/homeTopicBar"
// ========================================================= //

// ========================= SEARCH PAGE ======================== //
import { initSearchShortsHider } from "./search/searchShorts"
import { initSearchTopicBarHider } from "./search/searchTopicBar"
import { initSearchChannelsHider } from "./search/searchChannels"
import { initSearchAIGeneratedSummariesHider } from "./search/searchAIGeneratedSummaryOfVideo"
// ============================================================== //

import { initSidebarShorts } from "./sidebar/sidebarShorts"
import { initSidebarFooter } from "./sidebar/sidebarFooter"
import { initTopLogo } from "./masthead/topLogo"
import { initNotificationBell } from "./masthead/notificationBell"
import { initMicButton } from "./masthead/micButton"

// ======================= VIDEO PAGE ====================== //
import { initVideoJoinButtonHider } from "./video/videoJoinButton"
import { initVideoThanksButton } from "./video/showSupport"
import { initVideoShareButtonHider } from "./video/videoShareButton"
import { initRelatedVideosHider } from "./video/videoRelatedVideos"
import { initVideoCommentsHider } from "./video/videoComments"
import { initvideoDescriptionHider } from "./video/videoDescription"
import { initLiveChatHider } from "./video/videoLiveChat"
import { initVideoMoreActionsHiders } from "./video/videoMoreActions"
// ========================================================= //

// ========================= CHANNEL PAGE ======================== //
import { initChannelJoinButton } from "./channel/joinButton"
import { initChannelWallpaperHider } from "./channel/channelWallpaper"
import { initChannelFeaturedContentHider } from "./channel/channelFeaturedContent"
import { initChannelShortsHider } from "./channel/channelShorts"
// =============================================================== //

// ======================= SIDEBAR MENU ========================= //
import { initMoreFromYouTube } from "./sidebar/moreFromYouTube"
import { initExploreMenu } from "./sidebar/exploreMenu"
import { initSubcriptionsMenuHider } from "./sidebar/sidebarSubscriptons"
// ============================================================== //

import { initInFeedAds } from "./feeds/inFeedAds"
import { clearAllRemovals, restoreRemovals } from "./shared/removalRegistry"

// ===================== SINGLE SOURCE OF TRUTH ===================== //
const DEFAULTS = Object.freeze({
    // sidebar extras
    inFeedAdsEnabled: false,
    moreFromYouTubeEnabled: false,
    exploreMenuEnabled: false,

    // home
    homeShortsEnabled: false,
    homeYoutubeFeaturedEnabled: false,
    homeHomeFeedEnabled: false,
    homeSubscriptionsButtonEnabled: false,
    homeYoutubePlayablesEnabled: false,
    homeTopicBarEnabled: false,

    // search
    searchShortsEnabled: false,
    searchTopicBarEnabled: false,
    searchChannelsEnabled: false,
    searchAIGeneratedSummariesEnabled: false,

    // sidebar
    sidebarShortsEnabled: false,
    sidebarFooterEnabled: false,
    sidebarSubscriptionsMenuEnabled: false,

    // masthead
    topLogoEnabled: false,
    notificationBellEnabled: false,
    micButtonEnabled: false,

    // video
    videoJoinButtonEnabled: false,
    videoThanksButtonEnabled: false,
    videoShareButtonEnabled: false,
    videoShowRelatedVideosEnabled: false,
    videoShowCommentsEnabled: false,
    videoShowDescriptionEnabled: false,
    videoShowLiveChatEnabled: false,
    videoMoreActionsEnabled: false,

    // channel
    channelJoinButtonEnabled: false,
    channelWallpaperEnabled: false,
    channelFeaturedContentEnabled: false,
    channelShortsEnabled: false,
} as const satisfies Record<string, boolean>)

type FlagKey = keyof typeof DEFAULTS
type Flags = Record<FlagKey, boolean>

const KEYS = Object.keys(DEFAULTS) as FlagKey[]

const FEATURES: Record<FlagKey, (enabled: boolean) => void> = {
    inFeedAdsEnabled: initInFeedAds,
    moreFromYouTubeEnabled: initMoreFromYouTube,
    exploreMenuEnabled: initExploreMenu,

    homeShortsEnabled: initHomeShorts,
    homeYoutubeFeaturedEnabled: initYoutubeFeaturedHider,
    homeHomeFeedEnabled: initHomeFeedHider,
    homeSubscriptionsButtonEnabled: initSubcriptionsButtonHider,
    homeYoutubePlayablesEnabled: initHomeYoutubePlayablesHider,
    homeTopicBarEnabled: initHomeTopicBarHider,

    searchShortsEnabled: initSearchShortsHider,
    searchTopicBarEnabled: initSearchTopicBarHider,
    searchChannelsEnabled: initSearchChannelsHider,
    searchAIGeneratedSummariesEnabled: initSearchAIGeneratedSummariesHider,

    sidebarShortsEnabled: initSidebarShorts,
    sidebarFooterEnabled: initSidebarFooter,
    sidebarSubscriptionsMenuEnabled: initSubcriptionsMenuHider,

    topLogoEnabled: initTopLogo,
    notificationBellEnabled: initNotificationBell,
    micButtonEnabled: initMicButton,

    videoJoinButtonEnabled: initVideoJoinButtonHider,
    videoThanksButtonEnabled: initVideoThanksButton,
    videoShareButtonEnabled: initVideoShareButtonHider,
    videoShowRelatedVideosEnabled: initRelatedVideosHider,
    videoShowCommentsEnabled: initVideoCommentsHider,
    videoShowDescriptionEnabled: initvideoDescriptionHider,
    videoShowLiveChatEnabled: initLiveChatHider,
    videoMoreActionsEnabled: initVideoMoreActionsHiders,

    channelJoinButtonEnabled: initChannelJoinButton,
    channelWallpaperEnabled: initChannelWallpaperHider,
    channelFeaturedContentEnabled: initChannelFeaturedContentHider,
    channelShortsEnabled: initChannelShortsHider,
}

const CLASS_TOGGLES: ReadonlyArray<readonly [FlagKey, string]> = [
    ["homeShortsEnabled", "veloxtube-home"],
    ["searchShortsEnabled", "veloxtube-search"],
    ["sidebarShortsEnabled", "veloxtube-sidebar"],
]

// ============================= STATE ============================= //
let flags: Flags = { ...DEFAULTS }
let applied: Flags | null = null
let scheduled = false
let active = false
let teardown: (() => void) | null = null

// ============================= APPLY ============================= //
const runFeature = (key: FlagKey): void => {
    const enabled = flags[key]
    try {
        if (!enabled) restoreRemovals(key)
        FEATURES[key](enabled)
    } catch (error) {
        console.error(`VeloxTube: feature failed: ${FEATURES[key].name}`, error)
    }
}

const apply = (): void => {
    scheduled = false
    if (!active) return

    const full = applied === null
    const prev = applied

    for (let i = 0; i < CLASS_TOGGLES.length; i++) {
        const [key, cls] = CLASS_TOGGLES[i]!
        if (full || prev![key] !== flags[key]) {
            document.documentElement.classList.toggle(cls, flags[key])
        }
    }

    if (full) {
        for (const key of KEYS) runFeature(key)
    } else {
        for (const key of KEYS) {
            if (prev![key] !== flags[key]) runFeature(key)
        }
    }

    applied = flags
}

const schedule = (): void => {
    if (scheduled || !active) return
    scheduled = true
    queueMicrotask(apply)
}

// ============================= EVENTS ============================= //
const onNavigation = (): void => {
    clearAllRemovals()
    applied = null
    schedule()
}

const onStorageChanged: Parameters<typeof browser.storage.onChanged.addListener>[0] = (
    changes,
    area,
) => {
    if (area !== "local") return

    let dirty = false
    for (const key of KEYS) {
        const change = changes[key]
        if (!change) continue

        const next = change.newValue ?? DEFAULTS[key]
        if (next !== flags[key]) {
            flags = { ...flags, [key]: next as boolean }
            dirty = true
        }
    }

    if (dirty) schedule()
}

// ============================= LIFECYCLE ============================= //
const mount = (): (() => void) => {
    if (teardown) return teardown

    active = true

    document.addEventListener("yt-navigate-finish", onNavigation, { passive: true })
    document.addEventListener("yt-page-data-updated", onNavigation, { passive: true })
    browser.storage.onChanged.addListener(onStorageChanged)

    browser.storage.local
        .get(KEYS)
        .then((stored) => {
            if (!active) return
            flags = { ...DEFAULTS, ...(stored as Partial<Flags>) }
            applied = null
            schedule()
        })
        .catch((error) => {
            console.error("VeloxTube: failed to read storage", error)
            if (!active) return
            applied = null
            schedule()
        })

    teardown = (): void => {
        document.removeEventListener("yt-navigate-finish", onNavigation)
        document.removeEventListener("yt-page-data-updated", onNavigation)
        browser.storage.onChanged.removeListener(onStorageChanged)

        flags = { ...DEFAULTS }
        applied = null
        apply()

        clearAllRemovals()
        active = false
        teardown = null
    }

    return teardown
}

mount()

export default mount