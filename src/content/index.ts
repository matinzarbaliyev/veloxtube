
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


// ======================= SIBDEBAR MENU ========================= //
import { initMoreFromYouTube } from "./sidebar/moreFromYouTube"
import { initExploreMenu } from "./sidebar/exploreMenu"
import { initSubcriptionsMenuHider } from "./sidebar/sidebarSubscriptons"
// ============================================================== //


import { initInFeedAds } from "./feeds/inFeedAds"
import { clearAllRemovals, restoreRemovals } from "./shared/removalRegistry"

const HOME_CLASS = "veloxtube-home"
const SEARCH_CLASS = "veloxtube-search"
const SIDEBAR_CLASS = "veloxtube-sidebar"
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

    // ====== CHANNEL PAGE ====== //
    "channelWallpaperEnabled",
    "channelJoinButtonEnabled",
    "channelFeaturedContentEnabled",
    "channelShortsEnabled",
    // ========================== //


    // ===== SIDEBAR MENU ===== //
    "moreFromYouTubeEnabled",
    "exploreMenuEnabled",
    "sidebarSubscriptionsMenuEnabled",
    // ===== SIDEBAR MENU ===== //

    "inFeedAdsEnabled",


] as const

type Flags = {

    // =========== HOME PAGE =========== //
    homeShortsEnabled: boolean
    homeYoutubeFeaturedEnabled: boolean
    homeHomeFeedEnabled: boolean
    homeSubscriptionsButtonEnabled: boolean
    homeYoutubePlayablesEnabled: boolean
    homeTopicBarEnabled: boolean
    // ================================== //

    // =========== SEARCH PAGE =========== //
    searchShortsEnabled: boolean
    searchTopicBarEnabled: boolean
    searchChannelsEnabled: boolean
    searchAIGeneratedSummariesEnabled: boolean
    // ================================== //

    sidebarShortsEnabled: boolean
    sidebarFooterEnabled: boolean
    topLogoEnabled: boolean
    notificationBellEnabled: boolean
    micButtonEnabled: boolean

    // =========== VIDEO PAGE =========== //
    videoJoinButtonEnabled: boolean
    videoThanksButtonEnabled: boolean
    videoShareButtonEnabled: boolean
    videoShowRelatedVideosEnabled: boolean
    videoShowCommentsEnabled: boolean
    videoShowDescriptionEnabled: boolean
    videoShowLiveChatEnabled: boolean
    videoMoreActionsEnabled: boolean
    // ================================== //

    channelJoinButtonEnabled: boolean
    channelWallpaperEnabled: boolean,
    channelFeaturedContentEnabled: boolean,
    channelShortsEnabled: boolean,

    // =========== SIDEBAR MENU =========== //
    moreFromYouTubeEnabled: boolean
    exploreMenuEnabled: boolean
    sidebarSubscriptionsMenuEnabled: boolean
    // ================================== //

    inFeedAdsEnabled: boolean
}

const DEFAULTS: Flags = {

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

    // =========== VIDEO PAGE =========== //
    videoJoinButtonEnabled: false,
    videoThanksButtonEnabled: false,
    videoShareButtonEnabled: false,
    videoShowRelatedVideosEnabled: false,
    videoShowCommentsEnabled: false,
    videoShowDescriptionEnabled: false,
    videoShowLiveChatEnabled: false,
    videoMoreActionsEnabled: false,
    // ================================== //

    channelJoinButtonEnabled: false,
    channelWallpaperEnabled: false,
    channelFeaturedContentEnabled: false,
    channelShortsEnabled: false,

    // =========== SIDEBAR MENU =========== //
    moreFromYouTubeEnabled: false,
    exploreMenuEnabled: false,
    sidebarSubscriptionsMenuEnabled: false,
    // ================================== //



    inFeedAdsEnabled: false,
}

let flags: Flags = DEFAULTS
let scheduled = false

// One broken feature must never stop the rest of the features from applying.
const runFeature = (
    key: keyof Flags,
    init: (enabled: boolean) => void,
    enabled: boolean,
): void => {
    try {
        if (!enabled) {
            restoreRemovals(key)
        }

        init(enabled)
    } catch (error) {
        const errorMessage: string = `VeloxTube: feature failed. Feature initializer name: ${init.name}`
        console.error(errorMessage, error)
    }
}

