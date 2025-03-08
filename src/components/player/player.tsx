import { hlsChangeLevel, hlsInit } from '@lib/hls';
import { isMutableRef } from '@lib/utils';
import { PlayerProps } from '@types';
import Hls from 'hls.js';
import { MutableRefObject, forwardRef, useEffect, useRef } from 'react';

export const Player = forwardRef<HTMLVideoElement, PlayerProps>(
	(
		{
			hlsRef: hlsRefProp,
			config,
			url = '',
			level = -1,
			onMediaAttaching,
			onMediaAttached,
			onMediaDetaching,
			onMediaDetached,
			onBufferReset,
			onBufferCodecs,
			onBufferCreated,
			onBufferAppending,
			onBufferAppended,
			onBufferEOS,
			onBufferFlushing,
			onBufferFlushed,
			onManifestLoading,
			onManifestLoaded,
			onManifestParsed,
			onLevelSwitching,
			onLevelSwitched,
			onLevelLoading,
			onLevelLoaded,
			onLevelUpdated,
			onLevelPTSUpdated,
			onLevelsUpdated,
			onAudioTracksUpdated,
			onAudioTracksSwitching,
			onAudioTracksSwitched,
			onAudioTrackLoading,
			onAudioTrackLoaded,
			onSubtitleTracksUpdated,
			onSubtitleTracksCleared,
			onSubtitleTrackSwitch,
			onSubtitleTrackLoading,
			onSubtitleTrackLoaded,
			onSubtitleFragProcessed,
			onCuesParsed,
			onNonNativeTextTracksFound,
			onInitPtsFound,
			onFragLoading,
			onFragLoadEmergencyAborted,
			onFragLoaded,
			onFragDecrypted,
			onFragParsingInitSegment,
			onFragParsingUserdata,
			onFragParsingMetadata,
			onFragParsed,
			onFragBuffered,
			onFragChanged,
			onFPSDrop,
			onFPSDropLevelCapping,
			onMaxAutoLevelUpdated,
			onHLSError,
			onDestroying,
			onKeyLoading,
			onKeyLoaded,
			onLiveBackBufferReached,
			onBackBufferReached,
			onSteeringManifestLoaded,
			...rest
		},
		videoRefProp
	) => {
		const innerVideoRef = useRef<HTMLVideoElement>(null);
		const innerHlsRef = useRef<Hls | null>(null);

		const videoRef: MutableRefObject<HTMLVideoElement | null> =
			isMutableRef(videoRefProp) ? videoRefProp : innerVideoRef;
		const hlsRef: MutableRefObject<Hls | null> = isMutableRef(hlsRefProp)
			? hlsRefProp
			: innerHlsRef;

		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(
			() =>
				hlsInit({
					videoRef,
					hlsRef,
					url,
					config,
					onMediaAttaching,
					onMediaAttached,
					onMediaDetaching,
					onMediaDetached,
					onBufferReset,
					onBufferCodecs,
					onBufferCreated,
					onBufferAppending,
					onBufferAppended,
					onBufferEOS,
					onBufferFlushing,
					onBufferFlushed,
					onManifestLoading,
					onManifestLoaded,
					onManifestParsed,
					onLevelSwitching,
					onLevelSwitched,
					onLevelLoading,
					onLevelLoaded,
					onLevelUpdated,
					onLevelPTSUpdated,
					onLevelsUpdated,
					onAudioTracksUpdated,
					onAudioTracksSwitching,
					onAudioTracksSwitched,
					onAudioTrackLoading,
					onAudioTrackLoaded,
					onSubtitleTracksUpdated,
					onSubtitleTracksCleared,
					onSubtitleTrackSwitch,
					onSubtitleTrackLoading,
					onSubtitleTrackLoaded,
					onSubtitleFragProcessed,
					onCuesParsed,
					onNonNativeTextTracksFound,
					onInitPtsFound,
					onFragLoading,
					onFragLoadEmergencyAborted,
					onFragLoaded,
					onFragDecrypted,
					onFragParsingInitSegment,
					onFragParsingUserdata,
					onFragParsingMetadata,
					onFragParsed,
					onFragBuffered,
					onFragChanged,
					onFPSDrop,
					onFPSDropLevelCapping,
					onMaxAutoLevelUpdated,
					onHLSError,
					onDestroying,
					onKeyLoading,
					onKeyLoaded,
					onLiveBackBufferReached,
					onBackBufferReached,
					onSteeringManifestLoaded,
				}),
			[url]
		);

		useEffect(() => hlsChangeLevel(innerHlsRef, level), [level]);

		useEffect(() => {
			if (typeof hlsRefProp === 'function') {
				hlsRefProp(innerHlsRef.current);
			}
			if (typeof videoRefProp === 'function') {
				videoRefProp(innerVideoRef.current);
			}
		}, [hlsRefProp, videoRefProp]);

		return (
			<video
				ref={videoRef}
				style={{
					width: '100%',
					height: '100%',
					aspectRatio: '16 / 9',
					objectFit: 'contain',
					backgroundColor: '#000',
				}}
				playsInline
				{...rest}
			/>
		);
	}
);
