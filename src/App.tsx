import { Container, Grid, Stack, Title } from "@mantine/core";
import "@mantine/core/styles.css";
import { useState } from "react";
import { SimpleFFmpegPlayer } from "./components/FFmpegPlayer/SimpleFFmpegPlayer";
import { SimpleVideoPlayer } from "./components/VideoDecoderPlayer/SimpleVideoPlayer";
import { VideoFilePicker } from "./components/VideoFilePicker";

const App = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [frameRate, setFrameRate] = useState<number>(30);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title order={1} ta="center">
          フレーム単位コマ送りプレイヤー
        </Title>

        <VideoFilePicker onFileSelect={setVideoFile} file={videoFile} onFrameRateDetect={setFrameRate} />

        {videoFile && (
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <SimpleVideoPlayer videoFile={videoFile} frameRate={frameRate} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <SimpleFFmpegPlayer videoFile={videoFile} frameRate={frameRate} />
            </Grid.Col>
          </Grid>
        )}
      </Stack>
    </Container>
  );
};

export default App;
