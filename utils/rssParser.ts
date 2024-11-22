import Parser from "rss-parser";

export interface CommonFeed {
	items: CommonFeedItem[];
	feedUrl: string;
	paginationLinks?: PaginationLinks;
	title: string;
	description?: string; // thebethは必須、他はオプショナル
	generator?: string;
	link: string;
	language?: string;
	lastBuildDate?: string;
}

export interface CommonFeedItem {
	creator?: string; // thebethは必須、他はオプショナル
	title: string;
	link: string;
	pubDate: string;
	content?: string; // thebethは必須、他はオプショナル
	contentSnippet?: string; // thebethは必須、他はオプショナル
	"content:encoded"?: string;
	"content:encodedSnippet"?: string;
	"dc:creator"?: string;
	comments?: string;
	guid?: string;
	categories?: string[];
	isoDate?: string;
}

export interface PaginationLinks {
	self: string;
	[key: string]: string;
}

export interface FeedSchema {
	title: string;
	link: string;
	date: string | undefined;
	categories: string[] | undefined;
	groupName: string;
}

const rssParser = new Parser();
const rssParseURL = async (url: string): Promise<CommonFeed> => {
	const feed = await rssParser.parseURL(url);
	return feed as CommonFeed;
};

export const getFeedItems = async (url: string) => {
	const feed = await rssParseURL(url);
	return feed.items.map((item) => ({
		title: item.title,
		link: item.link,
		date: item.isoDate,
		categories: item.categories,
		groupName: feed.title,
	})) satisfies FeedSchema[];
};
