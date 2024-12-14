import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { SITE_NAME } from "const";
import { getFeedDetails } from "database/feed-details";
import type { FeedSchema } from "utils/rssParser";
import { Badge } from "~/components/ui/badge";
import {
	TypographyH1,
	TypographyH2,
	TypographyMuted,
} from "~/components/ui/Typography";

const CATEGORIES = {
	SCHEDULE: "schedule",
	NEWS: "news",
};

const DISPLAY_LIMIT = 10;

type LoaderDataResponse = {
	feeds: FeedSchema[];
};

export const meta: MetaFunction = () => {
	return [
		{ title: "BE BEe NEXT PORTAL" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export const loader = async () => {
	const { data: feeds } = await getFeedDetails();

	return {
		feeds,
	};
};

export default function Index() {
	const { feeds } = useLoaderData<LoaderDataResponse>();

	const sections = {
		schedule: {
			heading: CATEGORIES.SCHEDULE,
			feeds: formatFeeds(feeds, CATEGORIES.SCHEDULE),
		},
		news: {
			heading: CATEGORIES.NEWS,
			feeds: formatFeeds(feeds, CATEGORIES.NEWS),
		},
	};

	return (
		<div className="max-w-md mx-auto p-6 grid gap-12">
			<TypographyH1>{SITE_NAME}</TypographyH1>
			{Object.values(sections).map((section) => (
				<section key={section.heading}>
					<TypographyH2>{section.heading}</TypographyH2>
					{limitDisplayFeeds(section.feeds).map((feed, i) => {
						const isNonLiveScheduleSection =
							section.heading !== CATEGORIES.SCHEDULE;

						return (
							<section key={`${feed.title}-${i}`}>
								<Link to={feed.link} className="grid gap-2 pt-3 pb-4 border-b">
									<h3 className="font-bold">{feed.title}</h3>
									<div className="flex justify-between items-end">
										<Badge variant="outline">{feed.groupName}</Badge>
										{isNonLiveScheduleSection && (
											<TypographyMuted>{formatDate(feed.date)}</TypographyMuted>
										)}
									</div>
								</Link>
							</section>
						);
					})}
				</section>
			))}
		</div>
	);
}

const formatFeeds = (feeds: FeedSchema[], categoryName: string) => {
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

const getFeedsByCategory = (feeds: FeedSchema[], categoryName: string) => {
	return feeds.filter((feed) => feed.categoryName === categoryName);
};

const sortFeedsByPostDate = (feeds: FeedSchema[]) => {
	return feeds.sort((a, b) => {
		const dateA = new Date(a.date ?? 0);
		const dateB = new Date(b.date ?? 0);
		return dateB.getTime() - dateA.getTime();
	});
};

const sortFeedsByScheduleDate = (feeds: FeedSchema[]) => {
	return feeds.sort((a, b) => {
		const extractDate = (title: string): Date => {
			// 2024.12.22 や 2024.12.22(日) などの形式に対応
			const match = title.match(/(\d{4})\.(\d{2})\.(\d{2})(?:\(.\))?/);
			if (!match) return new Date(0);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const [_, year, month, day] = match;
			return new Date(Number(year), Number(month) - 1, Number(day));
		};

		const dateA = extractDate(a.title);
		const dateB = extractDate(b.title);

		return dateB.getTime() - dateA.getTime();
	});
};

const limitDisplayFeeds = (feeds: FeedSchema[]) => {
	return feeds.slice(0, DISPLAY_LIMIT);
};

const formatDate = (dateStr?: string) => {
	if (!dateStr) {
		return null;
	}

	const date = new Date(dateStr);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}.${month}.${day}`;
};
