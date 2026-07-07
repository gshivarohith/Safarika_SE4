import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Share
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProgressBar from '../components/ProgressBar';

export default function ExportFinalScreen({ route, navigation }) {
  const { hsCode, destinationCountry } = route.params;

  const handleShareReport = async () => {
    try {
      await Share.share({
        message: `Safarika Export Readiness Report\nProduct: HS ${hsCode}\nDestination: ${destinationCountry}\nStatus: Ready to Ship!`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <ProgressBar step={8} total={8} />

        <View style={styles.successHeader}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="check-decagram" size={60} color="#10B981" />
          </View>
          <Text style={styles.title}>You are Export Ready!</Text>
          <Text style={styles.subtitle}>
            Your journey for <Text style={styles.boldText}>HS {hsCode}</Text> to <Text style={styles.boldText}>{destinationCountry}</Text> is now complete.
          </Text>
        </View>

        {/* Certificate Style Summary */}
        <View style={styles.certificateCard}>
          <View style={styles.certHeader}>
            <MaterialCommunityIcons name="shield-star" size={24} color="#1F4788" />
            <Text style={styles.certHeaderText}>READINESS SUMMARY</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Customs Code</Text>
            <Text style={styles.value}>HS {hsCode}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Target Market</Text>
            <Text style={styles.value}>{destinationCountry}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Compliance Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>VERIFIED</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Execution Steps</Text>

        {/* Navigation to Logistics Screen */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Logistics', { destinationCountry })}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#EEF2FF' }]}>
            <MaterialCommunityIcons name="truck-delivery" size={28} color="#4338CA" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Connect with Shippers</Text>
            <Text style={styles.actionSub}>Request quotes for {destinationCountry}.</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        {/* Share/Download Logic */}
        <TouchableOpacity style={styles.actionCard} onPress={handleShareReport}>
          <View style={[styles.actionIconBox, { backgroundColor: '#F0F9FF' }]}>
            <MaterialCommunityIcons name="file-pdf-box" size={28} color="#0284C7" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Share Readiness Report</Text>
            <Text style={styles.actionSub}>Export journey summary as PDF.</Text>
          </View>
          <MaterialCommunityIcons name="share-variant-outline" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.finishBtn}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.finishBtnText}>Finish & Return Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  body: { padding: 24, paddingBottom: 40 },
  successHeader: { alignItems: 'center', marginVertical: 20 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '900', color: '#1F4788', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 22, paddingHorizontal: 10 },
  boldText: { color: '#1F4788', fontWeight: '800' },
  certificateCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 32, elevation: 6, shadowColor: '#1F4788', shadowOpacity: 0.1, shadowRadius: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  certHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  certHeaderText: { fontSize: 13, fontWeight: '900', color: '#1F4788', marginLeft: 10, letterSpacing: 1 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  label: { color: '#64748B', fontSize: 14, fontWeight: '600' },
  value: { color: '#1E293B', fontWeight: '800', fontSize: 15 },
  statusBadge: { backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  sectionLabel: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  actionCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  actionIconBox: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  actionText: { flex: 1, marginLeft: 16 },
  actionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  actionSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  finishBtn: { marginTop: 32, backgroundColor: '#1F4788', paddingVertical: 18, borderRadius: 16, alignItems: 'center', elevation: 4 },
  finishBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
