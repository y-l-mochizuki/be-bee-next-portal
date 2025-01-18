import { Button } from "~/components/ui/button";
import { getYYYYMMDD } from "../utils";

type Props = {
	dates: {
		date: number; // 日付の数値（1-31）
		rawDate: Date; // Dateオブジェクト
		day: "日" | "月" | "火" | "水" | "木" | "金" | "土"; // 曜日
		isToday: boolean; // 今日かどうか
	}[];
	selectedDate: Date;
	onSelectDate: (date: Date) => void;
};

export const LiveMapDatePickerBar = ({
	dates,
	selectedDate,
	onSelectDate,
}: Props) => {
	return (
		<div className="flex gap-2 p-2 overflow-x-scroll">
			{dates.map(({ date, day, isToday, rawDate }) => {
				const variant =
					getYYYYMMDD(rawDate.toISOString()) ===
					getYYYYMMDD(selectedDate.toISOString())
						? "default"
						: "outline";

				const handleClick = () => {
					onSelectDate(rawDate);
				};

				return (
					<Button
						key={rawDate.toISOString()}
						variant={variant}
						onClick={handleClick}
						className="flex flex-col items-center min-w-[60px] h-auto"
					>
						<span>{isToday ? "今日" : date}</span>
						<span className="text-xs">{day}</span>
					</Button>
				);
			})}
		</div>
	);
};
