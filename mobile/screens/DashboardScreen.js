import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Intro Section */}
        <View style={styles.introSection}>
          <Text style={styles.brandTitle}>Safarika</Text>
          <Text style={styles.brandSubtitle}>Export Intelligence & Onboarding Navigator</Text>
          <View style={styles.titleDivider} />
        </View>

        {/* Hero Banner */}
        <TouchableOpacity
          style={styles.heroCard}
          onPress={() => navigation.navigate('ProductEntry')}
          activeOpacity={0.9}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroHeading}>Begin Export Journey</Text>
            <Text style={styles.heroSubheading}>Classify your product and find the best markets globally.</Text>
          </View>
          <View style={styles.heroIconBox}>
            <MaterialCommunityIcons name="rocket-launch" size={32} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Intelligence Tools</Text>

        {/* Grid Layout */}
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('ProductEntry')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#EEF2FF' }]}>
              <MaterialCommunityIcons name="barcode-scan" size={24} color="#4F46E5" />
            </View>
            <Text style={styles.cardLabel}>HS Classifier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('MarketIntelligence', { hsCode: '610910' })}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5' }]}>
              <MaterialCommunityIcons name="chart-line" size={24} color="#10B981" />
            </View>
            <Text style={styles.cardLabel}>Market Demand</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('DestinationPicker', { hsCode: '610910' })}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#FFF7ED' }]}>
              <MaterialCommunityIcons name="file-document-outline" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.cardLabel}>Compliance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#FDF2F8' }]}>
              <MaterialCommunityIcons name="translate" size={24} color="#EC4899" />
            </View>
            <Text style={styles.cardLabel}>Translator</Text>
          </TouchableOpacity>
        </View>

        {/* Footer info */}
        <TouchableOpacity
          style={styles.logoutRow}
          onPress={() => navigation.replace('Login')}
        >
          <MaterialCommunityIcons name="logout" size={20} color="#94A3B8" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  introSection: {
    marginBottom: 32,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1F4788',
    letterSpacing: -1,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 20,
  },
  titleDivider: {
    width: 40,
    height: 4,
    backgroundColor: '#1F4788',
    marginTop: 16,
    borderRadius: 2,
  },
  heroCard: {
    backgroundColor: '#1F4788',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 4,
    shadowColor: '#1F4788',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  heroContent: {
    flex: 1,
  },
  heroHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubheading: {
    fontSize: 13,
    color: '#BFDBFE',
    lineHeight: 18,
  },
  heroIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#F8FAFC',
    width: (width - 68) / 2,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 10,
  },
  logoutText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
    marginLeft: 8,
  },
});
