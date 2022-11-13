import React, {useEffect, useState} from 'react';
import {View, Text, Platform, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';

const GeolocationService = () => {
  const [hasLocationPermission, setLocationPermission] = useState(false);
  const [location, setLocation] = useState('');

  // Function to get permission for location
  const requestLocationPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        console.log('Permission Granted Android');
        setLocationPermission(true);
        getCurrentLocation();
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      console.log('Permission Error : ', err);
      return false;
    }
  };

  const requestLocationPermissioniOS = async () => {
    Geolocation.requestAuthorization(
      (success = () => {
        console.log('Permission Granted iOS');
        setLocationPermission(true);
        getCurrentLocation();
      }),
      (error = err => {
        console.log('Permission Error : ', err);
      }),
    );
  };

  const requestPermission = () => {
    if (Platform.OS === 'android') {
      requestLocationPermissionAndroid();
    } else {
      requestLocationPermissioniOS();
    }
  };

  const getCurrentLocation = () => {
    console.log('getCurrentLocation');
    Geolocation.getCurrentPosition(
      position => {
        console.log('Current Location : ', position);
        setLocation(JSON.stringify(position));
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    requestPermission();
  }, []);

  // useEffect(() => {
  //   if (hasLocationPermission) {
  //     Geolocation.getCurrentPosition(
  //       position => {
  //         console.log('Current Location : ', position);
  //       },
  //       error => {
  //         // See error code charts below.
  //         console.log(error.code, error.message);
  //       },
  //       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //     );
  //   }
  // }, [hasLocationPermission]);
  return (
    <View>
      <Text>{location.toString()}</Text>
    </View>
  );
};

export default GeolocationService;
