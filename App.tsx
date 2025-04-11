import 'react-native-gesture-handler'; // 👈 Obligatorio al principio
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Platform, LogBox } from 'react-native';

// Evita warning web (opcional pero recomendado)
if (Platform.OS === 'web') {
  LogBox.ignoreLogs(['Warning: findDOMNode is deprecated']);
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});