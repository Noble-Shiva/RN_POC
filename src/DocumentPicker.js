import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Button, Alert, PermissionsAndroid} from 'react-native';
import {styled} from 'nativewind';
import DocumentPickerLib from 'react-native-document-picker';
import {utils} from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';

const SText = styled(Text);
const SView = styled(View);

const DocumentPicker = () => {
  const [fileResponse, setFileResponse] = useState([]);
  const reference = storage().ref('black-t-shirt-sm.png');

  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState();

  // useEffect(() => {
  //   effect;
  //   return () => {
  //     cleanup;
  //   };
  // }, [input]);

  const requestFilePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Read Storage',
          message: 'Can we access your files?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        console.log('Permission Granted Android');
        return true;
      } else {
        console.log('You cannot use Storage');
        return false;
      }
    } catch (err) {
      console.log('Permission Error : ', err);
      return false;
    }
  };

  const handleDocumentSelection = useCallback(async () => {
    const permission = await requestFilePermission();

    if (!permission) {
      console.log('You dont have storage permission');
      return;
    }

    try {
      const response = await DocumentPickerLib.pick({
        presentationStyle: 'fullScreen',
        type: DocumentPickerLib.types.allFiles,
        allowMultiSelection: true,
      });
      setFileResponse(response);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const onUpload = async () => {
    setUploading(true);
    setTransferred(0);

    console.log(fileResponse);
    const stat = await RNFetchBlob.fs.stat(fileResponse[0].uri);
    console.log(stat);
    const uploadUri = stat.path;
    // uploads file
    const task = storage().ref('sample.png').putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
      console.log(
        'UploadProgress : ',
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });

    try {
      await task;
      const url = await storage().ref('sample.png').getDownloadURL();
      setUrl(url);
    } catch (e) {
      console.error(e);
    }

    setUploading(false);
    Alert.alert(
      'Photo uploaded!',
      'Your photo has been uploaded to Firebase Cloud Storage!',
    );
  };
  return (
    <SView className="mt-3 flex justify-center items-center">
      <SText className="mt-10 text-2xl">Document Picker</SText>
      {fileResponse.map((file, index) => (
        <Text
          key={index.toString()}
          // style={styles.uri}
          numberOfLines={1}
          ellipsizeMode={'middle'}>
          {file?.uri}
        </Text>
      ))}
      <Button title="Select 📑" onPress={handleDocumentSelection} />
      <Button title="Upload" onPress={onUpload} />
      <Text>{url ?? ''}</Text>
    </SView>
  );
};

export default DocumentPicker;
