import { useLoaderData } from "@remix-run/react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { getLiveSchedule, type LiveSchedule } from "database/live-schedule";
import { LiveMap } from "~/features/live-map/components/live-map.client";

const isServer = typeof document === "undefined";

export const loader = async () => {
	const { data } = await getLiveSchedule();

	return {
		data,
	};
};

type LoaderDataResponse = {
	data: LiveSchedule[];
};

export default function LiveMapPage() {
	const { data } = useLoaderData<LoaderDataResponse>();
	if (isServer) {
		return null;
	}

	const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY ?? "";
	return (
		<APIProvider apiKey={apiKey}>
			<LiveMap data={data} />
		</APIProvider>
	);
}
