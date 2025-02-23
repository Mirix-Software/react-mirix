import Hls from 'hls.js';
import { RefObject } from 'react';

export const hlsChangeLevel = (
	hlsRef: RefObject<Hls | null>,
	level: number
) => {
	const hls = hlsRef.current;
	if (!hls) return;

	hls.currentLevel = level;
};
