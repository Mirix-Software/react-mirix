import Hls, {
    AudioTrackLoadedData,
    AudioTracksUpdatedData,
    AudioTrackSwitchedData,
    AudioTrackSwitchingData,
    BackBufferData,
    BufferAppendedData,
    BufferAppendingData,
    BufferCodecsData,
    BufferCreatedData,
    BufferEOSData,
    BufferFlushedData,
    BufferFlushingData,
    CuesParsedData,
    ErrorData,
    FPSDropData,
    FPSDropLevelCappingData,
    FragBufferedData,
    FragChangedData,
    FragDecryptedData,
    FragLoadedData,
    FragLoadEmergencyAbortedData,
    FragLoadingData,
    FragParsedData,
    FragParsingInitSegmentData,
    FragParsingMetadataData,
    FragParsingUserdataData,
    HlsConfig,
    InitPTSFoundData,
    KeyLoadedData,
    KeyLoadingData,
    Level,
    LevelLoadedData,
    LevelLoadingData,
    LevelPTSUpdatedData,
    LevelsUpdatedData,
    LevelSwitchedData,
    LevelSwitchingData,
    LevelUpdatedData,
    ManifestLoadedData,
    ManifestLoadingData,
    ManifestParsedData,
    MaxAutoLevelUpdatedData,
    MediaAttachedData,
    MediaAttachingData,
    NonNativeTextTracksData,
    SteeringManifestLoadedData,
    SubtitleFragProcessedData,
    SubtitleTrackLoadedData,
    SubtitleTracksUpdatedData,
    SubtitleTrackSwitchData,
    TrackLoadingData,
} from 'hls.js';
import { DetailedHTMLProps, ForwardedRef, VideoHTMLAttributes } from 'react';

export interface PlayerEvents {
    onMediaAttaching?: (data: MediaAttachingData) => void;
    onMediaAttached?: (data: MediaAttachedData) => void;
    onMediaDetaching?: () => void;
    onMediaDetached?: () => void;
    onBufferReset?: () => void;
    onBufferCodecs?: (data: BufferCodecsData) => void;
    onBufferCreated?: (data: BufferCreatedData) => void;
    onBufferAppending?: (data: BufferAppendingData) => void;
    onBufferAppended?: (data: BufferAppendedData) => void;
    onBufferEOS?: (data: BufferEOSData) => void;
    onBufferFlushing?: (data: BufferFlushingData) => void;
    onBufferFlushed?: (data: BufferFlushedData) => void;
    onManifestLoading?: (data: ManifestLoadingData) => void;
    onManifestLoaded?: (data: ManifestLoadedData) => void;
    onManifestParsed?: (data: ManifestParsedData) => void;
    onLevelSwitching?: (data: LevelSwitchingData) => void;
    onLevelSwitched?: (data: LevelSwitchedData, level: Level) => void;
    onLevelLoading?: (data: LevelLoadingData) => void;
    onLevelLoaded?: (data: LevelLoadedData) => void;
    onLevelUpdated?: (data: LevelUpdatedData) => void;
    onLevelPTSUpdated?: (data: LevelPTSUpdatedData) => void;
    onLevelsUpdated?: (data: LevelsUpdatedData) => void;
    onAudioTracksUpdated?: (data: AudioTracksUpdatedData) => void;
    onAudioTracksSwitching?: (data: AudioTrackSwitchingData) => void;
    onAudioTracksSwitched?: (data: AudioTrackSwitchedData) => void;
    onAudioTrackLoading?: (data: TrackLoadingData) => void;
    onAudioTrackLoaded?: (data: AudioTrackLoadedData) => void;
    onSubtitleTracksUpdated?: (data: SubtitleTracksUpdatedData) => void;
    onSubtitleTracksCleared?: () => void;
    onSubtitleTrackSwitch?: (data: SubtitleTrackSwitchData) => void;
    onSubtitleTrackLoading?: (data: TrackLoadingData) => void;
    onSubtitleTrackLoaded?: (data: SubtitleTrackLoadedData) => void;
    onSubtitleFragProcessed?: (data: SubtitleFragProcessedData) => void;
    onCuesParsed?: (data: CuesParsedData) => void;
    onNonNativeTextTracksFound?: (data: NonNativeTextTracksData) => void;
    onInitPtsFound?: (data: InitPTSFoundData) => void;
    onFragLoading?: (data: FragLoadingData) => void;
    onFragLoadEmergencyAborted?: (data: FragLoadEmergencyAbortedData) => void;
    onFragLoaded?: (data: FragLoadedData) => void;
    onFragDecrypted?: (data: FragDecryptedData) => void;
    onFragParsingInitSegment?: (data: FragParsingInitSegmentData) => void;
    onFragParsingUserdata?: (data: FragParsingUserdataData) => void;
    onFragParsingMetadata?: (data: FragParsingMetadataData) => void;
    onFragParsed?: (data: FragParsedData) => void;
    onFragBuffered?: (data: FragBufferedData) => void;
    onFragChanged?: (data: FragChangedData) => void;
    onFPSDrop?: (data: FPSDropData) => void;
    onFPSDropLevelCapping?: (data: FPSDropLevelCappingData) => void;
    onMaxAutoLevelUpdated?: (data: MaxAutoLevelUpdatedData) => void;
    onHLSError?: (data: ErrorData) => void;
    onDestroying?: () => void;
    onKeyLoading?: (data: KeyLoadingData) => void;
    onKeyLoaded?: (data: KeyLoadedData) => void;
    onLiveBackBufferReached?: (data: BackBufferData) => void;
    onBackBufferReached?: (data: BackBufferData) => void;
    onSteeringManifestLoaded?: (data: SteeringManifestLoadedData) => void;
}

export interface PlayerProps
    extends DetailedHTMLProps<
            VideoHTMLAttributes<HTMLVideoElement>,
            HTMLVideoElement
        >,
        PlayerEvents {
    hlsRef?: ForwardedRef<Hls>;
    config?: Partial<HlsConfig>;
    url?: string;
    level?: number;
}
