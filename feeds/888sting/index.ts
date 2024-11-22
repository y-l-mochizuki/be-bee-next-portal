import { OFFICIAL_SITES } from "const";
import { getFeedItems } from "utils/rssParser";
const URL = `${OFFICIAL_SITES._888STING}feed/`;

export const get888stingItems = () => getFeedItems(URL);
