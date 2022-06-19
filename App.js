import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import LoginScreen from './pages/Login.js';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomePage from './pages/Home.js';
import {NavigationContainer, StackRouter} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './pages/Splash.js';
import OrderPage from './pages/Order.js';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PlacePage from './pages/Place.js';

const Tab = createMaterialBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#08457e',
    accent: '#ffffff',
  },
};

const App = () => {
  const [isLoggedIn, setLogIn] = useState(false); // assume not logged in by default
  const [loaded, setLoaded] = useState(false); // LOADING

  useEffect(() => {
    const checkLogged = async () => {
      try {
        if (await AsyncStorage.getItem('user')) {
          setLogIn(true);
        } else {
          setLogIn(false);
        }
        setLoaded(true);
      } catch (e) {
        console.log('Error:', e);
        setLogIn(false);
      }
    };

    checkLogged();
  }, [isLoggedIn]);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        {loaded ? (
          <>
            {isLoggedIn ? (
              <Tab.Navigator
                activeColor="#ffffff"
                barStyle={{backgroundColor: '#08457e'}}>
                <Tab.Screen
                  name="Home"
                  component={HomePage}
                  options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({color}) => (
                      <MaterialCommunityIcons
                        name="home"
                        color={color}
                        size={26}
                      />
                    ),
                  }}
                />

                <Tab.Screen
                  name="Place"
                  component={PlacePage}
                  options={{
                    tabBarLabel: 'Create',
                    tabBarIcon: ({color}) => (
                      <MaterialCommunityIcons
                        name="access-point-plus"
                        color={color}
                        size={26}
                      />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Order"
                  component={OrderPage}
                  options={{
                    tabBarLabel: 'Orders',
                    tabBarIcon: ({color}) => (
                      <MaterialCommunityIcons
                        name="format-list-bulleted"
                        color={color}
                        size={26}
                      />
                    ),
                  }}
                />
              </Tab.Navigator>
            ) : (
              <Stack.Navigator>
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  initialParams={{isLoggedIn: isLoggedIn, setLogIn: setLogIn}}
                />
              </Stack.Navigator>
            )}
          </>
        ) : (
          <SplashScreen />
        )}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
