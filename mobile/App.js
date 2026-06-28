import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

function PlaceholderScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{route.name}</Text>
      <Text style={styles.sub}>Coming soon</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={PlaceholderScreen} />
        <Stack.Screen name="ProductEntry" component={PlaceholderScreen} />
        <Stack.Screen name="HSCodeResults" component={PlaceholderScreen} />
        <Stack.Screen name="MarketIntelligence" component={PlaceholderScreen} />
        <Stack.Screen name="DestinationPicker" component={PlaceholderScreen} />
        <Stack.Screen name="ComplianceChecklist" component={PlaceholderScreen} />
        <Stack.Screen name="DocumentReadiness" component={PlaceholderScreen} />
        <Stack.Screen name="ExportSummary" component={PlaceholderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
  text: { fontSize: 22, fontWeight: 'bold', color: '#1F4788' },
  sub: { fontSize: 14, color: '#999', marginTop: 8 },
});
