import React, {useEffect, useState} from 'react';
import LoginScreen from './pages/Login.js';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {
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
import HomePage from './pages/Home.js';
import {NavigationContainer, StackRouter} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setLogIn] = useState(false);

  useEffect(() => {
    const checkLogged = async () => {
      try {
        if (await AsyncStorage.getItem('user')) {
          setLogIn(true);
        } else {
          setLogIn(false);
        }
      } catch (e) {
        console.log('Error:', e);
        setLogIn(false);
      }
    };

    checkLogged();
  }, [isLoggedIn]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home" component={HomePage} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              initialParams={{isLoggedIn: isLoggedIn, setLogIn: setLogIn}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default App;
