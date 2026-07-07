import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, RefreshControl,
} from 'react-native';
import axios from 'axios';
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setError('');
    try {
      const res = await axios.post(`${API_URL}/market-demand`, { hsCode });
      // Use the 'records' array sent by the optimized backend
      setRecords(res.data.records || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Market data unavailable. Is backend running?');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true); fetchData();}} />}
    >
      <ProgressBar step={4} total={8} />
      <View style={styles.body}>
        <Text style={styles.title}>Market Intelligence</Text>
        <Text style={styles.subtitle}>Top global importers for HS Code {hsCode}</Text>

        {loading && <ActivityIndicator size="large" color="#1F4788" style={styles.loader} />}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {!loading && !error && records.length === 0 && (
          <Text style={styles.noData}>No specific trade data found for this category.</Text>
        )}

        {records.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <View style={styles.cardMid}>
                <Text style={styles.country}>{item.name}</Text>
              </View>
              <Text style={styles.value}>{formatValue(item.value)}</Text>
            </View>
          </View>
        ))}

        {!loading && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('DestinationPicker', { hsCode })}
          >
            <Text style={styles.buttonText}>Select Destination</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  body: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F4788' },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 24, marginTop: 4 },
  loader: { marginVertical: 40 },
  errorBox: { backgroundColor: '#fee2e2', padding: 16, borderRadius: 12, marginBottom: 20 },
  errorText: { color: '#dc2626', fontSize: 14, fontWeight: '600' },
  noData: { color: '#94A3B8', textAlign: 'center', marginVertical: 40 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  rank: { fontSize: 16, fontWeight: 'bold', color: '#1F4788', width: 35 },
  cardMid: { flex: 1 },
  country: { fontSize: 16, color: '#1E293B', fontWeight: '700' },
  value: { fontSize: 16, fontWeight: '800', color: '#059669' },
  button: { backgroundColor: '#1F4788', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
