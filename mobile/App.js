import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import ProductEntryScreen from './screens/ProductEntryScreen';
import HSCodeResultsScreen from './screens/HSCodeResultsScreen';
import MarketIntelligenceScreen from './screens/MarketIntelligenceScreen';
import DestinationPickerScreen from './screens/DestinationPickerScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ProductEntry" component={ProductEntryScreen} />
        <Stack.Screen name="HSCodeResults" component={HSCodeResultsScreen} />
        <Stack.Screen name="MarketIntelligence" component={MarketIntelligenceScreen} />
        <Stack.Screen name="DestinationPicker" component={DestinationPickerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
