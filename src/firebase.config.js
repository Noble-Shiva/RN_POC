import {initializeApp} from 'firebase/app';
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyAkIbmzEnVv2_PBi2hAqnU9Dpi0afjCRLc',
//   authDomain: 'reactnative-template-6f585.firebaseapp.com',
//   databaseURL: 'https://reactnative-template-6f585.firebaseio.com',
//   projectId: 'reactnative-template-6f585',
//   storageBucket: 'reactnative-template-6f585.appspot.com',
//   messagingSenderId: '247835491557',
//   appId: '1:247835491557:web:a55f8b3a1a0df0e05ce80c',
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const authf = getAuth(app);
// const googleProvider = new GoogleAuthProvider();

GoogleSignin.configure({
  webClientId:
    '247835491557-q7k4bl6jgkpr24srire9h6ef7m5lmdu4.apps.googleusercontent.com',
});

export const onGoogleButtonPress = async () => {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  // Get the users ID token
  const {idToken} = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  try {
    // Sign-in the user with the credential
    const user = auth().signInWithCredential(googleCredential);
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};

export const onGoogleSignInWithPopUp = async () => {
  const res = await signInWithPopup(authf, googleProvider);
  console.log(res);
  return res;
};

export const sigOut = () => {
  auth()
    .signOut()
    .then(() => console.log('User signed out!'));
};
