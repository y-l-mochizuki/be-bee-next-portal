import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const toLocaleStringJa = (date: Date) => {
	return date.toLocaleString("ja-JP", {
		timeZone: "Asia/Tokyo",
		year: "numeric",
		month: "numeric",
		day: "numeric",
	});
};
