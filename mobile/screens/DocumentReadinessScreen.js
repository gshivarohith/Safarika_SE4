import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, SafeAreaView, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBar from '../components/ProgressBar';

export default function DocumentReadinessScreen({ route, navigation }) {
  const { documentsRequired, hsCode, destinationCountry } = route.params;
  const [readiness, setReadiness] = useState({});

  // Load saved progress on mount
  useEffect(() => {
    const loadSavedReadiness = async () => {
      try {
        const saved = await AsyncStorage.getItem(`readiness_${hsCode}_${destinationCountry}`);
        if (saved) {
          setReadiness(JSON.parse(saved));
        } else {
          // Initialize with false if no saved data
          setReadiness(documentsRequired.reduce((acc, doc) => ({ ...acc, [doc]: false }), {}));
        }
      } catch (e) {
        console.error('Failed to load readiness', e);
      }
    };
    loadSavedReadiness();
  }, []);

  const toggleDoc = async (doc) => {
    const newState = { ...readiness, [doc]: !readiness[doc] };
    setReadiness(newState);
    try {
      await AsyncStorage.setItem(
        `readiness_${hsCode}_${destinationCountry}`,
        JSON.stringify(newState)
      );
    } catch (e) {
      console.error('Failed to save readiness', e);
    }
  };

  const readyCount = Object.values(readiness).filter(v => v).length;
  const totalCount = documentsRequired.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.body}>
        <ProgressBar step={7} total={8} />

        <Text style={styles.title}>Document Readiness</Text>
        <Text style={styles.subtitle}>
          Mark the documents you have ready for exporting <Text style={{fontWeight: 'bold'}}>HS {hsCode}</Text> to <Text style={{fontWeight: 'bold'}}>{destinationCountry}</Text>.
        </Text>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Readiness Level: {Math.round((readyCount / totalCount) * 100)}%</Text>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${(readyCount / totalCount) * 100}%` }]} />
          </View>
          <Text style={styles.progressSub}>{readyCount} of {totalCount} items completed</Text>
        </View>

        {documentsRequired.map((doc) => (
          <View key={doc} style={styles.docItem}>
            <Text style={styles.docName}>{doc}</Text>
            <Switch
              value={readiness[doc] || false}
              onValueChange={() => toggleDoc(doc)}
              trackColor={{ false: '#E2E8F0', true: '#1F4788' }}
            />
          </View>
        ))}

        <TouchableOpacity
          style={[styles.button, readyCount < totalCount && styles.buttonDisabled]}
          onPress={() => navigation.navigate('ExportFinal', { hsCode, destinationCountry })}
        >
          <Text style={styles.buttonText}>Finalize Export Journey</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  body: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '900', color: '#1F4788', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#64748B', marginBottom: 24, lineHeight: 22 },
  progressCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  progressTitle: { fontSize: 16, fontWeight: '800', color: '#1F4788', marginBottom: 12 },
  progressBg: { height: 12, backgroundColor: '#F1F5F9', borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: 12, backgroundColor: '#10B981' },
  progressSub: { fontSize: 12, color: '#94A3B8', marginTop: 10, fontWeight: '600' },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  docName: { fontSize: 14, color: '#334155', flex: 1, marginRight: 10, fontWeight: '600' },
  button: {
    backgroundColor: '#1F4788',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
  },
  buttonDisabled: { backgroundColor: '#94A3B8' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
