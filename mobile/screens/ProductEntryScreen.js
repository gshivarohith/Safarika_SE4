import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import ProgressBar from '../components/ProgressBar';

const API_URL = 'http://10.0.2.2:3000/api';

export default function ProductEntryScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const classify = async () => {
    if (!description.trim()) {
      setError('Please describe your product to proceed.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/classify`, {
        productDescription: description.trim()
      }, { timeout: 15000 });

      navigation.navigate('HSCodeResults', { result: res.data });
    } catch (err) {
      if (!err.response) {
        setError('Network Connection Failed. Ensure your server is active.');
      } else {
        setError(err.response.data.details || err.response.data.error || 'Classification system busy.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <ProgressBar step={2} total={8} />

          <View style={styles.header}>
            <Text style={styles.title}>Product Identifier</Text>
            <Text style={styles.subtitle}>
              Describe your product in natural language. We'll identify the correct HS Code and customs category.
            </Text>
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.label}>Product Description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Handmade cotton scarves with silk embroidery..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
            <View style={styles.tipBox}>
              <MaterialCommunityIcons name="lightbulb-on" size={16} color="#4F46E5" />
              <Text style={styles.tipText}>Tip: Mention material (e.g. cotton, wood) and use case for better accuracy.</Text>
            </View>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons name="alert-circle" size={20} color="#E11D48" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.primaryButton, loading && { opacity: 0.7 }]}
            onPress={classify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Identify HS Code</Text>
                <MaterialCommunityIcons name="magnify-scan" size={22} color="#fff" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backLink}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backLinkText}>Cancel and Return to Dashboard</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  body: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1F4788',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 8,
    lineHeight: 22,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
  },
  tipText: {
    fontSize: 12,
    color: '#4F46E5',
    marginLeft: 8,
    flex: 1,
    fontWeight: '600',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  errorText: {
    color: '#E11D48',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#1F4788',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#1F4788',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  backLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  backLinkText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});
