import { clampMax, clampMin } from '@lib/clamp';

export const getPosition = (
    min: number,
    max: number,
    end: number,
    start?: number
) => ({
    left: `${start ? clampMin(((start - min) / (max - min)) * 100, 0) : 0}%`,
    right: `${clampMax(100 - ((end - min) / (max - min)) * 100, 100)}%`,
});
