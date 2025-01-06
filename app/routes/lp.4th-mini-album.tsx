import type { MetaFunction } from "@remix-run/node";
import { OFFICIAL_INFO } from "const";
import { Play, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TypographyH1, TypographyH2 } from "~/components/ui/Typography";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () => {
	return [
		{ title: ALBUM_INFO.PAGE_TITLE },
		{
			name: "description",
			content: `${ALBUM_INFO.RELEASE_DATE} Release`,
		},
		{
			property: "og:title",
			content: ALBUM_INFO.PAGE_TITLE,
		},
		{
			property: "og:description",
			content: `${ALBUM_INFO.RELEASE_DATE} Release`,
		},
		{
			property: "og:image",
			content: ALBUM_INFO.IMAGE_URL,
		},
		{
			name: "twitter:card",
			content: "summary_large_image",
		},
		{
			name: "twitter:title",
			content: ALBUM_INFO.PAGE_TITLE,
		},
		{
			name: "twitter:description",
			content: `${ALBUM_INFO.RELEASE_DATE} Release`,
		},
		{
			name: "twitter:image",
			content: ALBUM_INFO.IMAGE_URL,
		},
	];
};

export default function MadanteLp() {
	const [isLastSectionVisible, setIsLastSectionVisible] = useState(false);
	const lastSectionRef = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsLastSectionVisible(entry.isIntersecting);
			},
			{ threshold: 0.1 }, // 10%以上見えたら発火
		);

		if (lastSectionRef.current) {
			observer.observe(lastSectionRef.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div className="max-w-md mx-auto px-4 py-8">
			<header className="text-center pb-8">
				<img src={ALBUM_INFO.IMAGE_URL} alt={ALBUM_INFO.PAGE_TITLE} />

				<div className="p-4">
					<TypographyH1>{ALBUM_INFO.TITLE}</TypographyH1>
				</div>
				<div>
					<p>{`${ALBUM_INFO.ARTIST} / ${ALBUM_INFO.ALBUM_FORMAT}`}</p>
					<p>{`${ALBUM_INFO.RELEASE_DATE}`} Release</p>
					<p>{`${ALBUM_INFO.PRICE}`}</p>
				</div>
			</header>

			<main className="space-y-12">
				<section>
					<TypographyH2>収録曲</TypographyH2>
					<ol className="mt-6 px-4 space-y-4 list-decimal">
						{TRACK_LIST.map((track) => (
							<li key={track.TITLE}>
								<p className="font-bold">{track.TITLE}</p>

								<ul className="text-sm text-muted-foreground [&>li]:flex [&>li]:gap-1">
									<li>
										- <p>{track.CREDITS_1}</p>
									</li>
									<li>
										- <p>{track.CREDITS_2}</p>
									</li>
								</ul>
							</li>
						))}
					</ol>
				</section>

				<section>
					<TypographyH2>リリースツアー情報</TypographyH2>
					<div className="flex flex-col gap-1 mb-2 [&_div]:flex [&_div]:gap-1">
						<div>
							- <p>1/11よりRelease Tour「バロンのつのぶえ」開催</p>
						</div>
						<div>
							-
							<p>
								Tour Final &amp; 4.5周年記念ワンマン：2025年5月29日(木) 新宿LOFT
							</p>
						</div>
					</div>
					<img
						src="https://pbs.twimg.com/media/Gf7wd2NawAEI8nw?format=jpg&name=large"
						alt="ライブスケジュール"
					/>
				</section>

				<section>
					<TypographyH2>OFFICIAL WEB SHOP</TypographyH2>
					<Card className="overflow-hidden">
						<img src={ALBUM_INFO.IMAGE_URL} alt={ALBUM_INFO.PAGE_TITLE} />
						<CardHeader>
							<CardTitle>{ALBUM_INFO.TITLE}</CardTitle>
							<p>{`${ALBUM_INFO.ARTIST} / ${ALBUM_INFO.ALBUM_FORMAT}`}</p>
							<p>{`${ALBUM_INFO.PRICE}`}</p>
						</CardHeader>
						<CardContent>
							<Button asChild>
								<a
									ref={lastSectionRef}
									href={ALBUM_INFO.SHOP_URL}
									className="relative block w-full h-auto py-3 border-4 border-white text-black bg-yellow-400"
								>
									<div className="flex justify-start items-center gap-4 w-full font-bold">
										<ShoppingCart strokeWidth={3} className="!w-5 !h-5 -mx-1" />
										<div className="flex items-center gap-1">
											<span className="text-base">購入する</span>
											<span className="text-xs opacity-50">
												OFFICIAL WEB SHOP
											</span>
										</div>
									</div>
								</a>
							</Button>
						</CardContent>
					</Card>
				</section>
				<section className="text-center">
					<TypographyH2>THE+BETH</TypographyH2>
					<div className="flex flex-wrap justify-center gap-4 py-4">
						{Object.values({
							...OFFICIAL_INFO,
							THEBETH_PROFILE,
						}).map((info) => {
							return (
								<a
									key={info.URL}
									href={info.URL}
									target="_blank"
									rel="noreferrer"
									className="flex items-center gap-1"
								>
									<Play size={12} />
									{info.TITLE}
								</a>
							);
						})}
					</div>
				</section>
			</main>

			<div
				className={cn(
					"fixed right-0 bottom-0 w-full",
					isLastSectionVisible && "hidden", // 最後のセクションが見えたら非表示
				)}
			>
				<div className="flex justify-end max-w-md mx-auto">
					<a
						href={ALBUM_INFO.SHOP_URL}
						className="flex flex-col justify-center items-center gap-1 w-max m-4 p-2 aspect-square rounded-full border-4 border-white text-black bg-yellow-400"
					>
						<ShoppingCart size={24} strokeWidth={3} />
						<p className="text-[10px] font-bold">購入する</p>
					</a>
				</div>
			</div>
		</div>
	);
}

