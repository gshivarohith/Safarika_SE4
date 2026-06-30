import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, SafeAreaView, StatusBar,
  Switch
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api';
const Stack = createStackNavigator();

// --- Components ---
const Card = ({ title, description, onPress, icon }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.cardIcon}>{icon}</Text>
    <View style={{ flex: 1 }}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{description}</Text>
    </View>
  </TouchableOpacity>
);

// --- Screens ---

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Safarika</Text>
          <Text style={styles.subtitle}>Export Intelligence & Onboarding</Text>
        </View>

        <View style={styles.grid}>
          <Card
            title="Onboarding Navigator"
            description="Step-by-step export readiness guide"
            icon="🚀"
            onPress={() => navigation.navigate('Onboarding')}
          />
          <Card
            title="HS Code Classifier"
            description="AI-powered product categorization"
            icon="🔍"
            onPress={() => navigation.navigate('Classifier')}
          />
          <Card
            title="Market Intelligence"
            description="Analyze global demand & trends"
            icon="📈"
            onPress={() => navigation.navigate('Intelligence')}
          />
          <Card
            title="Compliance Check"
            description="Import rules & document requirements"
            icon="📜"
            onPress={() => navigation.navigate('Compliance')}
          />
          <Card
            title="Business Translator"
            description="Translate product info for global buyers"
            icon="🌐"
            onPress={() => navigation.navigate('Translator')}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>MSME Empowerment Portal v0.3.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TranslatorScreen() {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('hi');
  const [loading, setLoading] = useState(false);
  const [translated, setTranslated] = useState('');

  const handleTranslate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/translate`, { text, targetLanguage: lang });
      setTranslated(response.data.translatedText);
    } catch (err) { alert('Translation failed.'); }
    finally { setLoading(false); }
  };

  return (
    <View style={styles.screenBody}>
      <Text style={styles.label}>Text to translate:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product description or message..."
        value={text} onChangeText={setText} multiline
      />
      <Text style={styles.label}>Target Language Code (hi, fr, es, de):</Text>
      <TextInput style={styles.input} value={lang} onChangeText={setLang} />

      <TouchableOpacity style={styles.button} onPress={handleTranslate}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Translate Now</Text>}
      </TouchableOpacity>

      {translated ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Translated Text:</Text>
          <Text style={styles.resultDetail}>{translated}</Text>
        </View>
      ) : null}
    </View>
  );
}

function OnboardingScreen() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Register Business (Udyam)', done: false },
    { id: 2, text: 'Obtain PAN Card', done: false },
    { id: 3, text: 'Open Current Bank Account', done: false },
    { id: 4, text: 'Apply for Import Export Code (IEC)', done: false },
    { id: 5, text: 'Register with Export Promotion Council', done: false },
    { id: 6, text: 'Understand GST for Exports (LUT)', done: false }
  ]);

  useEffect(() => { loadProgress(); }, []);

  const loadProgress = async () => {
    const saved = await AsyncStorage.getItem('onboarding_progress');
    if (saved) setTasks(JSON.parse(saved));
  };

  const toggleTask = async (id) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTasks(newTasks);
    await AsyncStorage.setItem('onboarding_progress', JSON.stringify(newTasks));
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <ScrollView style={styles.screenBody}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Readiness Progress: {progressPercent}%</Text>
        <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${progressPercent}%` }]} /></View>
      </View>
      {tasks.map(task => (
        <View key={task.id} style={styles.taskRow}>
          <Text style={[styles.taskText, task.done && styles.taskDone]}>{task.text}</Text>
          <Switch value={task.done} onValueChange={() => toggleTask(task.id)} trackColor={{ false: "#CBD5E1", true: "#1F4788" }} />
        </View>
      ))}
    </ScrollView>
  );
}

