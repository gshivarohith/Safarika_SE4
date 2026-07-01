import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import ProgressBar from '../components/ProgressBar';

export default function ComplianceChecklistScreen({ route, navigation }) {
  const { hsCode, destinationCountry, complianceResult } = route.params;
  const {
    chapterDescription,
    documentsRequired,
    restricted,
    explanation,
  } = complianceResult;

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={6} total={8} />
      <View style={styles.body}>
        <Text style={styles.title}>Compliance Checklist</Text>
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

        {chapterDescription ? (
          <Text style={styles.chapterDesc}>{chapterDescription}</Text>
        ) : null}

        {explanation ? (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationText}>{explanation}</Text>
          </View>
        ) : null}

        {documentsRequired && documentsRequired.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documents Required</Text>
            {documentsRequired.map((doc, i) => (
              <View key={i} style={styles.docRow}>
                <Text style={styles.bullet}>-</Text>
                <Text style={styles.docText}>{doc}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('DocumentReadiness', {
            hsCode,
            destinationCountry,
            documentsRequired: documentsRequired || [],
            restricted: !!restricted,
          })}
        >
          <Text style={styles.buttonText}>Check My Documents</Text>
        </TouchableOpacity>
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
  chapterDesc: {
    fontSize: 13,
    color: '#555',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  explanationBox: {
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  explanationText: { fontSize: 14, color: '#1a5276', lineHeight: 22 },
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
  docRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' },
  bullet: { fontSize: 16, color: '#1F4788', marginRight: 8, lineHeight: 22 },
  docText: { fontSize: 14, color: '#333', flex: 1, lineHeight: 22 },
  button: {
    backgroundColor: '#1F4788',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
