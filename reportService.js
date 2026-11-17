/**
 * Clinical Summary Report Service
 * 
 * Responsible for generating formatted clinical summary reports for family medical history records.
 */

/**
 * Generates a clinical summary report for a family member.
 * 
 * @param {object} member Family member record.
 * @returns {string} Formatted clinical report.
 */

export const generateClinicalSummary = (member) => {
	
	// Format the member's medical conditions.
	const conditions = member.conditions?.length
	  ? member.conditions
		.map(
			(condition) =>
				`${condition.name} (${condition.category})`
		)
		.join("\n")
	: "None Recorded";
		
	// Format the member's medications.
	const medications = member.medications?.length
		? member.medications.join(", ")
		: "None Recorded";
		
	// Format the member's rare diseases.
	const rareDiseases = member.rareDiseases?.length
		? member.rareDiseases.join(", ")
		: "None Recorded";
		
		
	// Format member notes.
	const notes = member.notes?.trim()
	  ? member.notes
	  : "No Notes Recorded";
	  
		// Generate the clinical summary report.
		return
================================================

		CLINICAL SUMMARY REPORT
		
================================================

Patient Information

------------------------------------------------

Name: ${mamber.name}
Relationship: ${member.relationship}

Medical Conditions

------------------------------------------------

${conditions}

Medications
------------------------------------------------
${medications}

Rare Diseases
------------------------------------------------
${rareDiseases}

Clinical Notes
------------------------------------------------
${notes}

================================================
End of Report
================================================
`;
};`	
		
}