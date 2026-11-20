
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
// =============================================================== //


// ======================= SIBDEBAR MENU ========================= //
import { initMoreFromYouTube } from "./sidebar/moreFromYouTube"
import { initExploreMenu } from "./sidebar/exploreMenu"
import { initSubcriptionsMenuHider } from "./sidebar/sidebarSubscriptons"
// ============================================================== //


import { initInFeedAds } from "./feeds/inFeedAds"

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
const runFeature = (init: (enabled: boolean) => void, enabled: boolean): void => {
    try {
        init(enabled)
    } catch (error) {
        const errorMessage: string = `VeloxTube: feature failed. Feature initializer name: ${init.name}`
        console.error(errorMessage, error)
    }
}

const apply = (): void => {
    scheduled = false
    runFeature(initInFeedAds, flags.inFeedAdsEnabled)
    runFeature(initMoreFromYouTube, flags.moreFromYouTubeEnabled)
    runFeature(initExploreMenu, flags.exploreMenuEnabled)
    document.documentElement.classList.toggle(HOME_CLASS, flags.homeShortsEnabled)
    document.documentElement.classList.toggle(SEARCH_CLASS, flags.searchShortsEnabled)
    document.documentElement.classList.toggle(SIDEBAR_CLASS, flags.sidebarShortsEnabled)

    // =============================== HOME PAGE =============================== //
    runFeature(initHomeShorts, flags.homeShortsEnabled)
    runFeature(initYoutubeFeaturedHider, flags.homeYoutubeFeaturedEnabled)
    runFeature(initHomeFeedHider, flags.homeHomeFeedEnabled)
    runFeature(initSubcriptionsButtonHider, flags.homeSubscriptionsButtonEnabled)
    runFeature(initHomeYoutubePlayablesHider, flags.homeYoutubePlayablesEnabled)
    runFeature(initHomeTopicBarHider, flags.homeTopicBarEnabled)
    // ========================================================================= //


    // ======================== SEARCH PAGE ======================== //
    runFeature(initSearchShortsHider, flags.searchShortsEnabled)
    runFeature(initSearchTopicBarHider, flags.searchTopicBarEnabled)
    // ============================================================= //

    // =========== SIDEBAR MENU =========== //
    runFeature(initSidebarShorts, flags.sidebarShortsEnabled)
    runFeature(initSidebarFooter, flags.sidebarFooterEnabled)
    runFeature(initSubcriptionsMenuHider, flags.sidebarSubscriptionsMenuEnabled)
    // ================================== //


    runFeature(initTopLogo, flags.topLogoEnabled)
    runFeature(initNotificationBell, flags.notificationBellEnabled)
    runFeature(initMicButton, flags.micButtonEnabled)

    // Video Page
    runFeature(initVideoJoinButtonHider, flags.videoJoinButtonEnabled)
    runFeature(initVideoThanksButton, flags.videoThanksButtonEnabled)
    runFeature(initVideoShareButtonHider, flags.videoShareButtonEnabled)
    runFeature(initRelatedVideosHider, flags.videoShowRelatedVideosEnabled)
    runFeature(initVideoCommentsHider, flags.videoShowCommentsEnabled)
    runFeature(initvideoDescriptionHider, flags.videoShowDescriptionEnabled)
    runFeature(initLiveChatHider, flags.videoShowLiveChatEnabled)
    runFeature(initVideoMoreActionsHiders, flags.videoMoreActionsEnabled)
    // ==================================================== //


    runFeature(initChannelJoinButton, flags.channelJoinButtonEnabled)
    runFeature(initChannelWallpaperHider, flags.channelWallpaperEnabled)
    runFeature(initChannelFeaturedContentHider, flags.channelFeaturedContentEnabled)
}

const schedule = (): void => {
    if (scheduled) {
        return
    }

    scheduled = true
    queueMicrotask(apply)
}

document.addEventListener("yt-navigate-finish", schedule, { passive: true })
document.addEventListener("yt-page-data-updated", schedule, { passive: true })

browser.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") {
        return
    }

    let changed = false

    for (const key of KEYS) {
        const change = changes[key]

        if (change) {
            flags = { ...flags, [key]: change.newValue as boolean }
            changed = true
        }
    }

    if (changed) {
        schedule()
    }
})

void browser.storage.local.get([...KEYS]).then((stored) => {
    flags = { ...DEFAULTS, ...(stored as Partial<Flags>) }
    schedule()
})
