import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api';

export default function TranslatorScreen({ navigation }) {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('Hindi');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = ['Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam'];

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/translate`, {
        text,
        targetLanguage: targetLang,
      });
      setTranslatedText(res.data.translatedText);
    } catch (err) {
      alert('Translation failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title}>Trade Translator</Text>
          <Text style={styles.subtitle}>Translate product info or messages for global buyers.</Text>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>Text to Translate</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="e.g. This is a premium quality organic cotton scarf..."
            value={text}
            onChangeText={setText}
          />
        </View>

        <Text style={styles.sectionLabel}>Select Language</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langList}>
          {languages.map(lang => (
            <TouchableOpacity
              key={lang}
              style={[styles.langBtn, targetLang === lang && styles.langBtnActive]}
              onPress={() => setTargetLang(lang)}
            >
              <Text style={[styles.langText, targetLang === lang && styles.langTextActive]}>{lang}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.primaryButton} onPress={handleTranslate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Translate Message</Text>}
        </TouchableOpacity>

        {translatedText ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>{targetLang} Translation:</Text>
            <Text style={styles.resultText}>{translatedText}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  body: { padding: 24 },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '900', color: '#1F4788' },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 8 },
  inputCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 24, elevation: 2 },
  label: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 12 },
  input: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 16, minHeight: 120, textAlignVertical: 'top' },
  sectionLabel: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  langList: { marginBottom: 24 },
  langBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  langBtnActive: { backgroundColor: '#1F4788', borderColor: '#1F4788' },
  langText: { color: '#64748B', fontWeight: '600' },
  langTextActive: { color: '#fff' },
  primaryButton: { backgroundColor: '#1F4788', borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  resultCard: { marginTop: 32, backgroundColor: '#EEF2FF', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#E0E7FF' },
  resultLabel: { fontSize: 12, fontWeight: '900', color: '#4338CA', marginBottom: 8, textTransform: 'uppercase' },
  resultText: { fontSize: 18, color: '#1E293B', lineHeight: 28, fontWeight: '500' },
});
