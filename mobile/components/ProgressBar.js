import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressBar({ step, total }) {
  const progress = step / total;

  return (
    <View style={styles.wrapper}>
      <View style={styles.track}>
        <View style={[styles.fill, { flex: progress }]} />
        <View style={{ flex: 1 - progress }} />
      </View>
      <Text style={styles.label}>Step {step} of {total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 48,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom: 12,
  },
  track: {
    height: 6,
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: '#1F4788',
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
    textAlign: 'right',
  },
});
