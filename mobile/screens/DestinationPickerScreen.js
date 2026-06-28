import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import ProgressBar from '../components/ProgressBar';

const API_URL = 'http://10.0.2.2:3000/api';

const DESTINATIONS = [
  'United States',
  'United Arab Emirates',
  'United Kingdom',
  'Germany',
  'China',
  'Singapore',
  'Saudi Arabia',
  'Netherlands',
  'Bangladesh',
  'Australia',
  'Japan',
  'France',
  'Hong Kong',
  'Belgium',
  'Canada',
];

export default function DestinationPickerScreen({ route, navigation }) {
  const { hsCode } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState('');

  const handleSelect = async (country) => {
    setSelected(country);
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/compliance-check`, {
        hsCode,
        destinationCountry: country,
      });
      navigation.navigate('ComplianceChecklist', {
        hsCode,
        destinationCountry: country,
        complianceResult: res.data,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Compliance check failed. Please try again.');
    } finally {
      setLoading(false);
      setSelected('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={5} total={8} />
      <View style={styles.body}>
        <Text style={styles.title}>Pick Export Destination</Text>
        <Text style={styles.subtitle}>
          Where do you want to export HS Code {hsCode}?
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {DESTINATIONS.map((country) => (
          <TouchableOpacity
            key={country}
            style={[
              styles.countryCard,
              selected === country && styles.countryCardSelected,
            ]}
            onPress={() => handleSelect(country)}
            disabled={loading}
          >
            {loading && selected === country ? (
              <ActivityIndicator size="small" color="#1F4788" />
            ) : (
              <Text style={[
                styles.countryName,
                selected === country && styles.countryNameSelected,
              ]}>
                {country}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  body: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F4788', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  errorBox: {
    backgroundColor: '#ffebee',
    borderLeftColor: '#d32f2f',
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  errorText: { color: '#d32f2f', fontSize: 13 },
  countryCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  countryCardSelected: {
    borderColor: '#1F4788',
    backgroundColor: '#e8eef7',
  },
  countryName: { fontSize: 15, color: '#333' },
  countryNameSelected: { color: '#1F4788', fontWeight: '600' },
});
