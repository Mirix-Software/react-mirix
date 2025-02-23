import { cn } from '@lib/utils';
import { ScrubberProps } from '@types';
import { forwardRef } from 'react';
import { ScrubberTimeDisplay } from './scrubber-time-display';
import { ScrubberTrack } from './scrubber-track';

const CL_CONTAINER = 'select-none flex items-center gap-2.5 w-full h-12';
const CL_TIME_DISPLAY_CURRENT = 'text-right';
const CL_TIME_DISPLAY_DURATION = 'text-left';

export const Scrubber = forwardRef<HTMLDivElement, ScrubberProps>(
	(
		{ className, current = null, duration = null, buffer, onSeek, ...rest },
		ref
	) => {
		return (
			<div ref={ref} className={cn(CL_CONTAINER, className)} {...rest}>
				<ScrubberTimeDisplay
					className={CL_TIME_DISPLAY_CURRENT}
					value={current}
				/>
				<ScrubberTrack
					current={current}
					duration={duration}
					buffer={buffer}
					onSeek={onSeek}
				/>
				<ScrubberTimeDisplay
					className={CL_TIME_DISPLAY_DURATION}
					value={duration}
					overlay={current}
				/>
			</div>
		);
	}
);
