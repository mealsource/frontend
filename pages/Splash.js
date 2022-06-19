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

const SplashScreen = () => {
  return (
    <View>
      <ActivityIndicator />
      <Text>Make sure you have internet access! </Text>
      <Text>Contact maintainers if issue persists.</Text>
    </View>
  );
};

export default SplashScreen;