function ClassifierScreen() {
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleClassify = async () => {
    if (!desc) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/classify`, { productDescription: desc });
      setResult(response.data);
    } catch (err) { alert('Classification failed.'); }
    finally { setLoading(false); }
  };

  return (
    <View style={styles.screenBody}>
      <Text style={styles.label}>Product Description:</Text>
      <TextInput style={styles.input} placeholder="e.g. Silk scarves" value={desc} onChangeText={setDesc} multiline />
      <TouchableOpacity style={styles.button} onPress={handleClassify} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Get HS Code</Text>}
      </TouchableOpacity>
      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>HS Code Found:</Text>
          <Text style={styles.resultCode}>{result.hsCode}</Text>
          <Text style={styles.resultDetail}>{result.description}</Text>
        </View>
      )}
    </View>
  );
}

function IntelligenceScreen() {
  const [code, setCode] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDemand = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/market-demand`, { hsCode: code });
      setData(response.data);
    } catch (err) { alert('Error fetching demand.'); }
    finally { setLoading(false); }
  };

  return (
    <ScrollView style={styles.screenBody}>
      <Text style={styles.label}>HS Code (6 digits):</Text>
      <TextInput style={styles.input} value={code} onChangeText={setCode} keyboardType="numeric" />
      <TouchableOpacity style={styles.button} onPress={fetchDemand}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Check Demand</Text>}
      </TouchableOpacity>
      {data && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Global Importers:</Text>
          {data.data?.map((item, i) => (
            <View key={i} style={styles.dataRow}>
              <Text style={styles.rowText}>{item.reporterName}</Text>
              <Text style={styles.rowValue}>${(item.tradeValue / 1000000).toFixed(1)}M</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function ComplianceScreen() {
  const [code, setCode] = useState('');
  const [country, setCountry] = useState('');
  const [rules, setRules] = useState(null);

  const check = async () => {
    try {
      const response = await axios.post(`${API_URL}/compliance-check`, { hsCode: code, destinationCountry: country });
      setRules(response.data);
    } catch (err) { alert('Check failed.'); }
  };

  return (
    <ScrollView style={styles.screenBody}>
      <TextInput style={styles.input} placeholder="HS Code" value={code} onChangeText={setCode} />
      <TextInput style={styles.input} placeholder="Country (USA, UK, etc.)" value={country} onChangeText={setCountry} />
      <TouchableOpacity style={styles.button} onPress={check}><Text style={styles.buttonText}>Verify Compliance</Text></TouchableOpacity>
      {rules && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Documents Required:</Text>
          {rules.documents?.map((d, i) => <Text key={i} style={styles.bullet}>• {d}</Text>)}
        </View>
      )}
    </ScrollView>
  );
}

// --- App Entry ---

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1F4788' }, headerTintColor: '#fff' }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ title: 'Export Navigator' }} />
        <Stack.Screen name="Classifier" component={ClassifierScreen} options={{ title: 'AI Classifier' }} />
        <Stack.Screen name="Intelligence" component={IntelligenceScreen} options={{ title: 'Market Data' }} />
        <Stack.Screen name="Compliance" component={ComplianceScreen} options={{ title: 'Compliance Check' }} />
        <Stack.Screen name="Translator" component={TranslatorScreen} options={{ title: 'Business Translator' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContainer: { padding: 20 },
  header: { marginBottom: 30, marginTop: 20 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#1F4788' },
  subtitle: { fontSize: 16, color: '#64748B', marginTop: 5 },
  grid: { gap: 15 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center', elevation: 3 },
  cardIcon: { fontSize: 32, marginRight: 20 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  cardDesc: { fontSize: 14, color: '#64748B', marginTop: 4 },
  screenBody: { flex: 1, padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, marginBottom: 20 },
  button: { backgroundColor: '#1F4788', padding: 16, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  resultBox: { marginTop: 20, padding: 20, backgroundColor: '#EFF6FF', borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE' },
  resultLabel: { fontSize: 12, color: '#1F4788', fontWeight: 'bold', textTransform: 'uppercase' },
  resultCode: { fontSize: 32, fontWeight: 'bold', color: '#1E3A8A' },
  resultDetail: { fontSize: 16, color: '#1E40AF' },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#DBEAFE' },
  rowText: { color: '#1E40AF' },
  rowValue: { fontWeight: 'bold', color: '#1F4788' },
  bullet: { color: '#1E40AF', marginVertical: 2 },
  progressContainer: { marginBottom: 30, backgroundColor: '#fff', padding: 20, borderRadius: 12 },
  progressText: { fontWeight: 'bold', color: '#1F4788', marginBottom: 10 },
  progressBar: { height: 10, backgroundColor: '#E2E8F0', borderRadius: 5 },
  progressFill: { height: 10, backgroundColor: '#10B981', borderRadius: 5 },
  taskRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  taskText: { fontSize: 16, color: '#334155', flex: 1 },
  taskDone: { textDecorationLine: 'line-through', color: '#94A3B8' },
  footer: { marginTop: 40, alignItems: 'center' },
  versionText: { fontSize: 10, color: '#94A3B8' }
});
