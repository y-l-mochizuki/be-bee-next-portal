import { ChevronRight, ChevronsDown, createLucideIcon } from "lucide-react";
import { CarouselItem, CarouselWithVertical } from "~/components/carousel";
import { cn } from "~/lib/utils";

export default function Index() {
	return (
		<div className="max-w-md mx-auto">
			<CarouselWithVertical
				renderItem={(handleClickDot) => {
					return (
						<>
							<CarouselItem>
								<div className="overflow-hidden relative flex items-end h-full pt-10">
									<div className="flex flex-col justify-end items-center gap-10 pb-10 text-center z-10">
										<p className="text-3xl font-bold">{PROFILE_INFO.TITLE}</p>
										<p className="whitespace-pre-wrap">
											{PROFILE_INFO.DESCRIPTION}
										</p>
										<CustomChevronsDown />
									</div>
									<div className="absolute top-0 left-0 flex w-full h-full">
										{Object.values([
											PROFILE.REINA_CRESCENDO,
											PROFILE.AI_CARBONARA,
											PROFILE.HINAACE,
										]).map((item, index) => {
											const navigateIndex = (() => {
												switch (item.nameEn) {
													case "REINA CRESCENDO":
														return 2;
													case "AI CARBONARA":
														return 1;
													case "HINA ACE":
														return 3;
													default:
														return 4;
												}
											})();

											return (
												<button
													key={item.nameEn}
													type="button"
													onClick={() => {
														handleClickDot(navigateIndex);
													}}
													className={cn(
														"flex flex-1 pt-10",
														GRADIENT_CLASS_NAME,
														index !== 0 && "ml-1",
													)}
												>
													<div className={cn("h-full", GRADIENT_CLASS_NAME)}>
														<img
															src={item.image}
															alt={item.description}
															className="w-full h-full object-cover relative -z-10"
														/>
													</div>
												</button>
											);
										})}
									</div>
								</div>
							</CarouselItem>
							{Object.values(PROFILE).map((item) => {
								return (
									<CarouselItem key={item.nameEn}>
										<div className="overflow-hidden relative flex justify-end items-end h-full">
											<div
												className={cn(
													"absolute w-full h-full",
													GRADIENT_CLASS_NAME,
												)}
											>
												<img
													src={item.image}
													alt={item.description}
													className="w-full h-full object-cover relative -z-10"
												/>
											</div>
											<div className="relative z-10 flex flex-col justify-end gap-10 w-full h-[50%] px-8 pb-10">
												<div>
													<span className="text-3xl font-bold leading-none">
														{item.nameEn}
													</span>
													<div className="flex items-center gap-2">
														<p className="text-lg font-bold">{item.nameJa}</p>
														<a
															href={item.xLink}
															target="_blank"
															rel="noreferrer"
														>
															<XIcon size={16} />
														</a>
													</div>
												</div>
												<p className="whitespace-pre-wrap">
													{item.description}
												</p>
												<div className="flex justify-center">
													<CustomChevronsDown />
												</div>
											</div>
										</div>
									</CarouselItem>
								);
							})}

							<CarouselItem>
								<div className="flex flex-col justify-center h-full px-9 bg-white">
									<img src={THEBETH_LOGO} alt="THE+BETH" />
									<div className="flex flex-col">
										{Object.values(OFFICIAL_INFO).map((info, index) => {
											return (
												<a
													key={info.title}
													href={info.link}
													className={cn(
														"flex justify-between py-4 text-lg text-black font-bold",
														index !== 0 && "border-t",
													)}
												>
													<span>{info.title}</span>
													<ChevronRight />
												</a>
											);
										})}
									</div>
								</div>
							</CarouselItem>
						</>
					);
				}}
			/>
		</div>
	);
}

const CustomChevronsDown = () => {
	return <ChevronsDown size={40} className="animate-bounce" />;
};

const GRADIENT_CLASS_NAME = "bg-gradient-to-t from-black to-transparent";

const PROFILE_INFO = {
	TITLE: "THE+BETH(ザベス)",
	DESCRIPTION:
		"全員ポンコツ。\n偏差値低めなズッコケ空回り系だけど常に全力。\nROCKとは何なのか。 PUNKとは何なのか。\n初めて聞いた【生き様】という言葉の意味を探しながら、NiziUのようになれるような夢を見がちな『NEO ROCK CLUSTER』",
};

const PROFILE = {
	AI_CARBONARA: {
		nameEn: "AI CARBONARA",
		nameJa: "アイ・カルボナーラ",
		description: "茨城産\n激しくポンコツ担当",
		image:
			"https://thebeth.jp/wp-content/themes/thebeth/assets/img/pic_prof2409_ai02.png",
		xLink: "https://x.com/ai_THE_BETH",
	},
	REINA_CRESCENDO: {
		nameEn: "REINA CRESCENDO",
		nameJa: "レイナ・クレッシェンド",
		description: "京都産\nかなりポンコツ担当",
		image:
			"https://thebeth.jp/wp-content/themes/thebeth/assets/img/pic_prof2409_re02.png",
		xLink: "https://x.com/reina_THE_BETH",
	},
	HINAACE: {
		nameEn: "HINA ACE",
		nameJa: "ヒナエース",
		description: "兵庫産\nとんでもなくポンコツ担当",
		image:
			"https://thebeth.jp/wp-content/themes/thebeth/assets/img/pic_prof2409_hi02.png",
		xLink: "https://x.com/hina_THE_BETH",
	},
};

const THEBETH_LOGO =
	"https://prd.resource-api.lit.link/images/creators/9d1ed2bd-ab22-4628-9dfc-2ed86aade96d/168952ed-ddd8-4ce8-b2a4-cc3ebb2feb71.png";

const OFFICIAL_INFO = {
	SITE: {
		title: "OFFICIAL SITE",
		link: "https://thebeth.jp/",
	},
	WEB_SHOP: {
		title: "OFFICIAL WEB SHOP",
		link: "https://thebeth.official.ec/",
	},
	MUSIC_STREAMING_SERVICES: {
		title: "Music Streaming Services",
		link: "https://lit.link/THEBETH",
	},
	X: {
		title: "X(Twitter)",
		link: "https://x.com/THE_BETH_JP",
	},
	YOUTUBE: {
		title: "YOUTUBE",
		link: "https://www.youtube.com/@THEBETHOffcial-",
	},
};

const XIcon = createLucideIcon("X", [
	[
		"path",
		{
			d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
			stroke: "none",
			fill: "currentColor",
		},
	],
]);
