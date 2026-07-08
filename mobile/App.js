import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ProductEntryScreen from './screens/ProductEntryScreen';
import HSCodeResultsScreen from './screens/HSCodeResultsScreen';
import MarketIntelligenceScreen from './screens/MarketIntelligenceScreen';
import DestinationPickerScreen from './screens/DestinationPickerScreen';
import ComplianceChecklistScreen from './screens/ComplianceChecklistScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="ProductEntry" component={ProductEntryScreen} />
        <Stack.Screen name="HSCodeResults" component={HSCodeResultsScreen} />
        <Stack.Screen name="MarketIntelligence" component={MarketIntelligenceScreen} />
        <Stack.Screen name="DestinationPicker" component={DestinationPickerScreen} />
        <Stack.Screen name="ComplianceChecklist" component={ComplianceChecklistScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
