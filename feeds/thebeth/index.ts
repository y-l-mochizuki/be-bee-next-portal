import { OFFICIAL_SITES } from "const";
import { getFeedItems } from "utils/rssParser";
const URL = `${OFFICIAL_SITES.THE_BETH}/feed/`;

export const getTheBethFeedItems = () => getFeedItems(URL);
