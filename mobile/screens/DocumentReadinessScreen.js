import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch,
} from 'react-native';
import ProgressBar from '../components/ProgressBar';

export default function DocumentReadinessScreen({ route, navigation }) {
  const { documentsRequired, hsCode, destinationCountry } = route.params;
  const [readiness, setReadiness] = useState(
    documentsRequired.reduce((acc, doc) => ({ ...acc, [doc]: false }), {})
  );

  const toggleDoc = (doc) => {
    setReadiness({ ...readiness, [doc]: !readiness[doc] });
  };

  const readyCount = Object.values(readiness).filter(v => v).length;
  const totalCount = documentsRequired.length;

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={7} total={8} />
      <View style={styles.body}>
        <Text style={styles.title}>Document Readiness</Text>
        <Text style={styles.subtitle}>
          Track your documents for exporting {hsCode} to {destinationCountry}.
        </Text>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Ready: {readyCount} / {totalCount}</Text>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${(readyCount / totalCount) * 100}%` }]} />
          </View>
        </View>

        {documentsRequired.map((doc) => (
          <View key={doc} style={styles.docItem}>
            <Text style={styles.docName}>{doc}</Text>
            <Switch
              value={readiness[doc]}
              onValueChange={() => toggleDoc(doc)}
              trackColor={{ false: '#ddd', true: '#1F4788' }}
            />
          </View>
        ))}

        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('Export Readiness Confirmed! In Phase 1, this will connect you with a logistics partner.')}
        >
          <Text style={styles.buttonText}>Confirm Readiness</Text>
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
  progressCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 24,
    elevation: 2,
  },
  progressTitle: { fontSize: 16, fontWeight: '700', color: '#1F4788', marginBottom: 12 },
  progressBg: { height: 10, backgroundColor: '#eee', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: 10, backgroundColor: '#10B981' },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'space-between',
    elevation: 1,
  },
  docName: { fontSize: 14, color: '#333', flex: 1, marginRight: 10 },
  button: {
    backgroundColor: '#1F4788',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
