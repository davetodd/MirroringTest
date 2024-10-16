import React, {useEffect, useRef, useState} from 'react';
import {Button, SafeAreaView} from 'react-native';
import Video, {VideoRef} from 'react-native-video';
import {Camera, useCameraDevice} from 'react-native-vision-camera';

function App(): React.JSX.Element {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const device = useCameraDevice('front');
  const cameraRef = useRef<Camera>(null);

  const videoRef = useRef<VideoRef>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const cameraResponse = await Camera.requestCameraPermission();
      const micResponse = await Camera.requestMicrophonePermission();
      setHasPermission(
        cameraResponse === 'granted' && micResponse === 'granted',
      );
    })();
  }, []);

  return (
    <SafeAreaView>
      {localUri ? (
        <Video
          source={{uri: localUri}}
          ref={videoRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      ) : (
        <>
          <Button
            onPress={() => {
              if (isRecording) {
                cameraRef.current?.stopRecording();
                setIsRecording(false);
              } else {
                cameraRef.current?.startRecording({
                  onRecordingFinished: video => {
                    setLocalUri(video?.path);
                  },
                  onRecordingError: error => console.error(error),
                });
                setIsRecording(true);
              }
            }}
            title={isRecording ? 'Stop' : 'Record'}
          />
          {hasPermission && device && (
            <Camera
              style={{width: '100%', height: 400}}
              video
              audio
              isActive={true}
              device={device}
              ref={cameraRef}
              isMirrored={false}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

export default App;