const ALBUM_INFO = {
	PAGE_TITLE: "THE+BETH 4th mini ALBUM「マダンテ」",
	TITLE: "マダンテ",
	ALBUM_FORMAT: "4th mini ALBUM",
	ARTIST: "THE+BETH",
	PRICE: "¥2,000",
	RELEASE_DATE: "2025.1.11",
	IMAGE_URL:
		"https://baseec-img-mng.akamaized.net/images/item/origin/901cad56007eefb1b8a030bfcbe960e9.png?imformat=generic&q=90&im=Resize,width=1280,type=normal",
	SHOP_URL: "https://thebeth.official.ec/items/96605556",
} as const;

const TRACK_LIST = [
	{
		TITLE: "フィラウティア",
		CREDITS_1: "words & music by はせしょ",
		CREDITS_2: "arranged by キクチハルカ",
	},
	{
		TITLE: "NEO69CLUSTER",
		CREDITS_1: "words by はせしょ",
		CREDITS_2: "music & arranged by ゆゆとまごはん",
	},
	{
		TITLE: "無限大",
		CREDITS_1: "words & music by はせしょ",
		CREDITS_2: "arranged by ゆゆとまごはん",
	},
	{
		TITLE: "超合金DXサバイバー",
		CREDITS_1: "words by はせしょ",
		CREDITS_2: "music & arranged by 高橋慶",
	},
	{
		TITLE: "ディスパーダ",
		CREDITS_1: "words by はせしょ",
		CREDITS_2: "music & arranged by 藤末樹",
	},
	{
		TITLE: "誇道",
		CREDITS_1: "words by はせしょ",
		CREDITS_2: "music & arranged by 高橋慶",
	},
] as const;

const THEBETH_PROFILE = {
	TITLE: "THE+BETH(ザベス)とは？",
	URL: "/profile",
};
