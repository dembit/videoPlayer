import React, { useCallback, useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";

import { OnProgressProps } from "react-player/base";
import { Button, Slider } from "@/components/ui";
import { PauseIcon, PlayIcon, VolumeIcon, VolumeXIcon } from "@/assets";

interface VideoSyncPlayerProps {
  videoSrc: string;
  audioSrc: string;
}

const VideoPlayer: React.FC<VideoSyncPlayerProps> = ({
  videoSrc,
  audioSrc,
}) => {
  const [isPlay, setIsPlay] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [progress, setProgress] = useState<OnProgressProps>({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
  });

  const videoPlayerRef = useRef<ReactPlayer>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  const syncAudioWithVideo = useCallback(() => {
    if (audioPlayerRef.current && videoPlayerRef.current) {
      const diff = Math.abs(
        audioPlayerRef.current.currentTime -
          videoPlayerRef.current?.getCurrentTime()
      );
      if (diff > 0.3) {
        audioPlayerRef.current.currentTime =
          videoPlayerRef.current?.getCurrentTime();
      }
    }
  }, [audioPlayerRef.current, videoPlayerRef.current]);

  const handlePause = () => {
    setIsPlay(false);
    audioPlayerRef?.current?.pause();
    syncAudioWithVideo();
  };

  const handlePlay = () => {
    setIsPlay(true);
    audioPlayerRef?.current?.play();
    syncAudioWithVideo();
  };

  const handleBuffer = () => {
    audioPlayerRef?.current?.pause();
  };

  const handleBufferEnd = () => {
    audioPlayerRef?.current?.play();
  };

  const handleProgress = (state: OnProgressProps) => {
    if (seeking) return;
    setProgress(state);
    syncAudioWithVideo();
  };

  const handleToggleMuted = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div>
      <ReactPlayer
        ref={videoPlayerRef}
        url={videoSrc}
        controls
        playing={isPlay}
        value={progress.played}
        onProgress={handleProgress}
        onPlay={handlePlay}
        onPause={handlePause}
        onBuffer={handleBuffer}
        onBufferEnd={handleBufferEnd}
      />
      <audio muted={isMuted} ref={audioPlayerRef} src={audioSrc} />
      <div>
        <div className="shadow-md bg-white dark:bg-zinc-800 rounded-lg p-4 flex items-center space-x-4">
          <Button
            onClick={() => setIsPlay((prev) => !prev)}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            {isPlay ? (
              <PauseIcon className="h-6 w-6" />
            ) : (
              <PlayIcon className="h-6 w-6" />
            )}
          </Button>
          <div className="flex-grow relative h-2 bg-zinc-200 rounded-full">
            <Slider
              onPointerDown={() => {
                setSeeking(true);
              }}
              onPointerUp={() => {
                setSeeking(false);
              }}
              onValueChange={([value]) => {
                setProgress((progress) => ({
                  ...progress,
                  played: value / 100,
                }));
              }}
              onValueCommit={([value]) => {
                if (videoPlayerRef.current) {
                  videoPlayerRef.current.seekTo(value / 100);
                }
              }}
              value={[progress.played * 100]}
              max={100}
              step={1}
            />
          </div>
          <div className="relative w-8 h-8">
            <Button
              onClick={handleToggleMuted}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              {isMuted ? (
                <VolumeXIcon className="h-6 w-6" />
              ) : (
                <VolumeIcon className="h-6 w-6" />
              )}

              <span className="sr-only">Volume</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
