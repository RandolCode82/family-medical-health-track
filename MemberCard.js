import React from "react";
import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { deleteFamilyMember } from "../db/database";
import { generateClinicalSummary } from "../services/reportService";

export default function MemberCard({ member, onDelete }) {
	
	/**
	 * Displays a confirmation dialog and deletes the selected family member.
	 */
  const handleDelete = () => {
    Alert.alert(
      "Delete Member",
      `Are you sure you want to delete ${member.name}?`,
      [
        { 
			text: "Cancel", 
			style: "cancel" 
		},
        {
          text: "Delete",
          style: "destructive",
		  
          onPress: async () => {
            try {
				
				// Remove the selected member from the database.
              await deleteFamilyMember(member.id);
			  
			  // Refresh the member list after deletion.
              onDelete && onDelete();
			  
            } catch (error) {
  				// Display an error if deletion fails. 
				Alert.alert(
					"Error", 
					"Failed to delete member."
				);
            }
          },
        },
      ]
    );
  };

  /**
   * Generates a formatted clinical summary report for the selected family member.
   */
  const handleGenerateReport = () => {
	// Generate the report using the report service.
	const report = generateClinicalSummary(member);
	
	// Display the generated report.
	Alert.alert(
		"Clinical Summary Report",
		report
	);
  };
  
  return (
    <View style={styles.card}>
	
	{/* Member header information */}
      <View style={styles.header}>
        <Text style={styles.name}>
		 {member.name}
		 </Text>
		 
        <Pressable 
			style={styles.deleteButton} 
			onPress={handleDelete}
		>
          <Text style={styles.deleteText}>
		  	🗑️
		  	</Text>
        </Pressable>
      </View>
	  
	  {/* Relationship information */}
      <Text style={styles.relationship}>
	  	{member.relationship}
		{" "}
		(Gen: {member.generation})
		</Text>
		
		{/* Medical conditions section */}
      <Text style={styles.sectionTitle}>
	  	Conditions
	  </Text>
	  
      <Text style={styles.text}>
        {member.conditions
			.map(
				c => `${c.name} (${c.category})`
			)
			.join(", ")}
      </Text>
	  
	  {/* Medication information */}
      <Text style={styles.sectionTitle}>
	  	Medications
	  </Text>
	  
      <Text style={styles.text}>
	  	{member.medications.join(", ") || "None"}
	  </Text>
	  
	  {/* Clinical notes section */}
      <Text style={styles.sectionTitle}>
	    Notes
	  </Text>
	  
      <Text style={styles.text}>
	  	{member.notes}
	  </Text>
	  
	  {/* Clinical summary report button */}
	  <Pressable
	  	style={styles.reportButton}
		onPress={jandleGenerateReport}
	  >
	  	<Text style={styles.reportButtonText}>
			Generate Report
		</Text>
		
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  
  name: {
    fontSize: 20,
    fontWeight: "700",
  },
  
  deleteButton: {
    padding: 8,
  },
  
  deleteText: {
    fontSize: 16,
  },
  
  relationship: {
    fontSize: 14,
    color: "#4a5568",
    marginBottom: 12,
  },
  
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
    color: "#2d3748",
  },
  
  text: {
    fontSize: 15,
    color: "#4a5568",
    lineHeight: 22,
  },
  
  reportButton: {
	backgroundColor: "#2563eb",
	borderRadius: 8,
	paddingVertical: 10,
	marginTop: 12,
	alignItens: "center",
  },
  
  reportButtonText: {
	color: "#ffffff",
	fontsize: 16,
	fontWeight: "600",
  };
});
