import { IconTypes } from '@types';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { Props as ReactSVGProps } from 'react-svg';

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
    onSeekCommit?: (value: number) => void;
}

export type ScrubberProps = DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
> &
    ScrubberTrackProps;

export interface IconProps extends Omit<ReactSVGProps, 'src' | 'type'> {
    type?: keyof typeof IconTypes;
    src?: string;
}
