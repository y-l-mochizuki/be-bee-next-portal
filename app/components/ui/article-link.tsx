import { Link } from "@remix-run/react";
import { Badge } from "./badge";
import { TypographyMuted } from "./Typography";
import { formatDate } from "utils/formatter";

type Props = {
	href: string;
	title: string;
	groupName: string;
	date: string;
	isHiddenDate?: boolean;
};

export const ArticleLink = ({
	href,
	title,
	groupName,
	date,
	isHiddenDate,
}: Props) => {
	return (
		<Link
			to={href}
			target="_blank"
			rel="noreferrer"
			className="grid gap-2 pt-3 pb-4 border-b"
		>
			<h3 className="font-bold">{title}</h3>
			<div className="flex justify-between items-end">
				<Badge variant="secondary" className="rounded-[2px] px-1">
					{groupName}
				</Badge>
				{!isHiddenDate && <TypographyMuted>{formatDate(date)}</TypographyMuted>}
			</div>
		</Link>
	);
};
