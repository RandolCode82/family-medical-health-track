import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [familyMembers, setFamilyMembers] = React.useState([]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Family Medical Health Track</Text>
        <Text style={styles.subtitle}>Secure Family Health Management</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to your family health tracker</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>+ Add Family Member</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>View Records</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', },
  header: { backgroundColor: '#007AFF', paddingTop: 50, paddingBottom: 30, paddingHorizontal: 20, },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8, },
  subtitle: { fontSize: 14, color: '#E8F0FE', },
  content: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', },
  welcomeText: { fontSize: 18, color: '#333', marginBottom: 30, textAlign: 'center', },
  button: { backgroundColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10, marginBottom: 15, width: '80%', alignItems: 'center', },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', },
  secondaryButton: { borderWidth: 2, borderColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10, width: '80%', alignItems: 'center', },
  secondaryButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600', },
});