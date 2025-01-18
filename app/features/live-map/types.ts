export type LiveMapScheduleType = {
	venueName: string;
	venueLat: number;
	venueLng: number;
	eventName: string;
	eventUrl: string;
	eventDate: Date;
	groups: {
		name: string;
		thumbnailUrl: string;
	}[];
};
