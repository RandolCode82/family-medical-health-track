import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AddMemberScreen from "./src/screens/AddMemberScreen";
import AddRareDiseaseScreen from "./src/screens/AddRareDiseaseScreen";
import { initDatabase } from "./src/db/database";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    initDatabase()
      .then(() => setIsReady(true))
      .catch((error) => {
        console.error("Database initialization failed", error);
        setLoadError("Unable to initialize local database.");
        setIsReady(true);
      });
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2b6cb0" />
        <Text style={styles.loadingText}>Preparing secure family history storage...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{loadError}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} initialParams={{ userEmail: user.email, onSignOut: () => setUser(null) }} />
            <Stack.Screen name="AddMember" component={AddMemberScreen} />
            <Stack.Screen name="AddRareDisease" component={AddRareDiseaseScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} initialParams={{ onSignIn: (account) => setUser(account) }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f9fc",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#2b6cb0",
    textAlign: "center",
  },
});
