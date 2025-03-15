import { clamp } from '@lib/clamp';
import { MouseEvent, PointerEvent } from 'react';

export const getTime = (
    pointerEvent: PointerEvent | MouseEvent,
    element: HTMLElement,
    duration: number
) => {
    const rect = element.getBoundingClientRect();
    const percent = (pointerEvent.clientX - rect.left) / rect.width;

    return clamp(percent * duration, 0, duration);
};
