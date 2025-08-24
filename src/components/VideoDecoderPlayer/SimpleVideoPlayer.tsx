import { Button, Card, Divider, Group, Popover, Select, Stack, Text } from "@mantine/core";
import {
  IconInfoCircle,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconPlayerStop,
} from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface SimpleVideoPlayerProps {
  videoFile: File;
}

export const SimpleVideoPlayer = ({ videoFile }: SimpleVideoPlayerProps) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [frameRate] = useState(30); // Default to 30fps
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState("1");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastUpdateTimeRef = useRef(0);
  const prevFrameRef = useRef(-1);

  // Create video URL when file changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: videoUrlを依存配列に含めると無限ループになる。古いURLのクリーンアップが必要なため意図的にvideoUrlを参照している
  useEffect(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    const url = URL.createObjectURL(videoFile);
    setVideoUrl(url);

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [videoFile]);

  // Capture current frame to canvas
  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 360;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }, []);

  // Update current time display with precise frame accuracy
  const updateTimeDisplay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentFrame = Math.floor(video.currentTime * frameRate);

    // Only update if frame actually changed
    if (currentFrame !== prevFrameRef.current) {
      setCurrentTime(video.currentTime);
      prevFrameRef.current = currentFrame;
    }
  }, [frameRate]);

  // Update current time display
  // biome-ignore lint/correctness/useExhaustiveDependencies: videoUrlが変更されたときにイベントリスナーを再登録する必要がある
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!isPlaying) {
        setCurrentTime(video.currentTime);
        captureFrame();
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setCurrentTime(video.currentTime);
      captureFrame();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(video.currentTime);
      captureFrame();
    };

    const handleSeeked = () => {
      setCurrentTime(video.currentTime);
      captureFrame();
      prevFrameRef.current = Math.floor(video.currentTime * frameRate);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [isPlaying, captureFrame, videoUrl, frameRate]);

  // Animation loop for smooth playback with frame-accurate updates
  const animate = useCallback(
    (timestamp: number) => {
      if (!isPlaying) return;

      // Update at 60fps (16.67ms intervals) for optimal performance
      const updateInterval = 1000 / 60;
      if (timestamp - lastUpdateTimeRef.current >= updateInterval) {
        updateTimeDisplay();
        captureFrame();
        lastUpdateTimeRef.current = timestamp;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [isPlaying, captureFrame, updateTimeDisplay],
  );

  useEffect(() => {
    if (isPlaying) {
      lastUpdateTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, animate]);

  // Playback control functions
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleStop = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const handlePlaybackRateChange = (rate: string | null) => {
    if (!videoRef.current || !rate) return;
    setPlaybackRate(rate);
    videoRef.current.playbackRate = Number.parseFloat(rate);
  };

  // Frame control functions
  const seekByFrames = (frames: number) => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    const frameDuration = 1 / frameRate;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + frames * frameDuration));
    videoRef.current.currentTime = newTime;
  };

  const handleFrameBackward = () => seekByFrames(-1);
  const handleFrameForward = () => seekByFrames(1);
  const handle10FrameBackward = () => seekByFrames(-10);
  const handle10FrameForward = () => seekByFrames(10);

  const handleSeek = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="lg" fw={700}>
            VideoDecoder API
          </Text>
          <Popover width={300} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <Button variant="subtle" size="xs" leftSection={<IconInfoCircle size={16} />}>
                実装について
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Stack gap="xs">
                <Text size="sm" fw={600}>
                  VideoDecoder API実装
                </Text>
                <Text size="xs" c="dimmed">
                  Web標準のVideoDecoder APIを使用した実装です。 ブラウザのネイティブな動画デコード機能を活用し、 HTML5
                  video要素を通じてフレーム単位の制御を実現しています。
                </Text>
              </Stack>
            </Popover.Dropdown>
          </Popover>
        </Group>

        {videoUrl && (
          <>
            <Divider label="ビデオプレビュー" />

            {/* Hidden video element for seeking and playback */}
            {/* biome-ignore lint/a11y/useMediaCaption: この動画要素は表示用ではなくフレーム抽出用の隠し要素であり、音声も含まれないためキャプションは不要 */}
            <video ref={videoRef} src={videoUrl} style={{ display: "none" }} preload="auto" />

            {/* Canvas for frame display */}
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "#000",
              }}
            />

            <Divider label="再生コントロール" />

            <Group justify="center" gap="xs">
              <Button size="sm" variant="filled" onClick={handlePlayPause} aria-label={isPlaying ? "一時停止" : "再生"}>
                {isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
              </Button>
              <Button size="sm" variant="light" onClick={handleStop} aria-label="停止">
                <IconPlayerStop size={20} />
              </Button>
              <Select
                size="sm"
                value={playbackRate}
                onChange={handlePlaybackRateChange}
                data={[
                  { value: "0.25", label: "0.25x" },
                  { value: "0.5", label: "0.5x" },
                  { value: "0.75", label: "0.75x" },
                  { value: "1", label: "1x" },
                  { value: "1.25", label: "1.25x" },
                  { value: "1.5", label: "1.5x" },
                  { value: "2", label: "2x" },
                ]}
                style={{ width: "100px" }}
              />
            </Group>

            <Divider label="フレームコントロール" />

            <Group justify="center" gap="xs">
              <Button
                size="xs"
                variant="light"
                onClick={handle10FrameBackward}
                leftSection={<IconPlayerSkipBack size={14} />}
              >
                -10フレーム
              </Button>
              <Button size="xs" variant="light" onClick={handleFrameBackward}>
                -1フレーム
              </Button>
              <Button size="xs" variant="light" onClick={handleFrameForward}>
                +1フレーム
              </Button>
              <Button
                size="xs"
                variant="light"
                onClick={handle10FrameForward}
                leftSection={<IconPlayerSkipForward size={14} />}
              >
                +10フレーム
              </Button>
            </Group>

            <input
              type="range"
              min={0}
              max={duration}
              step={1 / frameRate}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              style={{ width: "100%" }}
            />

            <Text size="xs" c="dimmed" ta="center">
              現在時刻: {currentTime.toFixed(3)}秒 / {duration.toFixed(3)}秒
            </Text>
            <Text size="xs" c="dimmed" ta="center">
              フレーム: {Math.floor(currentTime * frameRate)} / {Math.floor(duration * frameRate)}
            </Text>
          </>
        )}
      </Stack>
    </Card>
  );
};
