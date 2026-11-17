import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MemberCard from "../components/MemberCard";
import {
  getFamilyMembers,
  getFamilyTree,
  getRareDiseases,
  searchRareDiseases,
} from "../db/database";

export default function HomeScreen({ route }) {
  const { userEmail, onSignOut } = route.params;
  const navigation = useNavigation();
  const [members, setMembers] = useState([]);
  const [familyTree, setFamilyTree] = useState([]);
  const [rareDiseases, setRareDiseases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [membersData, familyTreeData, rareDiseasesData] = await Promise.all([
      getFamilyMembers(),
      getFamilyTree(),
      getRareDiseases(),
    ]);
    setMembers(membersData);
    setFamilyTree(familyTreeData);
    setRareDiseases(rareDiseasesData);
    setSearchResults(rareDiseasesData);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults(rareDiseases);
      return;
    }
    setSearchResults(await searchRareDiseases(searchTerm));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Family Medical History</Text>
          <Text style={styles.subtitle}>Welcome back, {userEmail}</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={onSignOut}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{members.length}</Text>
            <Text style={styles.statLabel}>Family members</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{rareDiseases.length}</Text>
            <Text style={styles.statLabel}>Rare diseases</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{familyTree.length}</Text>
            <Text style={styles.statLabel}>Family links</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton} onPress={() => navigation.navigate("AddMember")}>
            <Text style={styles.actionButtonText}>Add Member</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => navigation.navigate("AddRareDisease")}>
            <Text style={styles.actionButtonText}>Add Rare Disease</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rare Disease Finder</Text>
          <Text style={styles.sectionDescription}>
            Search rare disorders by name or keywords and see related family members.
          </Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search rare disease"
            placeholderTextColor="#9ca3af"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <Pressable style={styles.primaryButton} onPress={handleSearch}>
            <Text style={styles.primaryButtonText}>Search</Text>
          </Pressable>

          {searchResults.length > 0 ? (
            searchResults.map((disease) => (
              <View key={disease.id} style={styles.card}>
                <Text style={styles.cardTitle}>{disease.name}</Text>
                <Text style={styles.cardText}>{disease.description}</Text>
                <Text style={styles.metaText}>
                  Category: {disease.category} | Linked members: {disease.memberIds.length || "None"}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No matching rare diseases found.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Tree Overview</Text>
          {familyTree.map((relation) => (
            <View key={relation.id} style={styles.card}>
              <Text style={styles.cardTitle}>{relation.memberName}</Text>
              <Text style={styles.cardText}>
                {relation.relation} of {relation.relativeName}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Members</Text>
          {members.map((member) => (
            <MemberCard key={member.id} member={member} onDelete={loadData} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#1e40af",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: "#c7d2fe",
    marginTop: 4,
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  logoutText: {
    color: "#1e40af",
    fontWeight: "700",
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#10b981",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  statLabel: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 6,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#0f172a",
  },
  sectionDescription: {
    color: "#475569",
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  searchInput: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: "#0f172a",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#1e40af",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    color: "#0f172a",
  },
  cardText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  metaText: {
    marginTop: 10,
    color: "#64748b",
    fontSize: 13,
  },
  emptyText: {
    color: "#475569",
    fontSize: 14,
    fontStyle: "italic",
  },
});
