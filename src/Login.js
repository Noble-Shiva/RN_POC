import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {styled} from 'nativewind';
import auth from '@react-native-firebase/auth';
import {onGoogleButtonPress, onGoogleSignInWithPopUp} from './firebase.config';
import database from '@react-native-firebase/database';
import DocumentPicker from './DocumentPicker';
import CameraComponent from './CameraComponent';
import {Camera} from 'react-native-vision-camera';
import GeolocationService from './GeolocationService';
import Notifications from './Notifications';

const SText = styled(Text);
const SView = styled(View);
const SButton = styled(Button);
const STextInput = styled(TextInput);

const STouchableOpacity = styled(TouchableOpacity);

const Login = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [data, setData] = useState();
  const [writeText, setWriteText] = useState();

  const [openCamera, setOpenCamera] = useState(false);

  // Handle user state changes
  function onAuthStateChanged(user) {
    console.log(user);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (user) onRead();
  }, [user]);

  const onRead = () => {
    database()
      .ref('/displayMessage')
      .on('value', snapshot => {
        console.log('Database data: ', snapshot.val());
        setData(snapshot.val());
      });
  };

  const onOpenCamera = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    const newMicrophonePermission = await Camera.requestMicrophonePermission();

    if (newCameraPermission) {
      setOpenCamera(!openCamera);
    }
  };

  const onWrite = () => {
    database()
      .ref('/')
      .update({displayMessage: writeText})
      .then(_ => {
        console.log('Database write successful');
      });
  };

  if (initializing) return <></>;

  if (!user) {
    return (
      <SView className="h-screen flex justify-center items-center">
        <TouchableOpacity
          className="bg-purple-600 rounded-md text-white p-3 px-5 text-2xl"
          onPress={onGoogleButtonPress}>
          <SText className="text-white">Login</SText>
        </TouchableOpacity>
      </SView>
    );
  }

  return (
    <ScrollView>
      <Text>Welcome {user.displayName}</Text>
      <SText className="mt-10 text-2xl">Data from Firebase : {data}</SText>
      <STextInput
        className="mt-5 border border-white rounded-lg w-full px-2"
        onChangeText={e => setWriteText(e)}></STextInput>

      <SView className="mt-3 flex justify-center items-center">
        <TouchableOpacity
          className="bg-purple-600 rounded-md text-white p-3 px-5 text-2xl"
          onPress={onWrite}>
          <SText className="text-white">Write</SText>
        </TouchableOpacity>
      </SView>

      <DocumentPicker />

      <SView className="mt-3 flex justify-center items-center">
        <TouchableOpacity
          className="bg-purple-600 rounded-md text-white p-3 px-5 text-2xl"
          onPress={onOpenCamera}>
          <SText className="text-white">Open Camera</SText>
        </TouchableOpacity>

        {openCamera && <CameraComponent />}
      </SView>

      <GeolocationService />

      <Notifications />
    </ScrollView>
  );
};

export default Login;
