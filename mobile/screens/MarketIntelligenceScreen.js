import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBar from '../components/ProgressBar';

const API_URL = 'http://10.0.2.2:3000/api';

function formatValue(value) {
  if (!value) return 'N/A';
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value}`;
}

export default function MarketIntelligenceScreen({ route, navigation }) {
  const { hsCode } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [records, setRecords] = useState([]);
  const [period, setPeriod] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/market-demand`,
        { hsCode },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const raw = res.data.data?.data || [];
      const byReporter = {};
      raw.forEach(r => {
        const key = r.reporterCode;
        if (!byReporter[key]) {
          byReporter[key] = {
            name: r.reporterDesc || r.reporterISO || String(r.reporterCode || ''),
            total: 0,
            netWgt: 0,
          };
        }
        byReporter[key].total += (r.primaryValue || 0);
        byReporter[key].netWgt += (r.netWgt || 0);
      });
      const sorted = Object.values(byReporter)
        .filter(r => r.total > 0)
        .sort((a, b) => b.total - a.total);
      setRecords(sorted);
      setPeriod(res.data.period);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load market data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={4} total={8} />
      <View style={styles.body}>
        <Text style={styles.title}>Market Intelligence</Text>
        <Text style={styles.subtitle}>
          Top importing countries for HS Code {hsCode} ({period})
        </Text>

        {loading && <ActivityIndicator size="large" color="#1F4788" style={styles.loader} />}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!loading && !error && records.length === 0 && (
          <Text style={styles.noData}>No trade data found for this HS code.</Text>
        )}

        {records.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <View style={styles.cardMid}>
                <Text style={styles.country}>{item.name}</Text>
                {item.netWgt > 0 && (
                  <Text style={styles.weight}>{(item.netWgt / 1000).toFixed(1)} t net wt</Text>
                )}
              </View>
              <Text style={styles.value}>{formatValue(item.total)}</Text>
            </View>
          </View>
        ))}

        {!loading && !error && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('DestinationPicker', { hsCode })}
          >
            <Text style={styles.buttonText}>Pick Export Destination</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  body: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F4788', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  loader: { marginVertical: 40 },
  errorBox: {
    backgroundColor: '#ffebee',
    borderLeftColor: '#d32f2f',
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  errorText: { color: '#d32f2f', fontSize: 13 },
  retryButton: { marginTop: 8 },
  retryText: { color: '#d32f2f', fontSize: 13, fontWeight: '600' },
  noData: { color: '#888', fontSize: 14, textAlign: 'center', marginVertical: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    elevation: 1,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  rank: { fontSize: 16, fontWeight: 'bold', color: '#1F4788', width: 32 },
  cardMid: { flex: 1 },
  country: { fontSize: 15, color: '#333' },
  weight: { fontSize: 12, color: '#888', marginTop: 2 },
  value: { fontSize: 15, fontWeight: '600', color: '#1F4788' },
  button: {
    backgroundColor: '#1F4788',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
