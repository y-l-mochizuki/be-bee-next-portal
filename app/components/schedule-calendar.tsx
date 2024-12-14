import type { FeedSchema } from "utils/rssParser";
import { Calendar } from "./ui/calendar";
import { Badge } from "./ui/badge";
import { CATEGORIES } from "const";
import { extractDateFromFeedTitle, formatFeeds } from "utils/formatter";
import { cn } from "~/lib/utils";
import { Drawer, DrawerContent } from "./ui/drawer";
import { useState } from "react";
import { ArticleLink } from "./ui/article-link";

const EMPTY_SCHEDULE_MESSAGE = "スケジュール情報がありません";

type Props = {
	feeds: FeedSchema[];
};

export const ScheduleCalendar = ({ feeds }: Props) => {
	const [open, setOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const scheduleFeeds = getScheduleFeedsByDate(
		feeds,
		selectedDate ?? new Date(),
	);
	const isEmptyScheduleFeeds = scheduleFeeds.length === 0;
	const handleSelect = (date?: Date) => {
		if (!date) return;
		setSelectedDate(date);
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
		setSelectedDate(null);
	};

	return (
		<>
			<Calendar
				onSelect={handleSelect}
				mode="single"
				modifiers={{
					today: false, // 当日のスタイルを無効化
					selected: false, // 選択時のスタイルを無効化
				}}
				formatters={{
					formatCaption: (date: Date) => {
						return `${date.getFullYear()}.${date.getMonth() + 1}`;
					},
				}}
				classNames={{
					root: "px-0 py-0",
					caption_end: "w-full",
					head: "[&>tr>th]:flex-1 [&>tr]:justify-between [&>tr]:px-2",
					tbody: "[&>tr]:justify-between [&>tr]:px-2",
					cell: "flex w-full p-0.25",
					button:
						"flex-1 h-auto min-h-7 bg-none hover:bg-transparent hover:text-inherit",
					caption: "px-6 relative flex justify-between items-center",
					caption_label: "text-base font-bold",
					nav: "flex gap-2",
					nav_button_previous:
						"aspect-square	min-w-10 !opacity-100 hover:opacity-100",
					nav_button_next:
						"aspect-square	min-w-10 !opacity-100 hover:opacity-100",
				}}
				components={{
					// eslint-disable-next-line react/prop-types
					DayContent: ({ date }) => {
						const groupNames = getMatchingGroupNames(feeds, date);
						return <Cell date={date} groupNames={groupNames} />;
					},
				}}
			/>
			<Drawer open={open} onClose={handleClose}>
				<DrawerContent className="h-[90vh]">
					<div className="overflow-y-scroll flex-1 max-w-md mx-auto mt-4 p-6 pt-0">
						{isEmptyScheduleFeeds ? (
							<div className="flex justify-center items-center w-full h-full">
								{EMPTY_SCHEDULE_MESSAGE}
							</div>
						) : (
							scheduleFeeds.map((feed) => (
								<ArticleLink
									key={feed.link}
									href={feed.link}
									title={feed.title}
									groupName={feed.groupName}
									date={selectedDate?.toISOString() ?? ""}
									isHiddenDate
								/>
							))
						)}
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
};

type CellProps = {
	date: Date;
	groupNames: string[];
};

const Cell = ({ date, groupNames }: CellProps) => {
	const today = new Date().toDateString();
	const isToday = date.toDateString() === today;
	const currentDay = date.getDate();
	const duplicatesRemovedGroupNames = Array.from(new Set(groupNames));

	return (
		<div className="grid content-start gap-2 h-full">
			<div
				className={cn(
					"flex justify-center items-center w-5 h-5 mx-auto rounded-full",
					isToday && "bg-white text-black",
				)}
			>
				{currentDay}
			</div>
			<div className="grid gap-0.5">
				{duplicatesRemovedGroupNames.map((groupName) => (
					<Badge
						key={groupName}
						variant="secondary"
						className="overflow-hidden text-[8px] px-1 py-0 leading-loose rounded-[2px]"
					>
						<span className="text-center w-full">{groupName}</span>
					</Badge>
				))}
			</div>
		</div>
	);
};

const getScheduleFeedsByDate = (feeds: FeedSchema[], targetDate: Date) => {
	return formatFeeds(feeds, CATEGORIES.SCHEDULE).filter((feed) => {
		const feedDate = extractDateFromFeedTitle(feed.title);
		return (
			feedDate.getFullYear() === targetDate.getFullYear() &&
			feedDate.getMonth() === targetDate.getMonth() &&
			feedDate.getDate() === targetDate.getDate()
		);
	});
};

const getMatchingGroupNames = (feeds: FeedSchema[], targetDate: Date) => {
	return getScheduleFeedsByDate(feeds, targetDate).map(
		(feed) => feed.groupName,
	);
};
