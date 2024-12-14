import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CATEGORIES, SITE_NAME } from "const";
import { getFeedDetails } from "database/feed-details";
import { formatFeeds, limitDisplayFeeds } from "utils/formatter";
import type { FeedSchema } from "utils/rssParser";
import { ScheduleCalendar } from "~/components/schedule-calendar";
import { ArticleLink } from "~/components/ui/article-link";
import {
	TypographyH1,
	TypographyH2,
	TypographyMuted,
} from "~/components/ui/Typography";
import packageJson from "~/../package.json";

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

			<section>
				<TypographyH2>CALENDAR</TypographyH2>
				<div className="-mx-6 mt-3">
					<ScheduleCalendar feeds={feeds} />
				</div>
			</section>

			{Object.values(sections).map((section) => {
				const sectionHeading = section.heading.toLocaleUpperCase();
				const isScheduleSection = section.heading === CATEGORIES.SCHEDULE;

				return (
					<section key={section.heading}>
						<TypographyH2>{sectionHeading}</TypographyH2>
						{limitDisplayFeeds(section.feeds).map((feed, i) => (
							<section key={`${feed.title}-${i}`}>
								<ArticleLink
									href={feed.link}
									title={feed.title}
									groupName={feed.groupName}
									date={feed.date ?? new Date().toISOString()}
									isHiddenDate={isScheduleSection}
								/>
							</section>
						))}
					</section>
				);
			})}

			<div className="flex justify-center">
				<TypographyMuted>version {packageJson.version}</TypographyMuted>
			</div>
		</div>
	);
}
