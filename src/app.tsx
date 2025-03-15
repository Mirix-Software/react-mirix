import { Controls } from '@components/controls';
import { Player } from '@components/player';
import { Button, Scrubber, Slider } from '@components/ui';
import { Icon } from '@components/ui/icon';
import { clampMax, clampMin } from '@lib/clamp';
import { debounce } from '@lib/debounce';
import { cn } from '@lib/utils';
import { SliderProps } from '@radix-ui/react-slider';
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
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [isSeeking, setIsSeeking] = useState(false);
    const [preventHide, setPreventHide] = useState(true);

    const [isVisible, setIsVisible] = useState(true);
    const hideTimerRef = useRef<number | null>(null);

    const resetHideTimer = () => {
        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
        }
        setIsVisible(true);

        if (!preventHide) {
            hideTimerRef.current = window.setTimeout(() => {
                setIsVisible(false);
            }, 1500);
        }
    };

    const handleSeek: ScrubberProps['onSeek'] = (value) => {
        setIsSeeking(true);
        setCurrent(value);
    };

    const handleSeekCommit: ScrubberProps['onSeekCommit'] = (value) => {
        const video = videoRef.current;
        if (!video) return;

        videoRef.current.currentTime = value;
        setIsSeeking(false);
    };

    const handleClick = (level: number) => {
        setLevel(level);
    };

    const handleManifestParsed: PlayerProps['onManifestParsed'] = (data) => {
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

        setIsFullscreen(!fullscreen);

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

    const handleTimeUpdate: PlayerProps['onTimeUpdate'] = (e) => {
        const video = e.currentTarget;

        if (video.duration && !isSeeking) setCurrent(video.currentTime);
    };

    const handleProgress: PlayerProps['onProgress'] = (e) => {
        const video = e.currentTarget;

        const ranges = [];
        for (let i = 0; i < video.buffered.length; i++) {
            ranges.push({
                start: video.buffered.start(i),
                end: video.buffered.end(i),
            });
        }

        setBuffer(ranges);
    };

    const handlePlay = () => {
        setIsPaused(false);
        setPreventHide(false);
    };

    const handlePause = () => {
        setIsPaused(true);
        setPreventHide(true);
    };

    const handleVolumeChange: PlayerProps['onVolumeChange'] = (e) => {
        const video = e.currentTarget;

        setVolume(e.currentTarget.volume);
        setMuted(e.currentTarget.muted);
    };

    const handleMouseEnter = () => {
        if (!isPaused) setPreventHide(true);
    };

    const handleMouseLeave = () => {
        if (!isPaused) setPreventHide(false);
    };

    const handleVolumeSliderChange: SliderProps['onValueChange'] = (value) => {
        const video = videoRef.current;
        if (!video) return;

        const volume = value?.[0] ?? 0;

        video.volume = volume;
        if (volume > 0 && videoRef.current.muted) {
            videoRef.current.muted = false;
            setMuted(false);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const currentRef = { current: video.currentTime };

        const debouncedUpdateTime = debounce((time: number) => {
            video.currentTime = time;
            setIsSeeking(false);
        }, 200);

        const handleKeyDown = async (e: KeyboardEvent) => {
            console.log(e.key);
            if (video.currentTime !== undefined && video.duration) {
                if (e.key === 'ArrowLeft') {
                    setIsSeeking(true);
                    resetHideTimer();
                    const newTime = clampMin(currentRef.current - 10, 0);
                    currentRef.current = newTime;
                    setCurrent(newTime);
                }
                if (e.key === 'ArrowRight') {
                    setIsSeeking(true);
                    resetHideTimer();
                    const newTime = clampMax(
                        currentRef.current + 10,
                        video.duration
                    );
                    currentRef.current = newTime;
                    setCurrent(newTime);
                }
                if (e.key === ' ') {
                    await handlePausedChange();
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                debouncedUpdateTime(currentRef.current);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
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

    useEffect(() => {
        resetHideTimer();
    }, [preventHide]);

    return (
        <div
            ref={containerRef}
            className={'relative w-full'}
            style={{ cursor: !isVisible ? 'none' : '' }}
            onMouseMove={resetHideTimer}
            onClick={handlePausedChange}
        >
            <Player
                ref={videoRef}
                url={videoUrl}
                level={level}
                onManifestParsed={handleManifestParsed}
                onLevelSwitched={handleLevelChange}
                onTimeUpdate={handleTimeUpdate}
                onProgress={handleProgress}
                onLoadedMetadata={handleProgress}
                onPlay={handlePlay}
                onPause={handlePause}
                onVolumeChange={handleVolumeChange}
            >
                <code>video</code> is not supported.
            </Player>
            <div
                className={
                    'w-full h-full absolute flex flex-col top-0 items-center justify-end'
                }
            >
                <div
                    className={cn(
                        'mb-8 transition-transform translate-y-4',
                        isVisible && 'translate-y-0'
                    )}
                >
                    <Controls
                        className={cn(
                            'transition-opacity opacity-0',
                            isVisible && 'opacity-100'
                        )}
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div
                            className={
                                'flex justify-between items-center w-full'
                            }
                        >
                            <Button className={'flex w-[332px]'}>
                                <div
                                    className={
                                        'w-full flex items-center justify-between'
                                    }
                                >
                                    <div
                                        className={'flex items-center gap-1.5'}
                                    >
                                        <Icon type={'playlist'} />
                                        Название эпизода • N эп.
                                    </div>
                                    <Icon
                                        className={'text-xs'}
                                        type={'caret'}
                                    />
                                </div>
                            </Button>
                            <Button
                                className={
                                    'text-[40px] transition-transform hover:scale-110'
                                }
                                variant={'text-active'}
                                size={'icon-lg'}
                                onClick={handlePausedChange}
                            >
                                <Icon type={isPaused ? 'play' : 'pause'} />
                            </Button>
                            <div className={'flex items-center gap-4'}>
                                <div
                                    className={
                                        'absolute top-[-40px] flex gap-1'
                                    }
                                >
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
                                <Button className={'w-[52px] px-0'} size={'sm'}>
                                    {currentQuality}
                                </Button>
                                <Button
                                    variant={'text'}
                                    size={'icon-lg'}
                                    // onClick={handleFullScreen}
                                >
                                    <Icon type={'volume'} />
                                </Button>
                                <Slider
                                    className={'w-16'}
                                    value={[volume]}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    onValueChange={handleVolumeSliderChange}
                                />
                                {muted && 'muted'}
                                <Button
                                    variant={'text'}
                                    size={'icon-lg'}
                                    // onClick={handleFullScreen}
                                >
                                    <Icon type={'settings'} />
                                </Button>
                                <Button
                                    variant={'text'}
                                    size={'icon-lg'}
                                    // onClick={handleFullScreen}
                                >
                                    <Icon type={'share'} />
                                </Button>
                                <Button
                                    variant={'text'}
                                    size={'icon-lg'}
                                    // onClick={handleFullScreen}
                                >
                                    <Icon type={'pip'} />
                                </Button>
                                <Button
                                    variant={'text'}
                                    size={'icon-lg'}
                                    onClick={handleFullScreen}
                                >
                                    <Icon
                                        type={
                                            isFullscreen
                                                ? 'minimize'
                                                : 'maximize'
                                        }
                                    />
                                </Button>
                            </div>
                        </div>
                        <Scrubber
                            current={current}
                            duration={videoRef.current?.duration}
                            buffer={buffer}
                            onSeek={handleSeek}
                            onSeekCommit={handleSeekCommit}
                        />
                    </Controls>
                </div>
            </div>
        </div>
    );
}
