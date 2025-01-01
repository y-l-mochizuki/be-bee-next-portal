import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState, type PropsWithChildren } from "react";
import { cn } from "~/lib/utils";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

type Props = {
	renderItem: (handleClickDot: (index: number) => void) => React.ReactNode;
};

export const CarouselWithVertical = ({ renderItem }: Props) => {
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: false,
			axis: "y",
		},
		[WheelGesturesPlugin()],
	);

	const [dots, setDots] = useState<number[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleClickDot = (index: number) => {
		emblaApi?.scrollTo(index);
		setSelectedIndex(index);
	};

	useEffect(() => {
		if (!emblaApi) return;

		const onSelect = () => {
			setSelectedIndex(emblaApi.selectedScrollSnap());
		};

		emblaApi.on("select", onSelect);
		setDots(Array.from(Array(emblaApi.slideNodes().length).keys()));
	}, [emblaApi]);

	return (
		<div className="overflow-hidden relative" ref={emblaRef}>
			<div className="flex flex-col h-[100svh]">
				{renderItem(handleClickDot)}
			</div>
			<div className="absolute top-0 right-0 z-10 flex flex-col justify-center h-full">
				{dots.map((dot) => (
					<button
						key={dot}
						type="button"
						onClick={() => handleClickDot(dot)}
						className="p-2"
					>
						<div
							className={cn(
								"w-2 h-2 border bg-white",
								selectedIndex === dot && "bg-[#ffc81e]",
							)}
						/>
					</button>
				))}
			</div>
		</div>
	);
};

export const CarouselItem = ({ children }: PropsWithChildren) => {
	return <div className="flex-none w-full min-w-0 h-full">{children}</div>;
};
