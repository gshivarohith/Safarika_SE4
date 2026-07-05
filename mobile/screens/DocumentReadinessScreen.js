import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import ProgressBar from '../components/ProgressBar';

export default function DocumentReadinessScreen({ route }) {
  const {
    hsCode, destinationCountry, documentsRequired, restricted,
  } = route.params;

  const [checked, setChecked] = useState(() => documentsRequired.map(() => false));

  const toggle = (index) => {
    setChecked((prev) => prev.map((val, i) => (i === index ? !val : val)));
  };

  const readyCount = checked.filter(Boolean).length;
  const allReady = documentsRequired.length > 0 && readyCount === documentsRequired.length;

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={7} total={8} />
      <View style={styles.body}>
        <Text style={styles.title}>Document Readiness</Text>
        <Text style={styles.subtitle}>
          Exporting HS {hsCode} to {destinationCountry}
        </Text>

        {restricted && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              {destinationCountry} is a restricted destination for this product category. Verify with DGFT before proceeding.
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {readyCount} of {documentsRequired.length} documents ready
          </Text>
          {documentsRequired.map((doc, i) => (
            <TouchableOpacity
              key={i}
              style={styles.docRow}
              onPress={() => toggle(i)}
            >
              <View style={[styles.checkbox, checked[i] && styles.checkboxChecked]}>
                {checked[i] && <Text style={styles.checkmark}>{'✓'}</Text>}
              </View>
              <Text style={[styles.docText, checked[i] && styles.docTextChecked]}>{doc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {allReady && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              All documents ready. You're set to export.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  body: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F4788', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  warningBox: {
    backgroundColor: '#fff3cd',
    borderLeftColor: '#f0ad4e',
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  warningText: { color: '#856404', fontSize: 13, lineHeight: 20 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F4788',
    marginBottom: 12,
  },
  docRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1F4788',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#1F4788' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  docText: { fontSize: 14, color: '#333', flex: 1, lineHeight: 22 },
  docTextChecked: { color: '#999', textDecorationLine: 'line-through' },
  successBox: {
    backgroundColor: '#d4edda',
    borderRadius: 8,
    padding: 14,
  },
  successText: { color: '#155724', fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
