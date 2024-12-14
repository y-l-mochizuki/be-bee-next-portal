import { CATEGORIES, DISPLAY_LIMIT } from "const";
import type { FeedSchema } from "utils/rssParser";

export const formatFeeds = (feeds: FeedSchema[], categoryName: string) => {
	switch (categoryName) {
		case CATEGORIES.SCHEDULE: {
			const feedsByCategory = getFeedsByCategory(feeds, CATEGORIES.SCHEDULE);
			const sortedFeedsByScheduleDate =
				sortFeedsByScheduleDate(feedsByCategory);
			return sortedFeedsByScheduleDate;
		}

		case CATEGORIES.NEWS: {
			const feedsByCategory = getFeedsByCategory(feeds, CATEGORIES.NEWS);
			const sortedFeedsByPostDate = sortFeedsByPostDate(feedsByCategory);
			return sortedFeedsByPostDate;
		}

		default:
			return [] as FeedSchema[];
	}
};

export const getFeedsByCategory = (
	feeds: FeedSchema[],
	categoryName: string,
) => {
	return feeds.filter((feed) => feed.categoryName === categoryName);
};

export const sortFeedsByPostDate = (feeds: FeedSchema[]) => {
	return feeds.sort((a, b) => {
		const dateA = new Date(a.date ?? 0);
		const dateB = new Date(b.date ?? 0);
		return dateB.getTime() - dateA.getTime();
	});
};

export const sortFeedsByScheduleDate = (feeds: FeedSchema[]) => {
	return feeds.sort((a, b) => {
		const dateA = extractDateFromFeedTitle(a.title);
		const dateB = extractDateFromFeedTitle(b.title);

		return dateB.getTime() - dateA.getTime();
	});
};

export const extractDateFromFeedTitle = (title: string) => {
	// 2024.12.30(月) や 2024.12.22 などの形式に対応
	const match = title.match(/^(\d{4})\.(\d{2})\.(\d{2})(?:\(.\))?/);
	if (!match) return new Date(0);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, year, month, day] = match;
	return new Date(Number(year), Number(month) - 1, Number(day));
};

export const limitDisplayFeeds = (feeds: FeedSchema[]) => {
	return feeds.slice(0, DISPLAY_LIMIT);
};

export const formatDate = (dateStr?: string) => {
	if (!dateStr) {
		return null;
	}

	const date = new Date(dateStr);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}.${month}.${day}`;
};
