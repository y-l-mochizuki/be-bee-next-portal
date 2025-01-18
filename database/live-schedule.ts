import { supabase } from "utils/supabase";

const TABLE_NAME = "live_schedule";

export type LiveSchedule = {
	eventDate: string;
	venueName: string;
	venueLat: number;
	venueLng: number;
	groups: {
		name: string;
		thumbnailUrl: string;
	}[];
};

export const getLiveSchedule = async () => {
	const { data, error } = await supabase.from(TABLE_NAME).select("*");

	return {
		data: data?.map((e) => e.event) as LiveSchedule[],
		error,
	};
};
