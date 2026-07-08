import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, SafeAreaView, StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api';

export default function AdminLoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // In a real app, this would be a separate admin auth endpoint
      // For now, we'll use a placeholder or simulate success for admin:admin
      if (username === 'admin' && password === 'admin') {
         navigation.replace('AdminDashboard');
      } else {
        // Fallback to regular login endpoint with admin check if backend supports it
        const res = await axios.post(`${API_URL}/auth/login`, { email: username, password });
        // Simulating admin check
        navigation.replace('AdminDashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Admin login failed. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Admin Portal</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="shield-account" size={80} color="#1F4788" />
          </View>

          <Text style={styles.title}>Secure Access</Text>
          <Text style={styles.subtitle}>Authorized Personnel Only</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Admin Username / Email"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleAdminLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Authenticate</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1F4788',
    height: 120,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 60,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  body: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    paddingTop: 40,
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: '#EEF2FF',
    padding: 20,
    borderRadius: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 16,
  },
  error: {
    color: '#E11D48',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#1F4788',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
