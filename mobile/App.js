import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api';

export default function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/health`, {
        timeout: 5000
      });
      setHealth(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Backend connection failed');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safarika</Text>
      <Text style={styles.subtitle}>Export Intelligence & Onboarding Navigator</Text>

      {loading && <ActivityIndicator size="large" color="#2E75B6" style={styles.loader} />}

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Backend Error:</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      )}

      {health && (
        <View style={styles.healthBox}>
          <Text style={styles.successText}>Backend Connected</Text>
          <Text style={styles.healthDetail}>Status: {health.status}</Text>
          <Text style={styles.healthDetail}>Environment: {health.environment}</Text>
          <Text style={styles.healthDetail}>Timestamp: {health.timestamp}</Text>
        </View>
      )}

      <Text style={styles.versionText}>Version 0.1.0 — Phase 0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F4788',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  errorBox: {
    backgroundColor: '#ffebee',
    borderLeftColor: '#d32f2f',
    borderLeftWidth: 4,
    padding: 16,
    borderRadius: 4,
    marginVertical: 16,
    width: '100%',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d32f2f',
  },
  errorMessage: {
    fontSize: 12,
    color: '#c62828',
    marginTop: 8,
  },
  healthBox: {
    backgroundColor: '#e8f5e9',
    borderLeftColor: '#388e3c',
    borderLeftWidth: 4,
    padding: 16,
    borderRadius: 4,
    marginVertical: 16,
    width: '100%',
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#388e3c',
  },
  healthDetail: {
    fontSize: 12,
    color: '#2e7d32',
    marginTop: 6,
    fontFamily: 'monospace',
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    marginTop: 40,
  },
});
