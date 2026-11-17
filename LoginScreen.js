import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { getStoredCredentials, signIn, signUp } from "../utils/auth";

export default function LoginScreen({ route }) {
  const { onSignIn } = route.params;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hasAccount, setHasAccount] = useState(true);

  useEffect(() => {
    getStoredCredentials().then((stored) => setHasAccount(!!stored));
  }, []);

  const handleLogin = async () => {
    setError("");

    const result = await signIn(email, password);
    if (result.success) {
      onSignIn({ email: email.toLowerCase().trim() });
    } else {
      setError(result.error);
    }
  };

  const handleRegister = async () => {
    setError("");

    const result = await signUp(email, password);
    if (result.success) {
      onSignIn({ email: email.toLowerCase().trim() });
    } else {
      setError(result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Text style={styles.title}>Family Medical History</Text>
        <Text style={styles.subtitle}>Secure sign in to access your family tree and rare disease records.</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.button} onPress={hasAccount ? handleLogin : handleRegister}>
            <Text style={styles.buttonText}>{hasAccount ? "Sign In" : "Create Account"}</Text>
          </Pressable>

          <Pressable
            style={styles.switchButton}
            onPress={() => {
              setHasAccount(!hasAccount);
              setError("");
            }}
          >
            <Text style={styles.switchText}>
              {hasAccount ? "Need an account? Register" : "Already have an account? Sign in"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2ff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1d4ed8",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#334155",
    marginBottom: 32,
    fontSize: 16,
    lineHeight: 22,
  },
  form: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    color: "#111827",
    backgroundColor: "#f8fafc",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  switchButton: {
    alignItems: "center",
  },
  switchText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "600",
  },
  error: {
    color: "#b91c1c",
    marginBottom: 12,
    textAlign: "center",
  },
});
