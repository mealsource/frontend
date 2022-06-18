import React, {useEffect, useState} from 'react';
import uuid from 'react-native-uuid';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

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
import API_URL from './Constants';

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
    <View>
      <Button
        title="Login using IIIT-CAS"
        onPress={() => loginFunction(setLoading, setUUID, setUUIDExists)}
      />
    </View>
  );
};

const LoginUUID = ({uuid, setLogIn, setUUIDExists, UUIDExists}) => {
  return (
    <Button
      title="Click here to get your profile"
      onPress={() => getToken(uuid, setLogIn, setUUIDExists, UUIDExists)}
    />
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
          } catch (e) {
            console.log(e);
          }
        };
        await addUserToStorage(user);

        setLogIn(true);
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

const LoadingScreen = () => {
  return (
    <View>
      <ActivityIndicator />
      <Text>Make sure you have internet access! </Text>
      <Text>Contact maintainers if issue persists.</Text>
    </View>
  );
};

const LoginScreen = ({route, navigation}) => {
  const {isLoggedIn, setLogIn} = route.params;

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
          console.log('Ba');
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
        <LoadingScreen />
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
