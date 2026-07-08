import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, FlatList
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PENDING_REQUESTS = [
  { id: '1', user: 'Hemanth Exports', product: 'Cotton T-Shirts', destination: 'Germany', status: 'Pending Verification' },
  { id: '2', user: 'Shiva Agro', product: 'Basmati Rice', destination: 'UAE', status: 'Documents Uploaded' },
  { id: '3', user: 'Bhargav Silks', product: 'Silk Scarves', destination: 'USA', status: 'Pending Review' },
];

const RECENT_VERIFICATIONS = [
  { id: '1', user: 'Mahfuz Textiles', result: 'Compliant', date: '2023-10-25' },
  { id: '2', user: 'Bharat Handicrafts', result: 'Restricted', date: '2023-10-24' },
];

export default function AdminDashboardScreen({ navigation }) {
  const renderRequestItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.user}</Text>
        <Text style={styles.itemSub}>{item.product} ➔ {item.destination}</Text>
        <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.viewBtn}>
        <Text style={styles.viewBtnText}>Review</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Admin Console</Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <MaterialCommunityIcons name="logout" size={24} color="#1F4788" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsRow}>
            <View style={styles.statBox}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statBox}>
                <Text style={styles.statValue}>45</Text>
                <Text style={styles.statLabel}>Verified</Text>
            </View>
            <View style={styles.statBox}>
                <Text style={styles.statValue}>08</Text>
                <Text style={styles.statLabel}>Flagged</Text>
            </View>
        </View>

        <Text style={styles.sectionTitle}>Pending Export Requests</Text>
        {PENDING_REQUESTS.map((item) => (
            <View key={item.id} style={styles.listItem}>
                <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{item.user}</Text>
                    <Text style={styles.itemSub}>{item.product} ➔ {item.destination}</Text>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.viewBtn}>
                    <Text style={styles.viewBtnText}>Review</Text>
                </TouchableOpacity>
            </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Recent Verifications</Text>
        {RECENT_VERIFICATIONS.map((item) => (
            <View key={item.id} style={styles.listItem}>
                <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{item.user}</Text>
                    <Text style={styles.itemSub}>Date: {item.date}</Text>
                </View>
                <View style={[styles.resultBadge, { backgroundColor: item.result === 'Compliant' ? '#DCFCE7' : '#FEE2E2' }]}>
                    <Text style={[styles.resultText, { color: item.result === 'Compliant' ? '#15803D' : '#991B1B' }]}>{item.result}</Text>
                </View>
            </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F4788',
  },
  scrollContent: {
    padding: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statBox: {
    backgroundColor: '#fff',
    width: '30%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F4788',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  itemSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusText: {
    fontSize: 10,
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  viewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  viewBtnText: {
    fontSize: 12,
    color: '#1F4788',
    fontWeight: '700',
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  resultText: {
    fontSize: 12,
    fontWeight: 'bold',
  }
});
