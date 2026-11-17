import React, { useState, useEffect } from "react";
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
import { getFamilyMembers } from "../db/database";
import { saveFamilyMember } from "../services/memberService";
import { validateMember } from "../utils/validators";
import { handleError } from "../utils/errorHandler";


export default function AddMemberScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [medications, setMedications] = useState("");
  const [notes, setNotes] = useState("");
  const [rareDiseases, setRareDiseases] = useState("");
  const [relatedMemberId, setRelatedMemberId] = useState("");
  const [relation, setRelation] = useState("");
  const [members, setMembers] = useState([]);
  const [conditionsList, setConditionsList] = useState([{ name: "", category: "" }]);
  const [currentConditionName, setCurrentConditionName] = useState("");
  const [currentConditionCategory, setCurrentConditionCategory] = useState("");

  const relationOptions = [
    "Father", "Mother", "Son", "Daughter", "Brother", "Sister",
    "Grandfather", "Grandmother", "Grandson", "Granddaughter",
    "Uncle", "Aunt", "Nephew", "Niece", "Cousin", "Spouse"
  ];

  const conditionCategoryOptions = [
    "Cardiovascular", "Respiratory", "Endocrine", "Musculoskeletal",
    "Neurological", "Gastrointestinal", "Renal", "Hematological",
    "Infectious", "Other"
  ];

  useEffect(() => {
    loadMembers();
  }, []);

  /**
   * Loads existing family members from the database and populates the relationship selection list
   */
  const loadMembers = async () => {
    const data = await getFamilyMembers();
    setMembers(data);
  };
  
  /**
   * Adds a medical condition to the temporary conditions list before saving the member.
   */
  const addCondition = () => {
    if (currentConditionName.trim() && currentConditionCategory) {
      setConditionsList([...conditionsList, { name: currentConditionName.trim(), category: currentConditionCategory }]);
      setCurrentConditionName("");
      setCurrentConditionCategory("");
    }
  };
  
  
/**
 * Removes a condition from the member's condition list.
 */
  const removeCondition = (index) => {
    setConditionsList(conditionsList.filter((_, i) => i !== index));
  };

  /**
   * Validates form input and saves a new family member.
   */
  const handleSave = async () => {
	// Validate form input using centralized validation.
	const validationError = validateMember(
		name,
		relationship
	);
	
	if (validationError) {
		Alert.alert("Error", validationError);
		return;
	}

    try {
		
	//Pass member data to the service layer for processing
      await saveFamilyMember(
		{
		name,
		relationship,
		conditions: conditionsList,
		medications,
		notes,
		rareDiseases,
	  },
	  relatedMemberId,
	  relation
	);
	
	  //Display confirmation and return to the previous screen.
      Alert.alert(
		"Success", 
		"Family member added successfully.", 
		[
          { 
			text: "OK", 
			onPress: () => navigation.goBack() 
		  },
      	]
	  );
    } catch (error) {
		// Process errors through the centralized error handler.
		Alert.alert(
			"Error",
			handleError(error)
		);
	}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Add Family Member</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#9ca3af"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Relationship (e.g., Father, Mother, Self)"
          placeholderTextColor="#9ca3af"
          value={relationship}
          onChangeText={setRelationship}
        />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions</Text>
          {conditionsList.map((cond, index) => (
            <View key={index} style={styles.conditionItem}>
              <Text style={styles.conditionText}>{cond.name} ({cond.category})</Text>
              <Pressable style={styles.removeButton} onPress={() => removeCondition(index)}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            </View>
          ))}
          <TextInput
            style={styles.input}
            placeholder="Condition name"
            placeholderTextColor="#9ca3af"
            value={currentConditionName}
            onChangeText={setCurrentConditionName}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={currentConditionCategory}
              onValueChange={(itemValue) => setCurrentConditionCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select category" value="" />
              {conditionCategoryOptions.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
          <Pressable style={styles.addButton} onPress={addCondition}>
            <Text style={styles.addButtonText}>Add Condition</Text>
          </Pressable>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Medications (comma-separated)"
          placeholderTextColor="#9ca3af"
          value={medications}
          onChangeText={setMedications}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Notes"
          placeholderTextColor="#9ca3af"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Related Member (optional)</Text>
          <Picker
            selectedValue={relatedMemberId}
            onValueChange={(itemValue) => setRelatedMemberId(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select related member" value="" />
            {members.map((member) => (
              <Picker.Item key={member.id} label={`${member.name} (${member.relationship})`} value={member.id} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Relation to related member</Text>
          <Picker
            selectedValue={relation}
            onValueChange={(itemValue) => setRelation(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select relation" value="" />
            {relationOptions.map((rel) => (
              <Picker.Item key={rel} label={rel} value={rel} />
            ))}
          </Picker>
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Member</Text>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#0f172a",
  },
  conditionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  conditionText: {
    fontSize: 16,
    color: "#0f172a",
  },
  removeButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  removeText: {
    color: "#ffffff",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#10b981",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
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