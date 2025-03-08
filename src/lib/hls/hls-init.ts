import { PlayerEvents } from '@types';
import Hls, { HlsConfig } from 'hls.js';
import { MutableRefObject } from 'react';

interface HlsInitArgs extends PlayerEvents {
	videoRef: MutableRefObject<HTMLVideoElement | null>;
	hlsRef: MutableRefObject<Hls | null>;
	url: string;
	config?: Partial<HlsConfig>;
}

export const hlsInit = ({
	videoRef,
	hlsRef,
	url,
	config,
	...events
}: HlsInitArgs) => {
	const video = videoRef?.current;
	if (!video) return;

	if (Hls.isSupported()) {
		const hls = new Hls({
			autoStartLoad: true,
			maxMaxBufferLength: 90,
			abrEwmaFastVoD: 0.5,
			abrEwmaSlowVoD: 3,
			...config,
		});
		hlsRef.current = hls;

		// Media events
		hls.on(Hls.Events.MEDIA_ATTACHING, (_event, data) => {
			events.onMediaAttaching?.(data);
		});
		hls.on(Hls.Events.MEDIA_ATTACHED, (_event, data) => {
			events.onMediaAttached?.(data);
		});
		hls.on(Hls.Events.MEDIA_DETACHING, () => {
			events.onMediaDetaching?.();
		});
		hls.on(Hls.Events.MEDIA_DETACHED, () => {
			events.onMediaDetached?.();
		});

		// Buffer events
		hls.on(Hls.Events.BUFFER_RESET, () => {
			events.onBufferReset?.();
		});
		hls.on(Hls.Events.BUFFER_CODECS, (_event, data) => {
			events.onBufferCodecs?.(data);
		});
		hls.on(Hls.Events.BUFFER_CREATED, (_event, data) => {
			events.onBufferCreated?.(data);
		});
		hls.on(Hls.Events.BUFFER_APPENDING, (_event, data) => {
			events.onBufferAppending?.(data);
		});
		hls.on(Hls.Events.BUFFER_APPENDED, (_event, data) => {
			events.onBufferAppended?.(data);
		});
		hls.on(Hls.Events.BUFFER_EOS, (_event, data) => {
			events.onBufferEOS?.(data);
		});
		hls.on(Hls.Events.BUFFER_FLUSHING, (_event, data) => {
			events.onBufferFlushing?.(data);
		});
		hls.on(Hls.Events.BUFFER_FLUSHED, (_event, data) => {
			events.onBufferFlushed?.(data);
		});

		// Manifest events
		hls.on(Hls.Events.MANIFEST_LOADING, (_event, data) => {
			events.onManifestLoading?.(data);
		});
		hls.on(Hls.Events.MANIFEST_LOADED, (_event, data) => {
			events.onManifestLoaded?.(data);
		});
		hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
			events.onManifestParsed?.(data);
			// video.play().catch((err: any) => {
			// 	console.error("Couldn't start video playback:", err);
			// });
		});

		// Level events
		hls.on(Hls.Events.LEVEL_SWITCHING, (_event, data) => {
			events.onLevelSwitching?.(data);
		});
		hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
			events.onLevelSwitched?.(data, hls.levels[data.level]);
		});
		hls.on(Hls.Events.LEVEL_LOADING, (_event, data) => {
			events.onLevelLoading?.(data);
		});
		hls.on(Hls.Events.LEVEL_LOADED, (_event, data) => {
			events.onLevelLoaded?.(data);
		});
		hls.on(Hls.Events.LEVEL_UPDATED, (_event, data) => {
			events.onLevelUpdated?.(data);
		});
		hls.on(Hls.Events.LEVEL_PTS_UPDATED, (_event, data) => {
			events.onLevelPTSUpdated?.(data);
		});
		hls.on(Hls.Events.LEVELS_UPDATED, (_event, data) => {
			events.onLevelsUpdated?.(data);
		});

		// Audio track events
		hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (_event, data) => {
			events.onAudioTracksUpdated?.(data);
		});
		hls.on(Hls.Events.AUDIO_TRACK_SWITCHING, (_event, data) => {
			events.onAudioTracksSwitching?.(data);
		});
		hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (_event, data) => {
			events.onAudioTracksSwitched?.(data);
		});
		hls.on(Hls.Events.AUDIO_TRACK_LOADING, (_event, data) => {
			events.onAudioTrackLoading?.(data);
		});
		hls.on(Hls.Events.AUDIO_TRACK_LOADED, (_event, data) => {
			events.onAudioTrackLoaded?.(data);
		});

		// Subtitle events
		hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (_event, data) => {
			events.onSubtitleTracksUpdated?.(data);
		});
		hls.on(Hls.Events.SUBTITLE_TRACKS_CLEARED, () => {
			events.onSubtitleTracksCleared?.();
		});
		hls.on(Hls.Events.SUBTITLE_TRACK_SWITCH, (_event, data) => {
			events.onSubtitleTrackSwitch?.(data);
		});
		hls.on(Hls.Events.SUBTITLE_TRACK_LOADING, (_event, data) => {
			events.onSubtitleTrackLoading?.(data);
		});
		hls.on(Hls.Events.SUBTITLE_TRACK_LOADED, (_event, data) => {
			events.onSubtitleTrackLoaded?.(data);
		});
		hls.on(Hls.Events.SUBTITLE_FRAG_PROCESSED, (_event, data) => {
			events.onSubtitleFragProcessed?.(data);
		});

		// Cues and text tracks events
		hls.on(Hls.Events.CUES_PARSED, (_event, data) => {
			events.onCuesParsed?.(data);
		});
		hls.on(Hls.Events.NON_NATIVE_TEXT_TRACKS_FOUND, (_event, data) => {
			events.onNonNativeTextTracksFound?.(data);
		});
		hls.on(Hls.Events.INIT_PTS_FOUND, (_event, data) => {
			events.onInitPtsFound?.(data);
		});

		// Fragment events
		hls.on(Hls.Events.FRAG_LOADING, (_event, data) => {
			events.onFragLoading?.(data);
		});
		hls.on(Hls.Events.FRAG_LOAD_EMERGENCY_ABORTED, (_event, data) => {
			events.onFragLoadEmergencyAborted?.(data);
		});
		hls.on(Hls.Events.FRAG_LOADED, (_event, data) => {
			events.onFragLoaded?.(data);
		});
		hls.on(Hls.Events.FRAG_DECRYPTED, (_event, data) => {
			events.onFragDecrypted?.(data);
		});
		hls.on(Hls.Events.FRAG_PARSING_INIT_SEGMENT, (_event, data) => {
			events.onFragParsingInitSegment?.(data);
		});
		hls.on(Hls.Events.FRAG_PARSING_USERDATA, (_event, data) => {
			events.onFragParsingUserdata?.(data);
		});
		hls.on(Hls.Events.FRAG_PARSING_METADATA, (_event, data) => {
			events.onFragParsingMetadata?.(data);
		});
		hls.on(Hls.Events.FRAG_PARSED, (_event, data) => {
			events.onFragParsed?.(data);
		});
		hls.on(Hls.Events.FRAG_BUFFERED, (_event, data) => {
			events.onFragBuffered?.(data);
		});
		hls.on(Hls.Events.FRAG_CHANGED, (_event, data) => {
			events.onFragChanged?.(data);
		});

		// FPS events
		hls.on(Hls.Events.FPS_DROP, (_event, data) => {
			events.onFPSDrop?.(data);
		});
		hls.on(Hls.Events.FPS_DROP_LEVEL_CAPPING, (_event, data) => {
			events.onFPSDropLevelCapping?.(data);
		});
		hls.on(Hls.Events.MAX_AUTO_LEVEL_UPDATED, (_event, data) => {
			events.onMaxAutoLevelUpdated?.(data);
		});

		// Error event
		hls.on(Hls.Events.ERROR, (_event, data) => {
			events.onHLSError?.(data);
		});

		// Destroying event
		hls.on(Hls.Events.DESTROYING, () => {
			events.onDestroying?.();
		});

		// Key events
		hls.on(Hls.Events.KEY_LOADING, (_event, data) => {
			events.onKeyLoading?.(data);
		});
		hls.on(Hls.Events.KEY_LOADED, (_event, data) => {
			events.onKeyLoaded?.(data);
		});

		// Back buffer events
		hls.on(Hls.Events.LIVE_BACK_BUFFER_REACHED, (_event, data) => {
			events.onLiveBackBufferReached?.(data);
		});
		hls.on(Hls.Events.BACK_BUFFER_REACHED, (_event, data) => {
			events.onBackBufferReached?.(data);
		});

		// Steering manifest event
		hls.on(Hls.Events.STEERING_MANIFEST_LOADED, (_event, data) => {
			events.onSteeringManifestLoaded?.(data);
		});

		hls.loadSource(url);
		hls.attachMedia(video);

		return () => {
			hls.destroy();
			hlsRef.current = null;
		};
	} else {
		console.error('HLS is not supported');
	}
};
