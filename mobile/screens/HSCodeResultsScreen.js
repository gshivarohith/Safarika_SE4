import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProgressBar from '../components/ProgressBar';

export default function HSCodeResultsScreen({ route, navigation }) {
  const { result } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.body}>
        <ProgressBar step={3} total={8} />

        <View style={styles.header}>
          <Text style={styles.title}>Classification Result</Text>
          <Text style={styles.subtitle}>Our AI has identified the most accurate customs code for your product.</Text>
        </View>

        <View style={styles.resultCard}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeLabel}>HS CODE</Text>
            <Text style={styles.codeValue}>{result.hsCode}</Text>
          </View>

          <Text style={styles.descriptionText}>{result.description}</Text>

          <View style={styles.divider} />

          <View style={styles.aiSection}>
            <View style={styles.aiHeader}>
              <MaterialCommunityIcons name="robot-outline" size={20} color="#1F4788" />
              <Text style={styles.aiTitle}>AI Analysis</Text>
            </View>
            <Text style={styles.explanationText}>{result.explanation}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('MarketIntelligence', { hsCode: result.hsCode })}
        >
          <Text style={styles.buttonText}>Check Global Demand</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Re-describe Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  body: { padding: 24 },
  header: { marginBottom: 24, marginTop: 10 },
  title: { fontSize: 28, fontWeight: '900', color: '#1F4788' },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 6, lineHeight: 22 },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  codeBadge: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  codeLabel: { fontSize: 12, fontWeight: '800', color: '#4F46E5', letterSpacing: 1 },
  codeValue: { fontSize: 36, fontWeight: '900', color: '#1F4788', marginTop: 4 },
  descriptionText: { fontSize: 18, fontWeight: '700', color: '#1E293B', textAlign: 'center', lineHeight: 26 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  aiTitle: { fontSize: 14, fontWeight: '800', color: '#1F4788', marginLeft: 8, textTransform: 'uppercase' },
  explanationText: { fontSize: 15, color: '#475569', lineHeight: 22, fontStyle: 'italic' },
  primaryButton: {
    backgroundColor: '#1F4788',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 10 },
  secondaryButton: { paddingVertical: 16, alignItems: 'center' },
  secondaryButtonText: { color: '#64748B', fontSize: 15, fontWeight: '600' },
});
