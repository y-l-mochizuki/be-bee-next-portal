import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";
import { cn } from "~/lib/utils";

const GRADIENT_CLASS_NAME = "bg-gradient-to-t from-black to-transparent";

export default function Index() {
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, axis: "y" });

	useEffect(() => {
		if (emblaApi) {
			console.log(emblaApi.slideNodes()); // Access API
		}
	}, [emblaApi]);

	return (
		<div>
			<div className="embla" ref={emblaRef}>
				<div className="embla__container">
					<div className="embla__slide">
						<div className="overflow-hidden relative flex items-end h-full pt-10">
							<div
								className={cn(
									"flex flex-col justify-end items-center h-full py-10 text-center",
									GRADIENT_CLASS_NAME,
								)}
							>
								<p className="whitespace-pre-wrap">{PROFILE_DESCRIPTION}</p>
								<span className="mt-10">MEMBER</span>
							</div>
							<div className="absolute top-0 left-0 -z-10 flex w-full h-full">
								{Object.values(data).map((item, index) => {
									return (
										<div
											key={item.nameEn}
											className={cn(
												"flex-1 h-full pt-10",
												index !== 0 && "ml-0.5",
											)}
										>
											<img
												src={item.image}
												alt={item.description}
												className="w-full h-full object-cover"
											/>
										</div>
									);
								})}
							</div>
						</div>
					</div>

					{Object.values(data).map((item) => {
						return (
							<div className="embla__slide" key={item.nameEn}>
								<div className="overflow-hidden relative flex justify-end items-end h-full">
									<img
										src={item.image}
										alt={item.description}
										className="absolute w-full h-5/4 object-cover -z-10"
									/>
									<div
										className={cn(
											"flex flex-col justify-end w-full h-[50%] pl-8 pb-10",
											GRADIENT_CLASS_NAME,
										)}
									>
										<span className="text-3xl font-bold leading-none">
											{item.nameEn}
										</span>
										<p className="text-lg font-bold">{item.nameJa}</p>
										<p className="mt-5 whitespace-pre-wrap">
											{item.description}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

const PROFILE_DESCRIPTION =
	"全員ポンコツ。\n偏差値低めなズッコケ空回り系だけど常に全力。\nROCKとは何なのか。 PUNKとは何なのか。\n初めて聞いた【生き様】という言葉の意味を探しながら、NiziUのようになれるような夢を見がちな『NEO ROCK CLUSTER』";

const data = {
	AI_CARBONARA: {
		nameEn: "AI\nCARBONARA",
		nameJa: "アイ・カルボナーラ",
		description: "茨城産\n激しくポンコツ担当",
		image:
			"https://thebeth.jp/wp-content/themes/thebeth/assets/img/pic_prof2409_ai02.png",
	},
	REINA_CRESCENDO: {
		nameEn: "REINA\nCRESCENDO",
		nameJa: "レイナ・クレッシェンド",
		description: "京都産\nかなりポンコツ担当",
		image:
			"https://thebeth.jp/wp-content/themes/thebeth/assets/img/pic_prof2409_re02.png",
	},
	HINAACE: {
		nameEn: "HINAACE",
		nameJa: "ヒナエース",
		description: "兵庫産\nとんでもなくポンコツ担当",
		image:
			"https://thebeth.jp/wp-content/themes/thebeth/assets/img/pic_prof2409_hi02.png",
	},
};