const apply = (): void => {
    scheduled = false
    runFeature("inFeedAdsEnabled", initInFeedAds, flags.inFeedAdsEnabled)
    runFeature("moreFromYouTubeEnabled", initMoreFromYouTube, flags.moreFromYouTubeEnabled)
    runFeature("exploreMenuEnabled", initExploreMenu, flags.exploreMenuEnabled)
    document.documentElement.classList.toggle(HOME_CLASS, flags.homeShortsEnabled)
    document.documentElement.classList.toggle(SEARCH_CLASS, flags.searchShortsEnabled)
    document.documentElement.classList.toggle(SIDEBAR_CLASS, flags.sidebarShortsEnabled)

    // =============================== HOME PAGE =============================== //
    runFeature("homeShortsEnabled", initHomeShorts, flags.homeShortsEnabled)
    runFeature("homeYoutubeFeaturedEnabled", initYoutubeFeaturedHider, flags.homeYoutubeFeaturedEnabled)
    runFeature("homeHomeFeedEnabled", initHomeFeedHider, flags.homeHomeFeedEnabled)
    runFeature("homeSubscriptionsButtonEnabled", initSubcriptionsButtonHider, flags.homeSubscriptionsButtonEnabled)
    runFeature("homeYoutubePlayablesEnabled", initHomeYoutubePlayablesHider, flags.homeYoutubePlayablesEnabled)
    runFeature("homeTopicBarEnabled", initHomeTopicBarHider, flags.homeTopicBarEnabled)
    // ========================================================================= //


    // ======================== SEARCH PAGE ======================== //
    runFeature("searchShortsEnabled", initSearchShortsHider, flags.searchShortsEnabled)
    runFeature("searchTopicBarEnabled", initSearchTopicBarHider, flags.searchTopicBarEnabled)
    runFeature("searchChannelsEnabled", initSearchChannelsHider, flags.searchChannelsEnabled)

    runFeature(
        "searchAIGeneratedSummariesEnabled",
        initSearchAIGeneratedSummariesHider,
        flags.searchAIGeneratedSummariesEnabled
    )
    // ============================================================= //

    // =========== SIDEBAR MENU =========== //
    runFeature("sidebarShortsEnabled", initSidebarShorts, flags.sidebarShortsEnabled)
    runFeature("sidebarFooterEnabled", initSidebarFooter, flags.sidebarFooterEnabled)
    runFeature("sidebarSubscriptionsMenuEnabled", initSubcriptionsMenuHider, flags.sidebarSubscriptionsMenuEnabled)
    // ================================== //


    runFeature("topLogoEnabled", initTopLogo, flags.topLogoEnabled)
    runFeature("notificationBellEnabled", initNotificationBell, flags.notificationBellEnabled)
    runFeature("micButtonEnabled", initMicButton, flags.micButtonEnabled)

    // Video Page
    runFeature("videoJoinButtonEnabled", initVideoJoinButtonHider, flags.videoJoinButtonEnabled)
    runFeature("videoThanksButtonEnabled", initVideoThanksButton, flags.videoThanksButtonEnabled)
    runFeature("videoShareButtonEnabled", initVideoShareButtonHider, flags.videoShareButtonEnabled)
    runFeature("videoShowRelatedVideosEnabled", initRelatedVideosHider, flags.videoShowRelatedVideosEnabled)
    runFeature("videoShowCommentsEnabled", initVideoCommentsHider, flags.videoShowCommentsEnabled)
    runFeature("videoShowDescriptionEnabled", initvideoDescriptionHider, flags.videoShowDescriptionEnabled)
    runFeature("videoShowLiveChatEnabled", initLiveChatHider, flags.videoShowLiveChatEnabled)
    runFeature("videoMoreActionsEnabled", initVideoMoreActionsHiders, flags.videoMoreActionsEnabled)
    // ==================================================== //


    runFeature("channelJoinButtonEnabled", initChannelJoinButton, flags.channelJoinButtonEnabled)
    runFeature("channelWallpaperEnabled", initChannelWallpaperHider, flags.channelWallpaperEnabled)
    runFeature("channelFeaturedContentEnabled", initChannelFeaturedContentHider, flags.channelFeaturedContentEnabled)
    runFeature("channelShortsEnabled", initChannelShortsHider, flags.channelShortsEnabled)
}

const schedule = (): void => {
    if (scheduled) {
        return
    }

    scheduled = true
    queueMicrotask(apply)
}

const scheduleNavigation = (): void => {
    clearAllRemovals()
    schedule()
}

document.addEventListener("yt-navigate-finish", scheduleNavigation, { passive: true })
document.addEventListener("yt-page-data-updated", scheduleNavigation, { passive: true })

browser.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") {
        return
    }

    if (!KEYS.some((key) => key in changes)) {
        return
    }

    for (const key of KEYS) {
        const change = changes[key]

        if (change) {
            flags = { ...flags, [key]: change.newValue as boolean }
        }
    }

    schedule()
})

void browser.storage.local.get([...KEYS]).then((stored) => {
    flags = { ...DEFAULTS, ...(stored as Partial<Flags>) }
    schedule()
})
