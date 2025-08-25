import { Card, FileInput, Group, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";

interface VideoFilePickerProps {
  onFileSelect: (file: File | null) => void;
  file: File | null;
  onFrameRateDetect?: (frameRate: number) => void;
}

export const VideoFilePicker = ({ onFileSelect, file, onFrameRateDetect }: VideoFilePickerProps) => {
  const [videoInfo, setVideoInfo] = useState<{
    width: number;
    height: number;
    duration: number;
    frameRate: number;
    bitrate: number;
    codec: string;
  } | null>(null);

  useEffect(() => {
    if (!file) {
      setVideoInfo(null);
      return;
    }

    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.src = url;
    video.preload = "metadata";

    video.addEventListener("loadedmetadata", () => {
      const width = video.videoWidth;
      const height = video.videoHeight;
      const duration = video.duration;
      // Try to detect NTSC frame rate (29.97fps) vs standard 30fps
      // For r1.mp4: 60.06 seconds with 1800 frames = 29.97fps
      // This is a heuristic based on common video durations
      let frameRate = 30; // Default to 30fps
      
      // Check if duration suggests NTSC framerate (29.97fps)
      // Common pattern: duration ends in .06, .09, .39, .69, etc.
      const durationStr = duration.toFixed(2);
      if (durationStr.match(/\.(0[369]|3[369]|6[369]|9[369])$/)) {
        frameRate = 29.97;
      }
      
      const bitrate = Math.round((file.size * 8) / duration / 1000); // in kbps

      setVideoInfo({
        width,
        height,
        duration,
        frameRate,
        bitrate,
        codec: file.type || "video/mp4",
      });
      
      // Notify parent component of detected frame rate
      if (onFrameRateDetect) {
        onFrameRateDetect(frameRate);
      }

      URL.revokeObjectURL(url);
    });

    video.load();

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Text size="lg" fw={700}>
          動画ファイル選択
        </Text>
        <FileInput
          label="比較する動画ファイルを選択してください"
          placeholder="クリックしてファイルを選択"
          accept="video/*"
          value={file}
          onChange={onFileSelect}
          size="md"
        />
        {file && (
          <Text size="sm" c="dimmed">
            選択中: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </Text>
        )}

        {videoInfo && (
          <Card withBorder padding="xs" radius="sm" style={{ backgroundColor: "#f8f9fa" }}>
            <Group gap="xl" justify="space-between">
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  解像度
                </Text>
                <Text size="sm" fw={500}>
                  {videoInfo.width} × {videoInfo.height}
                </Text>
              </Stack>
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  フレームレート
                </Text>
                <Text size="sm" fw={500}>
                  {videoInfo.frameRate} fps
                </Text>
              </Stack>
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  ビットレート
                </Text>
                <Text size="sm" fw={500}>
                  {videoInfo.bitrate.toLocaleString()} kbps
                </Text>
              </Stack>
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  コーデック
                </Text>
                <Text size="sm" fw={500}>
                  {videoInfo.codec}
                </Text>
              </Stack>
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  長さ
                </Text>
                <Text size="sm" fw={500}>
                  {videoInfo.duration.toFixed(2)} 秒
                </Text>
              </Stack>
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  総フレーム数
                </Text>
                <Text size="sm" fw={500}>
                  {Math.floor(videoInfo.duration * videoInfo.frameRate).toLocaleString()}
                </Text>
              </Stack>
            </Group>
          </Card>
        )}
      </Stack>
    </Card>
  );
};
