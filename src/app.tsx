import { Controls } from '@components/controls';
import { Player } from '@components/player';
import { Button, Scrubber } from '@components/ui';
import { PlayerProps, ScrubberProps } from '@types';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';

export default function App() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [currentQuality, setCurrentQuality] = useState('');
	const [level, setLevel] = useState(-1);
	const [qualityOptions, setQualityOptions] = useState([
		{ label: 'Авто', value: -1 },
	]);
	const [searchParams, setSearchParams] = useSearchParams();
	const videoUrl = searchParams.get('video-url') ?? '';
	const [current, setCurrent] = useState<number | null>(null);
	const [buffer, setBuffer] = useState<{ start: number; end: number }[]>([]);

	const handleSeek: ScrubberProps['onSeek'] = (value) => {
		if (videoRef.current) videoRef.current.currentTime = value;
	};

	const handleClick = (level: number) => {
		setLevel(level);
	};

	const handleParsed: PlayerProps['onManifestParsed'] = (data) => {
		setQualityOptions([
			{ label: 'Авто', value: -1 },
			...data.levels.map((level, index) => ({
				label: `${level.height}p`,
				value: index,
			})),
		]);
	};

	const handleLevelChange: PlayerProps['onLevelSwitched'] = (
		_data,
		level
	) => {
		setCurrentQuality(`${level.height}p`);
	};

	const handleFullScreen = async () => {
		const container = containerRef.current;
		const video = videoRef.current;
		if (!(video && container)) return;

		const fullscreen =
			document.fullscreenElement ||
			// @ts-ignore
			document.webkitFullscreenElement;

		if (navigator.userAgent.indexOf('iPhone') !== -1) {
			if (fullscreen) {
				// @ts-ignore
				await video.webkitExitFullscreen();
			} else {
				// @ts-ignore
				await video.webkitEnterFullscreen();
			}
		} else {
			if (fullscreen) {
				await document.exitFullscreen();
			} else {
				await container.requestFullscreen();
			}
		}
	};

	const handlePausedChange = async () => {
		const video = videoRef.current;
		if (!video) return;

		if (video.paused) {
			await video.play();
		} else {
			video.pause();
		}
	};

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const handleTimeUpdate = () => {
			if (video.duration) setCurrent(video.currentTime);
		};

		const handleProgress = () => {
			const ranges = [];
			for (let i = 0; i < video.buffered.length; i++) {
				ranges.push({
					start: video.buffered.start(i),
					end: video.buffered.end(i),
				});
			}
			setBuffer(ranges);
		};

		video.addEventListener('timeupdate', handleTimeUpdate);
		video.addEventListener('progress', handleProgress);
		video.addEventListener('loadedmetadata', handleProgress);

		return () => {
			if (video) {
				video.removeEventListener('timeupdate', handleTimeUpdate);
				video.removeEventListener('progress', handleProgress);
				video.removeEventListener('loadedmetadata', handleProgress);
			}
		};
	}, []);

	useEffect(() => {
		if (!videoUrl) {
			setSearchParams(
				{ ['video-url']: 'hls/test/master.m3u8' },
				{ replace: true }
			);
		}
	}, [videoUrl, setSearchParams]);

	return (
		<div ref={containerRef} className={'relative w-full'}>
			<Player
				ref={videoRef}
				url={videoUrl}
				level={level}
				onManifestParsed={handleParsed}
				onLevelSwitched={handleLevelChange}
			>
				<code>video</code> is not supported.
			</Player>
			<div
				className={
					'w-full h-full absolute flex flex-col top-0 items-center justify-end'
				}
			>
				<div className={'mb-8'}>
					<Controls>
						<div
							className={
								'flex justify-between items-center w-full'
							}
						>
							<div
								className={'flex w-[242px] items-center gap-2'}
							>
								quality: {currentQuality}
							</div>
							<Button onClick={handlePausedChange}>
								{videoRef?.current?.paused ? 'play' : 'pause'}
							</Button>
							<div className={'flex items-center gap-2'}>
								<div className={'flex gap-1'}>
									{qualityOptions.map((option) => (
										<Button
											key={option.value}
											variant={
												level === option.value
													? 'destructive'
													: 'default'
											}
											onClick={() =>
												handleClick(option.value)
											}
										>
											{option.label}
										</Button>
									))}
								</div>
								<Button onClick={handleFullScreen}>
									fullscreen
								</Button>
							</div>
						</div>
						<Scrubber
							current={current}
							duration={videoRef.current?.duration}
							buffer={buffer}
							onSeek={handleSeek}
						/>
					</Controls>
				</div>
			</div>
		</div>
	);
}
