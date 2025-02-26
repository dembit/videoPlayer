import { VideoPlayer } from "./components/VideoSyncPlayer";

const App = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <VideoPlayer
        videoSrc="https://www.youtube.com/watch?v=8J54P94OOko"
        audioSrc="https://flask.dev-de.transcribe.torsunov.ru/download_rus?file_name=79f58732473311ef9f8102420a000008/audio.mp3"
      />
    </div>
  );
};

export default App;
