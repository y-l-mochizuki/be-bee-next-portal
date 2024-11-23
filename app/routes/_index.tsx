import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { SITE_NAME } from "const";
import { getFeedItems, type FeedSchema } from "utils/rssParser";
import { getOfficialSites } from "utils/supabase";
import { Badge } from "~/components/ui/badge";
import {
	TypographyH1,
	TypographyH2,
	TypographyMuted,
} from "~/components/ui/Typography";

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
	const { data: official_sites } = await getOfficialSites();

	if (official_sites === null) {
		throw new Response("サイト情報が見つかりません", {
			status: 404,
			statusText: "Not Found",
		});
	}

	const feedList = (
		await Promise.all(official_sites?.map((site) => getFeedItems(site.rss_url)))
	).flat();

	const mergedFeeds = margeFeeds(feedList);

	return {
		feeds: mergedFeeds,
	};
};

export default function Index() {
	const { feeds } = useLoaderData<LoaderDataResponse>();

	// TODO: supabase移行
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
			<TypographyH1>{SITE_NAME}</TypographyH1>
			{Object.values(sections).map((section) => (
				<section key={section.heading}>
					<TypographyH2>{section.heading}</TypographyH2>
					<ul>
						{section.feeds.map((feed, i) => {
							const isNonLiveScheduleSection =
								section.heading !== sections.liveSchedule.heading;

							return (
								<li key={`${feed.title}-${i}`}>
									<Link
										to={feed.link}
										className="grid gap-2 pt-3 pb-4 border-b"
									>
										<h3 className="font-bold">{feed.title}</h3>
										<div className="flex justify-between items-end">
											<Badge variant="outline">{feed.siteTitle}</Badge>
											{isNonLiveScheduleSection && (
												<TypographyMuted>
													{formatDate(feed.date)}
												</TypographyMuted>
											)}
										</div>
									</Link>
								</li>
							);
						})}
					</ul>
				</section>
			))}
		</div>
	);
}

const margeFeeds = (feedList: FeedSchema[]) => {
	return feedList.flat().sort((a, b) => {
		const dateA = a.date ?? new Date(0);
		const dateB = b.date ?? new Date(0);
		return new Date(dateB).getTime() - new Date(dateA).getTime();
	});
};

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
