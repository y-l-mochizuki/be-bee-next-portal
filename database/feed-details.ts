import type { Database } from "database.types";
import { getFeeds } from "utils/rssParser";
import { supabase } from "utils/supabase";

const TABLE_NAME = "feed_details";

export const getFeedDetails = async () => {
	const { data, error } = await supabase.from(TABLE_NAME).select("*");
	const feedsPromise = data?.map((v) => getFeeds(createFeedsArgs(v))) ?? [];
	const nestedFeeds = await Promise.all(feedsPromise);
	const feeds = nestedFeeds.flat();

	return {
		data: feeds,
		error,
	};
};

type FeedDetailsSchema = Database["public"]["Views"]["feed_details"]["Row"];
type CreateFeedsArgsFunction = (args: FeedDetailsSchema) => {
	url: string;
	groupName: string;
	categoryName: string;
};

const createFeedsArgs: CreateFeedsArgsFunction = (args) => {
	return {
		url: args.feed_url ?? "",
		groupName: args.group_name ?? "",
		categoryName: args.feed_type_name ?? "",
	};
};
