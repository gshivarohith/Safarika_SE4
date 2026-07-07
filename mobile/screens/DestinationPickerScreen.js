import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, SafeAreaView, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import ProgressBar from '../components/ProgressBar';

const API_URL = 'http://10.0.2.2:3000/api';

const DESTINATIONS = [
  { name: 'United States', code: 'USA', icon: 'map-marker-outline' },
  { name: 'United Arab Emirates', code: 'UAE', icon: 'map-marker-outline' },
  { name: 'United Kingdom', code: 'UK', icon: 'map-marker-outline' },
  { name: 'Germany', code: 'GER', icon: 'map-marker-outline' },
  { name: 'China', code: 'CHN', icon: 'map-marker-outline' },
  { name: 'Netherlands', code: 'NLD', icon: 'map-marker-outline' },
  { name: 'Saudi Arabia', code: 'SAU', icon: 'map-marker-outline' },
  { name: 'Australia', code: 'AUS', icon: 'map-marker-outline' },
  { name: 'Japan', code: 'JPN', icon: 'map-marker-outline' },
  { name: 'France', code: 'FRA', icon: 'map-marker-outline' },
];

export default function DestinationPickerScreen({ route, navigation }) {
  const { hsCode } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState('');

  const handleSelect = async (countryName) => {
    setSelected(countryName);
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/compliance-check`, {
        hsCode,
        destinationCountry: countryName,
      });
      navigation.navigate('ComplianceChecklist', {
        hsCode,
        destinationCountry: countryName,
        complianceResult: res.data,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Compliance connection timed out. Please retry.');
    } finally {
      setLoading(false);
      setSelected('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ProgressBar step={5} total={8} />

        <View style={styles.header}>
          <Text style={styles.title}>Export Destination</Text>
          <Text style={styles.subtitle}>
            Select your target market for HS Code <Text style={styles.hsHighlight}>{hsCode}</Text>. We'll analyze specific import rules.
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#E11D48" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.grid}>
          {DESTINATIONS.map((country) => (
            <TouchableOpacity
              key={country.name}
              style={[
                styles.countryCard,
                selected === country.name && styles.cardSelected,
              ]}
              onPress={() => handleSelect(country.name)}
              disabled={loading}
            >
              {loading && selected === country.name ? (
                <ActivityIndicator size="small" color="#1F4788" />
              ) : (
                <>
                  <View style={styles.iconCircle}>
                    <MaterialCommunityIcons
                      name={country.icon}
                      size={24}
                      color={selected === country.name ? "#1F4788" : "#94A3B8"}
                    />
                  </View>
                  <Text style={[
                    styles.countryName,
                    selected === country.name && styles.nameSelected,
                  ]}>
                    {country.name}
                  </Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1F4788',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 8,
    lineHeight: 22,
  },
  hsHighlight: {
    color: '#1F4788',
    fontWeight: '800',
  },
  grid: {
    marginTop: 10,
  },
  countryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardSelected: {
    borderColor: '#1F4788',
    backgroundColor: '#EEF2FF',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  countryName: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
    flex: 1,
  },
  nameSelected: {
    color: '#1F4788',
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  errorText: {
    color: '#E11D48',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
    flex: 1,
  },
});
