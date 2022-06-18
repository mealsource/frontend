import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

const HomePage = () => {
  // use user state
  const [user, setUser] = useState(0);
  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        setUser(await AsyncStorage.getItem('user'));
        console.log('state', user);
      } catch (e) {
        console.log('User getting error', e);
      }
    };
    getUserFromStorage();
  }, [user]);
  return (
    <View>
      <Text>Home page!</Text>
      {user ? <Text>User</Text> : <ActivityIndicator />}
    </View>
  );
};

export default HomePage;
