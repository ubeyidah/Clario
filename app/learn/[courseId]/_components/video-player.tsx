"use client";

import { useRef, useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayIcon,
  PauseIcon,
  VolumeHighIcon,
  VolumeMute01Icon,
  MaximizeIcon,
  Settings01Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoPlayerProps {
  videoFileKey: string | null;
  thumbnailFileKey?: string | null;
  lessonTitle: string;
  onEnded?: () => void;
}

export function VideoPlayer({
  videoFileKey,
  thumbnailFileKey,
  lessonTitle,
  onEnded,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const videoUrl = videoFileKey
    ? `https://clario.t3.storage.dev/${videoFileKey}`
    : null;
  const posterUrl = thumbnailFileKey
    ? `https://clario.t3.storage.dev/${thumbnailFileKey}`
    : undefined;

  // Toggle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Change Volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  // Change Playback speed
  const handlePlaybackRateChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  // Auto-hide controls when mouse is inactive
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!videoUrl) {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/90 flex flex-col items-center justify-center text-center p-6 border border-border">
        <div className="size-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
          <HugeiconsIcon icon={PlayIcon} className="size-8 text-neutral-400" />
        </div>
        <h3 className="font-semibold text-lg text-white">No video for: {lessonTitle}</h3>
        <p className="text-sm text-neutral-400 max-w-sm mt-1">
          This lesson does not have a video attached yet. Please read the notes below.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black group select-none shadow-2xl border border-border/40"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        playsInline
        aria-label={lessonTitle}
        onClick={togglePlay}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Center Big Play Button when Paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs transition-opacity hover:scale-105"
          aria-label={`Play ${lessonTitle}`}
        >
          <div className="size-18 md:size-20 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground flex items-center justify-center shadow-xl transition-all">
            <HugeiconsIcon icon={PlayIcon} className="size-9 fill-current ml-1" />
          </div>
        </button>
      )}

      {/* Control Bar Overlay */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress Scrubber */}
        <div className="flex items-center gap-2 mb-2 group/scrubber">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-primary hover:h-2 transition-all"
          />
        </div>

        <div className="flex items-center justify-between text-white text-xs md:text-sm">
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1 hover:text-primary transition-colors cursor-pointer"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              <HugeiconsIcon
                icon={isPlaying ? PauseIcon : PlayIcon}
                className="size-5 fill-current"
              />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/volume">
              <button
                onClick={toggleMute}
                className="p-1 hover:text-primary transition-colors cursor-pointer"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                <HugeiconsIcon
                  icon={isMuted || volume === 0 ? VolumeMute01Icon : VolumeHighIcon}
                  className="size-5"
                />
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Time Stamp */}
            <div className="font-mono text-neutral-300 text-xs">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-primary hover:bg-white/10 h-7 text-xs px-2 rounded-lg"
                >
                  <HugeiconsIcon icon={Settings01Icon} className="size-4 mr-1" />
                  {playbackRate}x
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 text-white min-w-[80px]">
                {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <DropdownMenuItem
                    key={speed}
                    onClick={() => handlePlaybackRateChange(speed)}
                    className="flex items-center justify-between text-xs cursor-pointer hover:bg-neutral-800"
                  >
                    <span>{speed}x</span>
                    {playbackRate === speed && (
                      <HugeiconsIcon icon={CheckmarkBadge01Icon} className="size-3 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1 hover:text-primary transition-colors cursor-pointer"
              aria-label="Toggle Fullscreen"
            >
              <HugeiconsIcon icon={MaximizeIcon} className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
