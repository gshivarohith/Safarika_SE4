import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import ProgressBar from '../components/ProgressBar';

export default function HSCodeResultsScreen({ route, navigation }) {
  const { result } = route.params;

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={3} total={8} />
      <View style={styles.body}>
        <Text style={styles.title}>HS Code Result</Text>
        <Text style={styles.subtitle}>Based on your product description, here is the best matching HS code.</Text>

        <View style={styles.card}>
          <Text style={styles.codeLabel}>HS Code</Text>
          <Text style={styles.code}>{result.hsCode}</Text>
          <Text style={styles.description}>{result.description}</Text>
          <View style={styles.divider} />
          <Text style={styles.explanationLabel}>Why this code?</Text>
          <Text style={styles.explanation}>{result.explanation}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MarketIntelligence', { hsCode: result.hsCode })}
        >
          <Text style={styles.buttonText}>Confirm & Check Market Demand</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Go Back & Re-classify</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  body: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F4788', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#1F4788',
    elevation: 2,
  },
  codeLabel: { fontSize: 12, color: '#1F4788', fontWeight: '600', marginBottom: 4 },
  code: { fontSize: 36, fontWeight: 'bold', color: '#1F4788', marginBottom: 6 },
  description: { fontSize: 16, color: '#333', marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 16 },
  explanationLabel: { fontSize: 12, color: '#888', fontWeight: '600', marginBottom: 4 },
  explanation: { fontSize: 14, color: '#555', fontStyle: 'italic' },
  button: {
    backgroundColor: '#1F4788',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F4788',
  },
  backText: { color: '#1F4788', fontSize: 15 },
});
