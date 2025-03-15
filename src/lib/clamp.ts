export const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);
export const clampMin = (value: number, min: number): number =>
    Math.max(value, min);
export const clampMax = (value: number, max: number): number =>
    Math.min(value, max);
