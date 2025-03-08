import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ScrubberTimeDisplayProps {
	value: number | null;
	className?: string;
	overlay?: number | null;
}

export interface ScrubberTrackProps {
	current?: number | null;
	duration?: number | null;
	buffer?: { start: number; end: number }[];
	onSeek?: (value: number) => void;
}

export type ScrubberProps = DetailedHTMLProps<
	HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
> &
	ScrubberTrackProps;
