import { type ClassValue, clsx } from 'clsx';
import { MutableRefObject, Ref } from 'react';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const isMutableRef = <T>(
	ref: Ref<T> | undefined
): ref is MutableRefObject<T | null> => {
	return ref !== null && typeof ref === 'object' && 'current' in ref;
};
