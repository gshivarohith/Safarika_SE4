import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, SafeAreaView, StatusBar, Switch
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api';
const Stack = createStackNavigator();

// --- Reusable Components ---
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
  const [status, setStatus] = useState('Checking...');
  useEffect(() => {
    axios.get(`${API_URL}/health`).then(() => setStatus('Connected')).catch(() => setStatus('Offline'));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Safarika Pro</Text>
          <Text style={[styles.subtitle, { color: status === 'Connected' ? '#10B981' : '#EF4444' }]}>
            Server Link: {status}
          </Text>
        </View>

        <View style={styles.grid}>
          <Card title="Onboarding Navigator" description="Export readiness guide" icon="🚀" onPress={() => navigation.navigate('Onboarding')} />
          <Card title="AI HS Classifier" description="Identify your product code" icon="🔍" onPress={() => navigation.navigate('Classifier')} />
          <Card title="Market Intelligence" description="Global demand trends" icon="📈" onPress={() => navigation.navigate('Intelligence')} />
          <Card title="Compliance Advisor" description="Check Silk (50), Fruits (08), etc." icon="📜" onPress={() => navigation.navigate('Compliance')} />
          <Card title="Business Translator" description="Translate for buyers" icon="🌐" onPress={() => navigation.navigate('Translator')} />
        </View>
        <Text style={styles.versionFooter}>Stable Sync v0.9.0 — Linked to DB</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ComplianceScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState(null);

  const checkRules = async () => {
    if (!code) return;
    setLoading(true);
    setRules(null);
    try {
      const res = await axios.post(`${API_URL}/compliance-check`, { hsCode: code });
      setRules(res.data);
    } catch (err) {
      alert("Connection Failed. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screenBody}>
      <Text style={styles.label}>Enter HS Code or Chapter (e.g. 50):</Text>
      <TextInput style={styles.input} value={code} onChangeText={setCode} keyboardType="numeric" placeholder="e.g. 50" />
      <TouchableOpacity style={styles.button} onPress={checkRules}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Get Rules from DB</Text>}
      </TouchableOpacity>

      {rules && (
        <View style={styles.resultBox}>
          {rules.found ? (
            <>
              <Text style={styles.resultLabel}>Product Category:</Text>
              <Text style={styles.resultDetail}>{rules.chapterDescription}</Text>

              <Text style={[styles.resultLabel, {marginTop: 15}]}>Mandatory Documents:</Text>
              {rules.documentsRequired?.map((doc, i) => (
                <Text key={i} style={styles.bullet}>• {doc}</Text>
              ))}
            </>
          ) : (
            <View style={styles.notFoundBox}>
              <Text style={styles.notFoundText}>Chapter {rules.hsChapter}: No specific records.</Text>
              <Text style={styles.subText}>Showing general export requirements only.</Text>
            </View>
          )}

          {rules.explanation && (
            <View style={styles.aiBox}>
              <Text style={styles.aiTitle}>ADVISOR INSIGHT:</Text>
              <Text style={styles.explanationText}>{rules.explanation}</Text>
            </View>
          )}
        </View>
      )}
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
      const res = await axios.post(`${API_URL}/classify`, { productDescription: desc });
      setResult(res.data);
    } catch (e) { alert("AI fail"); }
    finally { setLoading(false); }
  };
  return (
    <View style={styles.screenBody}>
      <TextInput style={styles.input} placeholder="Describe product" value={desc} onChangeText={setDesc} />
      <TouchableOpacity style={styles.button} onPress={handleClassify}><Text style={styles.buttonText}>Find Code</Text></TouchableOpacity>
      {result && <View style={styles.resultBox}><Text style={styles.resultDetail}>{result.hsCode}</Text><Text>{result.description}</Text></View>}
    </View>
  );
}

function IntelligenceScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const fetchTrends = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/market-demand`, { hsCode: code });
      setData(res.data);
    } catch (e) { alert("Data error"); }
    finally { setLoading(false); }
  };
  return (
    <ScrollView style={styles.screenBody}>
      <TextInput style={styles.input} placeholder="HS Code" value={code} onChangeText={setCode} />
      <TouchableOpacity style={styles.button} onPress={fetchTrends}><Text style={styles.buttonText}>Fetch Trends</Text></TouchableOpacity>
      {data && <View style={styles.resultBox}>{data.data?.map((item, i) => <Text key={i}>{item.reporterName}: ${item.tradeValue}</Text>)}</View>}
    </ScrollView>
  );
}

function TranslatorScreen() {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('hi');
  const [translated, setTranslated] = useState('');
  const handleTrans = async () => {
    const res = await axios.post(`${API_URL}/translate`, { text, targetLanguage: lang });
    setTranslated(res.data.translatedText);
  };
  return (
    <View style={styles.screenBody}>
      <TextInput style={styles.input} value={text} onChangeText={setText} />
      <TouchableOpacity style={styles.button} onPress={handleTrans}><Text style={styles.buttonText}>Translate</Text></TouchableOpacity>
      {translated && <View style={styles.resultBox}><Text>{translated}</Text></View>}
    </View>
  );
}

function OnboardingScreen() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Register Udyam', done: false },
    { id: 2, text: 'Obtain IEC', done: false }
  ]);
  const toggle = (id) => setTasks(tasks.map(t => t.id === id ? {...t, done: !t.done} : t));
  return (
    <View style={styles.screenBody}>
      {tasks.map(t => (
        <View key={t.id} style={styles.taskRow}>
          <Text style={t.done && styles.taskDone}>{t.text}</Text>
          <Switch value={t.done} onValueChange={() => toggle(t.id)} />
        </View>
      ))}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1F4788' }, headerTintColor: '#fff' }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Compliance" component={ComplianceScreen} options={{ title: 'Advisor' }} />
        <Stack.Screen name="Classifier" component={ClassifierScreen} />
        <Stack.Screen name="Intelligence" component={IntelligenceScreen} />
        <Stack.Screen name="Translator" component={TranslatorScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContainer: { padding: 20 },
  header: { marginBottom: 30, marginTop: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1F4788' },
  subtitle: { fontSize: 14, fontWeight: 'bold' },
  grid: { gap: 15 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, flexDirection: 'row', alignItems: 'center', elevation: 3 },
  cardIcon: { fontSize: 30, marginRight: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardDesc: { color: '#666', fontSize: 12 },
  screenBody: { flex: 1, padding: 20 },
  label: { fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 20 },
  button: { backgroundColor: '#1F4788', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  resultBox: { marginTop: 20, padding: 20, backgroundColor: '#fff', borderRadius: 12, elevation: 2, borderLeftWidth: 5, borderLeftColor: '#10B981' },
  resultLabel: { fontSize: 10, fontWeight: 'bold', color: '#1F4788', textTransform: 'uppercase' },
  resultDetail: { fontSize: 20, fontWeight: 'bold', color: '#2D3748' },
  bullet: { fontSize: 16, marginVertical: 4, color: '#2D3748' },
  aiBox: { marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  aiTitle: { fontSize: 10, fontWeight: 'bold', color: '#10B981' },
  explanationText: { color: '#4A5568', fontStyle: 'italic', lineHeight: 20 },
  notFoundBox: { padding: 10, backgroundColor: '#FFF5F5', borderRadius: 8 },
  notFoundText: { color: '#C53030', fontWeight: 'bold' },
  subText: { fontSize: 12, color: '#718096' },
  taskRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
  taskDone: { textDecorationLine: 'line-through', color: '#999' },
  versionFooter: { textAlign: 'center', marginTop: 40, color: '#94A3B8', fontSize: 12 }
});
