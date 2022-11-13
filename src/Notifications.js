import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import messaging from '@react-native-firebase/messaging';

const Notifications = () => {
  const [token, setToken] = useState();

  const requestToken = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    setToken(token);
  };

  useEffect(() => {
    requestToken();
  }, []);

  return (
    <View style={{marginTop: 20}}>
      <Text>Token : {token}</Text>
    </View>
  );
};

export default Notifications;
