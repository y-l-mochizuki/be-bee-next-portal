import {
	AdvancedMarker,
	Map as BaseMap,
	useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { LiveMapDatePickerBar } from "~/features/live-map/components/live-map-date-picker-bar";
import type { LiveSchedule } from "database/live-schedule";

// 新宿駅
const DEFAULT_POSITION = {
	lat: 35.6905,
	lng: 139.6995,
};

type Props = {
	data: LiveSchedule[];
};

export const LiveMap = ({ data }: Props) => {
	const today = new Date();
	const days = ["日", "月", "火", "水", "木", "金", "土"] as const;
	const dates = Array.from({ length: 30 }, (_, i) => {
		const date = new Date(today);
		date.setDate(today.getDate() + i);

		return {
			date: date.getDate(),
			rawDate: date,
			day: days[date.getDay()],
			isToday: i === 0,
		};
	});

	const [selectedDate, setSelectedDate] = useState(new Date());

	const getYYYYMMDD = (date: string) => {
		return date.split("T")[0];
	};

	const schedulesForSelectedDate = data.filter((schedule) => {
		const eventDateString = getYYYYMMDD(schedule.eventDate);
		const selectedDateString = getYYYYMMDD(selectedDate.toISOString());

		return eventDateString === selectedDateString;
	});

	const map = useMap();
	useEffect(() => {
		if (!map || schedulesForSelectedDate.length === 0) {
			return;
		}

		const NORTH_MARGIN = 0.0068;

		// NOTE: 1つの会場のみの場合はその会場にズーム
		const uniqueVenues = new Set(
			schedulesForSelectedDate.map((s) => `${s.venueLat},${s.venueLng}`),
		);

		if (uniqueVenues.size === 1) {
			map.setCenter({
				lat: schedulesForSelectedDate[0].venueLat,
				lng: schedulesForSelectedDate[0].venueLng,
			});
			map.setZoom(15);
		} else {
			map.fitBounds({
				north:
					Math.max(...schedulesForSelectedDate.map((s) => s.venueLat)) +
					NORTH_MARGIN,
				south:
					Math.min(...schedulesForSelectedDate.map((s) => s.venueLat)) +
					NORTH_MARGIN,
				east: Math.max(...schedulesForSelectedDate.map((s) => s.venueLng)),
				west: Math.min(...schedulesForSelectedDate.map((s) => s.venueLng)),
			});
		}
	}, [map, schedulesForSelectedDate]);

	return (
		<div className="flex flex-col h-[100svh]">
			<LiveMapDatePickerBar
				dates={dates}
				selectedDate={selectedDate}
				onSelectDate={setSelectedDate}
			/>

			<div className="flex flex-1">
				<BaseMap
					mapId="live-map"
					defaultCenter={DEFAULT_POSITION}
					defaultZoom={15}
					disableDefaultUI={true}
					clickableIcons={false}
					mapTypeControl={false}
					zoomControl={false}
					streetViewControl={false}
					fullscreenControl={false}
					className="w-full h-full"
				>
					{schedulesForSelectedDate.map((schedule, i) => (
						<AdvancedMarker
							key={i.toString()}
							position={{
								lat: schedule.venueLat,
								lng: schedule.venueLng,
							}}
						>
							<div className="relative flex items-center gap-2 p-1 bg-black rounded-full -translate-y-[50%]">
								{schedule.venueName}

								{schedule.groups.map((group) => (
									<Avatar key={group.name} className="w-[60px] h-[60px]">
										<AvatarImage src={group.thumbnailUrl} alt={group.name} />
										<AvatarFallback>{group.name}</AvatarFallback>
									</Avatar>
								))}

								<div className="absolute left-[50%] -translate-x-[50%] top-[95%] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-black" />
							</div>
						</AdvancedMarker>
					))}
				</BaseMap>
			</div>
		</div>
	);
};
