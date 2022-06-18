import React, {useEffect, useState} from 'react';
import uuid from 'react-native-uuid';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ActivityIndicator,
  Button,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const storeUUID = async uuid => {
  try {
    const jsonValue = JSON.stringify(uuid);
    await AsyncStorage.setItem('uuid', jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const loginFunction = async () => {
  console.log('LOGGING IN!');

  // for login, generate a new UUID and save it to local storage, and send user to login on CAS
  const newID = uuid.v4();
  storeUUID(newID);

  await Linking.openURL('https://google.com');
};

const LoginNoUUID = () => {
  return <Button title="Login using IIIT-CAS" onPress={loginFunction} />;
};

const LoginUUID = () => {
  return <Button title="Click here to get your profile" />;
};

const LoadingScreen = () => {
  return <ActivityIndicator />;
};

const LoginScreen = () => {
  const [loading, setLoading] = useState(true);
  const [UUIDExists, setUUIDExists] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('uuid');
        if (value !== null) {
          setUUIDExists(true);
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
      }
      setLoading(false);
    };
    getData();
  }, [loading]);

  return (
    <View>
      {loading ? (
        <LoadingScreen />
      ) : UUIDExists ? (
        <LoginUUID />
      ) : (
        <LoginNoUUID />
      )}
    </View>
  );
};

export default LoginScreen;
