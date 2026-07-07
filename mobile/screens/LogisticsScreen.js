import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Linking
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LogisticsScreen({ route, navigation }) {
  const { destinationCountry } = route.params;

  const providers = [
    { name: 'Safarika Express', type: 'Air/Sea', time: '5-7 Days', cost: '$$', icon: 'ship-wheel' },
    { name: 'Global MSME Freight', type: 'Sea Cargo', time: '15-20 Days', cost: '$', icon: 'anchor' },
    { name: 'India-Global Logistics', type: 'Air Freight', time: '2-3 Days', cost: '$$$', icon: 'airplane' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title}>Logistics Partners</Text>
          <Text style={styles.subtitle}>Verified providers for shipping to {destinationCountry}.</Text>
        </View>

        {providers.map((p, i) => (
          <TouchableOpacity key={i} style={styles.providerCard} onPress={() => alert('Requesting Quote from ' + p.name)}>
            <View style={styles.cardTop}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name={p.icon} size={28} color="#1F4788" />
              </View>
              <View style={styles.titleInfo}>
                <Text style={styles.providerName}>{p.name}</Text>
                <Text style={styles.providerType}>{p.type}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardBottom}>
              <View style={styles.meta}>
                <MaterialCommunityIcons name="clock-outline" size={16} color="#64748B" />
                <Text style={styles.metaText}>{p.time}</Text>
              </View>
              <View style={styles.meta}>
                <MaterialCommunityIcons name="currency-usd" size={16} color="#64748B" />
                <Text style={styles.metaText}>Est. Cost: {p.cost}</Text>
              </View>
              <Text style={styles.quoteBtn}>Get Quote</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Safarika does not handle shipping directly. We connect you with certified logistics partners.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  body: { padding: 24 },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '900', color: '#1F4788' },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 8 },
  providerCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  titleInfo: { flex: 1 },
  providerName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  providerType: { fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 15 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, color: '#64748B', marginLeft: 4 },
  quoteBtn: { color: '#1F4788', fontWeight: 'bold', fontSize: 14 },
  disclaimer: { marginTop: 20, padding: 15, backgroundColor: '#EFF6FF', borderRadius: 12 },
  disclaimerText: { fontSize: 12, color: '#1F4788', textAlign: 'center', lineHeight: 18 },
});
