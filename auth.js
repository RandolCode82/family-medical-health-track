import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

const CREDENTIALS_KEY = "familyMedicalHealthCredentials";

async function hashPassword(password) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

export async function getStoredCredentials() {
  const item = await SecureStore.getItemAsync(CREDENTIALS_KEY);
  return item ? JSON.parse(item) : null;
}

export async function signUp(email, password) {
  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const existing = await getStoredCredentials();

  if (existing) {
    return { success: false, error: "An account already exists. Please sign in." };
  }

  const passwordHash = await hashPassword(password);
  await SecureStore.setItemAsync(
    CREDENTIALS_KEY,
    JSON.stringify({ email: email.toLowerCase().trim(), passwordHash })
  );

  return { success: true };
}

export async function signIn(email, password) {
  const stored = await getStoredCredentials();

  if (!stored) {
    return { success: false, error: "No account found. Create one to continue." };
  }

  const passwordHash = await hashPassword(password);
  if (stored.email !== email.toLowerCase().trim() || stored.passwordHash !== passwordHash) {
    return { success: false, error: "Invalid email or password." };
  }

  return { success: true };
}
