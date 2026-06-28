import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import axios from 'axios';
import ProgressBar from '../components/ProgressBar';

const API_URL = 'http://10.0.2.2:3000/api';

export default function ProductEntryScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const classify = async () => {
    if (!description.trim()) {
      setError('Please describe your product.');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/classify`, { productDescription: description });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Classification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ProgressBar step={2} total={8} />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Describe Your Product</Text>
        <Text style={styles.subtitle}>Tell us what you want to export and we'll find the right HS code.</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Basmati rice, organic, packaged in 5kg bags"
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={classify} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={classify} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Classify Product</Text>
          }
        </TouchableOpacity>

        {result ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>HS Code</Text>
            <Text style={styles.resultCode}>{result.hsCode}</Text>
            <Text style={styles.resultDesc}>{result.description}</Text>
            <Text style={styles.resultExplanation}>{result.explanation}</Text>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  body: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F4788', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: '#333',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1F4788',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
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
  resultBox: {
    backgroundColor: '#e8f0fe',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
  },
  resultLabel: { fontSize: 12, color: '#1F4788', fontWeight: '600', marginBottom: 4 },
  resultCode: { fontSize: 28, fontWeight: 'bold', color: '#1F4788', marginBottom: 4 },
  resultDesc: { fontSize: 15, color: '#333', marginBottom: 8 },
  resultExplanation: { fontSize: 13, color: '#555', fontStyle: 'italic' },
});
