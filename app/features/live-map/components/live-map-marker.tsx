import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { LiveMapScheduleType } from "../types";

type Props = {
	schedule: LiveMapScheduleType;
};

export const LiveMapMarker = ({ schedule }: Props) => {
	return (
		<div className="relative flex items-center gap-2 p-1 bg-black rounded-full -translate-y-[50%]">
			{schedule.groups.map((group) => (
				<Avatar className="w-[60px] h-[60px]" key={group.name}>
					<AvatarImage src={group.thumbnailUrl} alt={group.name} />
					<AvatarFallback>{group.name}</AvatarFallback>
				</Avatar>
			))}
			<div className="absolute left-[50%] -translate-x-[50%] top-[95%] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-black" />
		</div>
	);
};
