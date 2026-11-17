import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { addRareDisease } from "../db/database";

export default function AddRareDiseaseScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [memberIds, setMemberIds] = useState("");

  const categoryOptions = [
    "Genetic Disorders",
    "Metabolic Disorders",
    "Enzyme Deficiency",
    "Neurological Disorders",
    "Cardiovascular Disorders",
    "Immunodeficiency",
    "Hematological Disorders",
    "Endocrine Disorders",
    "Other",
  ];

  const handleSave = async () => {
    if (!name.trim() || !description.trim() || !category.trim()) {
      Alert.alert("Error", "Name, description, and category are required.");
      return;
    }

    const disease = {
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      isRare: true,
      memberIds: memberIds.split(",").map(id => id.trim()).filter(id => id),
    };

    try {
      await addRareDisease(disease);
      Alert.alert("Success", "Rare disease added successfully.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to add rare disease.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Add Rare Disease</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Disease Name"
          placeholderTextColor="#9ca3af"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          placeholderTextColor="#9ca3af"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Category</Text>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select category" value="" />
            {categoryOptions.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Linked Member IDs (comma-separated)"
          placeholderTextColor="#9ca3af"
          value={memberIds}
          onChangeText={setMemberIds}
        />

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Disease</Text>
        </Pressable>
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
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    padding: 20,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: "#0f172a",
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    color: "#0f172a",
    marginBottom: 8,
  },
  picker: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    color: "#0f172a",
  },
  saveButton: {
    backgroundColor: "#1e40af",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});