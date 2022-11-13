import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  Camera,
  useCameraDevices,
  CameraProps,
} from 'react-native-vision-camera';

const CameraComponent = () => {
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;

  // const camera = useRef(null);

  // useEffect(async () => {
  //   const newCameraPermission = await Camera.requestCameraPermission();
  //   const newMicrophonePermission = await Camera.requestMicrophonePermission();
  // }, []);

  if (device == null) return <></>;
  // return <Camera ref={camera} {...CameraProps} />;
  return <Camera style={StyleSheet.absoluteFill} device={device} />;
};

export default CameraComponent;
