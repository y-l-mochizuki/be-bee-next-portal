import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { get888stingItems } from "feeds/888sting";
import { getTheBethFeedItems } from "feeds/thebeth";
import { getWhitripFeedItems } from "feeds/whitrip";
import type { FeedSchema } from "utils/rssParser";

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
	const feedList = await Promise.all([
		getTheBethFeedItems(),
		getWhitripFeedItems(),
		get888stingItems(),
	]);

	const mergedFeeds = feedList.flat().sort((a, b) => {
		const dateA = a.date ?? new Date(0);
		const dateB = b.date ?? new Date(0);
		return new Date(dateB).getTime() - new Date(dateA).getTime();
	});

	return {
		feeds: mergedFeeds,
	};
};

export default function Index() {
	const { feeds } = useLoaderData<LoaderDataResponse>();

	const CATEGORIES = {
		NEWS: ["ニュース", "NEWS", "トピックス"],
		LIVE_SCHEDULE: ["ライブスケジュール"],
	} as const;

	const sections = {
		liveSchedule: {
			heading: "LIVE SCHEDULE",
			feeds: filterByCategories(feeds, CATEGORIES.LIVE_SCHEDULE),
		},
		news: {
			heading: "NEWS",
			feeds: filterByCategories(feeds, CATEGORIES.NEWS),
		},
	};

	return (
		<div className="max-w-md mx-auto p-6 grid gap-12">
			<h1 className="text-4xl font-bold">BE BEe NEXT PORTAL</h1>
			{Object.values(sections).map((section) => (
				<section key={section.heading}>
					<h2 className="font-bold text-xl">{section.heading}</h2>
					<ul>
						{section.feeds.map((feed, i) => (
							<li key={`${feed.title}-${i}`}>
								<Link
									to={feed.link}
									className="grid gap-2 py-4 border-b border-gray-600"
								>
									<div>{feed.title}</div>
									<div className="flex justify-between text-sm">
										<div className="px-1 bg-gray-600 rounded-sm">
											{feed.groupName}
										</div>
										<div className="text-gray-300">{formatDate(feed.date)}</div>
									</div>
								</Link>
							</li>
						))}
					</ul>
				</section>
			))}
		</div>
	);
}

const filterByCategories = (
	feeds: FeedSchema[],
	targetCategories: readonly string[],
) => {
	return feeds.filter((feed) =>
		feed.categories?.some((category) => targetCategories.includes(category)),
	);
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
