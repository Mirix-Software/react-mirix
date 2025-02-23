import { formatTime } from '@lib/format-time';
import { cn } from '@lib/utils';
import { ScrubberTimeDisplayProps } from '@types';
import { FC } from 'react';

const CL_MIN_W = 'min-w-[42px]';
const CL_FONT = 'text-sm font-medium leading-none';
const CL_TEXT = `select-none text-inner-tertiary`;

export const ScrubberTimeDisplay: FC<ScrubberTimeDisplayProps> = ({
	value,
	overlay,
	className,
}) => {
	if (overlay === undefined) {
		return (
			<span
				className={cn(
					CL_MIN_W,
					CL_FONT,
					CL_TEXT,
					value !== null && 'text-primary',
					className
				)}
			>
				{formatTime(value)}
			</span>
		);
	}

	return (
		<div
			className={cn(
				'relative flex items-center group h-full',
				CL_FONT,
				CL_MIN_W,
				className
			)}
		>
			{value !== null && value !== overlay && !!overlay && (
				<span
					className={cn(
						CL_TEXT,
						'absolute opacity-0 text-secondary group-hover:opacity-100'
					)}
				>
					-{formatTime(Math.abs(overlay - value))}
				</span>
			)}
			<span
				className={cn(
					CL_TEXT,
					value !== null && 'text-secondary',
					overlay && value !== overlay && 'group-hover:opacity-0'
				)}
			>
				{formatTime(value)}
			</span>
		</div>
	);
};
