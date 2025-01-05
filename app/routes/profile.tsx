import { ChevronRight, ChevronsDown } from "lucide-react";
import { CarouselItem, CarouselWithVertical } from "~/components/carousel";
import { XIcon } from "~/components/XIcon";
import { cn } from "~/lib/utils";

export default function Index() {
	return (
		<div className="max-w-md mx-auto">
			<CarouselWithVertical
				renderItem={(handleClickDot) => {
					return (
						<>
							<CarouselItem>
								<ProfilesScreen onClickProfile={handleClickDot} />
							</CarouselItem>

							{Object.values(PROFILE).map((profile) => {
								return (
									<CarouselItem key={profile.NAME_EN}>
										<ProfileScreen profile={profile} />
									</CarouselItem>
								);
							})}

							<CarouselItem>
								<LinkScreen />
							</CarouselItem>
						</>
					);
				}}
			/>
		</div>
	);
}

const GRADIENT_CLASS_NAME = "bg-gradient-to-t from-black to-transparent";

const PROFILE_INFO = {
	TITLE: "THE+BETH(ザベス)",
	DESCRIPTION:
		"全員ポンコツ。\n偏差値低めなズッコケ空回り系だけど常に全力。\nROCKとは何なのか。 PUNKとは何なのか。\n初めて聞いた【生き様】という言葉の意味を探しながら、NiziUのようになれるような夢を見がちな\n『NEO ROCK CLUSTER』",
};

const PROFILE = {
	AI_CARBONARA: {
		NAME_EN: "AI CARBONARA",
		NAME_JA: "アイ・カルボナーラ",
		DESCRIPTION: "茨城産\n激しくポンコツ担当",
		IMAGE_URL:
			"https://thebeth.jp/wp-content/themes/thebeth/assets/img/pic_prof2409_ai02.png",
		X_URL: "https://x.com/ai_THE_BETH",
	},
	REINA_CRESCENDO: {
		NAME_EN: "REINA CRESCENDO",
		NAME_JA: "レイナ・クレッシェンド",
		DESCRIPTION: "京都産\nかなりポンコツ担当",
		IMAGE_URL:
			"https://thebeth.jp/wp-content/themes/thebeth/assets/img/pic_prof2409_re02.png",
		X_URL: "https://x.com/reina_THE_BETH",
	},
	HINAACE: {
		NAME_EN: "HINA ACE",
		NAME_JA: "ヒナエース",
		DESCRIPTION: "兵庫産\nとんでもなくポンコツ担当",
		IMAGE_URL:
			"https://thebeth.jp/wp-content/themes/thebeth/assets/img/pic_prof2409_hi02.png",
		X_URL: "https://x.com/hina_THE_BETH",
	},
};

const THEBETH_LOGO_URL =
	"https://prd.resource-api.lit.link/images/creators/9d1ed2bd-ab22-4628-9dfc-2ed86aade96d/168952ed-ddd8-4ce8-b2a4-cc3ebb2feb71.png";

const OFFICIAL_INFO = {
	SITE: {
		TITLE: "OFFICIAL SITE",
		URL: "https://thebeth.jp/",
	},
	WEB_SHOP: {
		TITLE: "OFFICIAL WEB SHOP",
		URL: "https://thebeth.official.ec/",
	},
	MUSIC_STREAMING_SERVICES: {
		TITLE: "Music Streaming Services",
		URL: "https://lit.link/THEBETH",
	},
	X: {
		TITLE: "X(Twitter)",
		URL: "https://x.com/THE_BETH_JP",
	},
	YOUTUBE: {
		TITLE: "YOUTUBE",
		URL: "https://www.youtube.com/@THEBETHOffcial-",
	},
};

type ProfilesScreenProps = {
	onClickProfile: (index: number) => void;
};

const ProfilesScreen = ({ onClickProfile }: ProfilesScreenProps) => {
	// NOTE: AI_CARBONARA をセンターにする
	const profilesReordered = Object.values([
		PROFILE.REINA_CRESCENDO,
		PROFILE.AI_CARBONARA,
		PROFILE.HINAACE,
	]);

	const getNavigateIndex = (nameEn: string) => {
		switch (nameEn) {
			case "REINA CRESCENDO":
				return 2;
			case "AI CARBONARA":
				return 1;
			case "HINA ACE":
				return 3;
			default:
				return 4;
		}
	};

	return (
		<div className="overflow-hidden relative flex items-end h-full pt-10">
			<div className="flex flex-col justify-end items-center gap-10 pb-10 text-center z-10">
				<p className="text-3xl font-bold">{PROFILE_INFO.TITLE}</p>
				<p className="whitespace-pre-wrap">{PROFILE_INFO.DESCRIPTION}</p>
				<ChevronsDown size={40} className="animate-bounce" />
			</div>
			<div className="absolute top-0 left-0 flex w-full h-full">
				{profilesReordered.map((profile, index) => {
					const handleClick = () => {
						const navigateIndex = getNavigateIndex(profile.NAME_EN);
						onClickProfile(navigateIndex);
					};

					return (
						<button
							key={profile.NAME_EN}
							type="button"
							onClick={handleClick}
							className={cn(
								"flex flex-1 pt-10",
								GRADIENT_CLASS_NAME,
								index !== 0 && "ml-1",
							)}
						>
							<div className={cn("h-full", GRADIENT_CLASS_NAME)}>
								<img
									src={profile.IMAGE_URL}
									alt={profile.DESCRIPTION}
									className="w-full h-full object-cover relative -z-10"
								/>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
};

type ProfileScreenProps = {
	profile: (typeof PROFILE)[keyof typeof PROFILE];
};

const ProfileScreen = ({ profile }: ProfileScreenProps) => {
	return (
		<div className="overflow-hidden relative flex justify-end items-end h-full">
			<div className={cn("absolute w-full h-full", GRADIENT_CLASS_NAME)}>
				<img
					src={profile.IMAGE_URL}
					alt={profile.DESCRIPTION}
					className="w-full h-full object-cover relative -z-10"
				/>
			</div>
			<div className="relative z-10 flex flex-col justify-end gap-10 w-full h-[50%] px-8 pb-10">
				<div>
					<span className="text-3xl font-bold leading-none">
						{profile.NAME_EN}
					</span>
					<div className="flex items-center gap-2">
						<p className="text-lg font-bold">{profile.NAME_JA}</p>
						<a
							href={profile.X_URL}
							target="_blank"
							rel="noreferrer"
							className="flex border border-white rounded-[4px] p-1"
						>
							<XIcon size={16} />
						</a>
					</div>
				</div>
				<p className="whitespace-pre-wrap">{profile.DESCRIPTION}</p>
			</div>
		</div>
	);
};

const LinkScreen = () => {
	return (
		<div className="flex flex-col justify-center h-full px-9 bg-white">
			<img src={THEBETH_LOGO_URL} alt="THE+BETH" />
			<div className="flex flex-col">
				{Object.values(OFFICIAL_INFO).map((info, index) => {
					return (
						<a
							key={info.TITLE}
							href={info.URL}
							className={cn(
								"flex justify-between py-4 text-lg text-black font-bold",
								index !== 0 && "border-t",
							)}
						>
							<span>{info.TITLE}</span>
							<ChevronRight />
						</a>
					);
				})}
			</div>
		</div>
	);
};
