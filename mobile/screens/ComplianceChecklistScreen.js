import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ProgressBar step={6} total={8} />

        <View style={styles.header}>
          <Text style={styles.title}>Compliance Checklist</Text>
          <Text style={styles.subtitle}>
            Exporting <Text style={styles.boldText}>HS {hsCode}</Text> to <Text style={styles.boldText}>{destinationCountry}</Text>
          </Text>
        </View>

        {restricted && (
          <View style={styles.warningBox}>
            <MaterialCommunityIcons name="alert-decagram" size={24} color="#991B1B" />
            <Text style={styles.warningText}>
              {destinationCountry} is a restricted destination for this category. Verify with DGFT before proceeding.
            </Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.chapterTitle}>{chapterDescription || 'Export Category Information'}</Text>

          {explanation ? (
            <View style={styles.aiSection}>
              <View style={styles.aiHeader}>
                <MaterialCommunityIcons name="robot-outline" size={18} color="#1F4788" />
                <Text style={styles.aiTitle}>AI Advisor</Text>
              </View>
              <Text style={styles.explanationText}>{explanation}</Text>
            </View>
          ) : null}

          {documentsRequired && documentsRequired.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mandatory Documents</Text>
              {documentsRequired.map((doc, i) => (
                <View key={i} style={styles.docRow}>
                  <View style={styles.bulletBox}>
                    <MaterialCommunityIcons name="file-document-outline" size={20} color="#1F4788" />
                  </View>
                  <Text style={styles.docText}>{doc}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('DocumentReadiness', {
            hsCode,
            destinationCountry,
            documentsRequired: documentsRequired || [],
            restricted: !!restricted,
          })}
        >
          <Text style={styles.buttonText}>Check My Documents</Text>
          <MaterialCommunityIcons name="clipboard-check-outline" size={20} color="#fff" style={{ marginLeft: 10 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backLinkText}>Change Destination</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  header: { marginTop: 20, marginBottom: 28 },
  title: { fontSize: 28, fontWeight: '900', color: '#1F4788' },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 6, lineHeight: 22 },
  boldText: { color: '#1F4788', fontWeight: '800' },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  warningText: { color: '#991B1B', fontSize: 13, marginLeft: 12, flex: 1, fontWeight: '600', lineHeight: 18 },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  chapterTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20 },
  aiSection: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  aiTitle: { fontSize: 12, fontWeight: '900', color: '#1F4788', marginLeft: 6, textTransform: 'uppercase', letterSpacing: 1 },
  explanationText: { fontSize: 14, color: '#475569', lineHeight: 22, fontStyle: 'italic' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  docRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  bulletBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  docText: { fontSize: 14, color: '#334155', flex: 1, fontWeight: '600' },
  primaryButton: {
    backgroundColor: '#1F4788',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#1F4788',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  backLink: { marginTop: 24, alignItems: 'center' },
  backLinkText: { color: '#64748B', fontSize: 14, fontWeight: '600' },
});
