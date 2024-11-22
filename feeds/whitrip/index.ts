import { OFFICIAL_SITES } from "const";
import { getFeedItems } from "utils/rssParser";
const URL = `${OFFICIAL_SITES.WHITRIP}?feed=rss2`;

export const getWhitripFeedItems = () => getFeedItems(URL);
