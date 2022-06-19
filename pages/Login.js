import React, {useEffect, useState} from 'react';
import uuid from 'react-native-uuid';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Image,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {Button} from 'react-native-paper';
import API_URL from './Constants';
import SplashScreen from './Splash';
import {color} from 'react-native-reanimated';

const storeUUID = async uuid => {
  try {
    const jsonValue = JSON.stringify(uuid);
    await AsyncStorage.setItem('uuid', jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const loginFunction = async (setLoading, setUUID, setUUIDExists) => {
  console.log('LOGGING IN!');

  // for login, generate a new UUID and save it to local storage, and send user to login on CAS
  const newID = uuid.v4();
  await storeUUID(newID);
  setLoading(true);
  setUUID(newID);
  setUUIDExists(true);

  const linkingUrl = API_URL + 'login?uuid=' + newID;
  console.log(linkingUrl);
  await Linking.openURL(linkingUrl);
};

const LoginNoUUID = ({setLoading, setUUID, setUUIDExists}) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        style={{width: 300, height: 150, marginBottom: 30}}
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/en/e/e1/International_Institute_of_Information_Technology%2C_Hyderabad_logo.png',
        }}
      />
      <Button
        compact={false}
        icon="school"
        onPress={() => loginFunction(setLoading, setUUID, setUUIDExists)}>
        Login using IIIT-CAS
      </Button>
    </View>
  );
};

const LoginUUID = ({uuid, setLogIn, setUUIDExists, UUIDExists}) => {
  return (
    <Button
      compact={false}
      icon="login"
      onPress={() => getToken(uuid, setLogIn, setUUIDExists, UUIDExists)}>
      Complete Login
    </Button>
  );
};

const getToken = async (uuid, setLogIn, setUUIDExists) => {
  const tokenUrl = API_URL + 'token?uuid=' + uuid;

  return fetch(tokenUrl)
    .then(async response => {
      if (response.status == 200) {
        const responseData = await response.json();
        const user = JSON.stringify(responseData.user);
        // setUser
        const addUserToStorage = async user => {
          try {
            await AsyncStorage.setItem('user', user);

            setLogIn(true);
          } catch (e) {
            console.log(e);
          }
        };
        await addUserToStorage(user);
      } else {
        const removeValue = async () => {
          try {
            await AsyncStorage.removeItem('uuid');
          } catch (e) {
            console.log(e);
          }
          console.log('Done.');
        };
        removeValue();
        setUUIDExists(false);
      }
    })
    .catch(e => {
      // console.log(e);
      setUUIDExists(false);
    });
};

const LoginScreen = ({route, navigation}) => {
  const setLogIn = route.params.setLogIn;

  const [loading, setLoading] = useState(true);
  const [UUIDExists, setUUIDExists] = useState(false);
  const [uuid, setUUID] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('uuid');
        if (value !== null) {
          setUUIDExists(true);
          setUUID(JSON.parse(value));
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
      }
      setLoading(false);
    };
    getData();
  }, [loading, UUIDExists]);

  return (
    <View>
      {loading ? (
        <SplashScreen />
      ) : UUIDExists ? (
        <LoginUUID
          uuid={uuid}
          setLogIn={setLogIn}
          setUUIDExists={setUUIDExists}
          UUIDExists={UUIDExists}
        />
      ) : (
        <LoginNoUUID
          setLoading={setLoading}
          setUUID={setUUID}
          setUUIDExists={setUUIDExists}
        />
      )}
    </View>
  );
};

export default LoginScreen;
