import { Container, Grid, Stack, Title } from "@mantine/core";
import "@mantine/core/styles.css";
import { useState } from "react";
import { SimpleFFmpegPlayer } from "./components/FFmpegPlayer/SimpleFFmpegPlayer";
import { SimpleVideoPlayer } from "./components/VideoDecoderPlayer/SimpleVideoPlayer";
import { VideoFilePicker } from "./components/VideoFilePicker";

const App = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title order={1} ta="center">
          フレーム単位コマ送りプレイヤー
        </Title>

        <VideoFilePicker onFileSelect={setVideoFile} file={videoFile} />

        {videoFile && (
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <SimpleVideoPlayer videoFile={videoFile} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <SimpleFFmpegPlayer videoFile={videoFile} />
            </Grid.Col>
          </Grid>
        )}
      </Stack>
    </Container>
  );
};

export default App;
