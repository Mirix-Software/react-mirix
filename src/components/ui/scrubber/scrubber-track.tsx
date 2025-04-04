import { formatTime } from '@lib/format-time';
import { getPosition } from '@lib/scrubber';
import { getTime } from '@lib/scrubber/get-time';
import { cn } from '@lib/utils';
import { ScrubberTrackProps } from '@types';
import { FC, MouseEvent, PointerEvent, useRef, useState } from 'react';

const CL_CONTAINER = 'relative flex items-center w-full h-full';
const CL_CONTAINER_ACTIVE = 'cursor-pointer group';
const CL_TRACK =
    'relative overflow-hidden w-full h-1.5 max-h-0.5 bg-inner-primary rounded-md transition-[max-height] ease-[ease] group-hover:max-h-1.5';
const CL_BAR = 'absolute h-full rounded-md';
const CL_BAR_CURRENT = cn(CL_BAR, 'bg-brand z-3');
const CL_BAR_SEEK = cn(
    CL_BAR,
    'bg-tertiary opacity-0 transition-opacity ease-[ease] group-hover:opacity-100'
);
const CL_BAR_BUFFER = cn(CL_BAR, 'bg-secondary');
const CL_POINT =
    'absolute ring-ring/50 size-3 rounded-full bg-brand opacity-0 shadow-sm z-4 transition-opacity duration-150 ease-[ease] group-hover:opacity-100';
const CL_TIME_DISPLAY =
    'absolute bg-inner-primary rounded-sm text-xs leading-none p-(--scrubber-track-hover-time-padding) opacity-0 transition-opacity duration-150 ease-[ease] group-hover:opacity-100';

export const ScrubberTrack: FC<ScrubberTrackProps> = ({
    current = null,
    duration = null,
    buffer,
    onSeek,
    onSeekCommit,
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [seek, setSeek] = useState(0);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (current === null || duration === null || !trackRef.current) return;

        setSeek(getTime(e, trackRef.current, duration));
    };

    const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (current === null || duration === null || !trackRef.current) return;

        trackRef.current.setPointerCapture(e.pointerId);
        const time = getTime(e, trackRef.current, duration);

        onSeek?.(time);

        let lastTime = time;

        const handlePointerMove = (e: PointerEvent) => {
            if (current === null || duration === null || !trackRef.current)
                return;
            lastTime = getTime(e, trackRef.current, duration);

            onSeek?.(lastTime);
        };

        const handlePointerUp = () => {
            onSeekCommit?.(lastTime);

            trackRef.current?.releasePointerCapture(e.pointerId);
            window.removeEventListener('pointermove', handlePointerMove as any);
            window.removeEventListener('pointerup', handlePointerUp as any);
        };

        window.addEventListener('pointermove', handlePointerMove as any);
        window.addEventListener('pointerup', handlePointerUp as any);
    };

    return (
        <div
            className={cn(
                CL_CONTAINER,
                current !== null && duration !== null && CL_CONTAINER_ACTIVE
            )}
            onMouseMove={handleMouseMove}
            onPointerDown={handlePointerDown}
        >
            <div ref={trackRef} className={CL_TRACK}>
                {current !== null && duration !== null && (
                    <>
                        <div
                            className={CL_BAR_CURRENT}
                            style={getPosition(0, duration, current)}
                        />
                        <div
                            className={CL_BAR_SEEK}
                            style={getPosition(0, duration, seek)}
                        />
                        {buffer?.map((item, index) => (
                            <div
                                key={index}
                                className={CL_BAR_BUFFER}
                                style={getPosition(
                                    0,
                                    duration,
                                    item.end,
                                    current >= item.start ? 0 : item.start
                                )}
                            />
                        ))}
                    </>
                )}
            </div>
            {current !== null && duration !== null && (
                <>
                    <div
                        className={CL_POINT}
                        style={{
                            left: `calc(${getPosition(0, duration, current, current).left} - 6px)`,
                        }}
                    />
                    <div
                        className={CL_TIME_DISPLAY}
                        style={{
                            top: -2,
                            left: `calc(${getPosition(0, duration, seek, seek).left} - 19px)`,
                        }}
                    >
                        {formatTime(seek)}
                    </div>
                </>
            )}
        </div>
    );
};
