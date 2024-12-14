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
	groupName: string;
	categoryName: string;
	date: string | undefined;
}

const rssParser = new Parser();

const rssParseURL = async (url: string): Promise<CommonFeed> => {
	const feed = await rssParser.parseURL(url);
	return feed as CommonFeed;
};

export const getFeeds = async (args: {
	url: string;
	groupName: string;
	categoryName: string;
}) => {
	const feed = await rssParseURL(args.url);
	return feed.items.map((item) => ({
		title: item.title,
		link: item.link,
		groupName: args.groupName,
		categoryName: args.categoryName,
		date: item.isoDate,
	})) satisfies FeedSchema[];
};
