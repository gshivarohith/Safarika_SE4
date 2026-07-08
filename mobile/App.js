import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ProductEntryScreen from './screens/ProductEntryScreen';
import HSCodeResultsScreen from './screens/HSCodeResultsScreen';
import MarketIntelligenceScreen from './screens/MarketIntelligenceScreen';
import DestinationPickerScreen from './screens/DestinationPickerScreen';
import ComplianceChecklistScreen from './screens/ComplianceChecklistScreen';

const Stack = createStackNavigator();

export default function App() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState('Login');

  useEffect(() => {
    AsyncStorage.getItem('token')
      .then((token) => {
        setInitialRouteName(token ? 'Home' : 'Login');
      })
      .catch(() => {
        setInitialRouteName('Login');
      })
      .finally(() => {
        setCheckingSession(false);
      });
  }, []);

  if (checkingSession) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1F4788" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductEntry" component={ProductEntryScreen} />
        <Stack.Screen name="HSCodeResults" component={HSCodeResultsScreen} />
        <Stack.Screen name="MarketIntelligence" component={MarketIntelligenceScreen} />
        <Stack.Screen name="DestinationPicker" component={DestinationPickerScreen} />
        <Stack.Screen name="ComplianceChecklist" component={ComplianceChecklistScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
