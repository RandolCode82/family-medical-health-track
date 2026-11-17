import { addFamilyMember } from "../db/database";

/**
 * Family Member Service
 * 
 * Handles business logic for creating and saving family member records.
 */

/**
 * Formats member data and saves it to the database.
 * 
 * @param {Object} memberData - Member information from the form.
 * @param {string} relatedMemberId - selected related member.
 * @param {string} relation - Relationship to selected member.
 * @returns {Promise}
 */
export const saveFamilyMember = async (
	memberData,
	relatedMemberId,
	relation
) => {
	//Build the member object from form data.
	const member = {
		// Generate a unique identifier for the member.
		id: Date.now().toString(),
		
		// Remove extra whitespace from text fields.
		name: memberData.name.trim(),
		relationship: memberData.relationship.trim(),
		
		// Store only valid conditions.
		conditions: memberData.conditions.filter(
			(condition) => condition.name
		),
		
		// Convert comma-separated medications into an array.
		medications: memberData.medications
		.split(",")
		.map((medication) => medication.trim())
		.filter((medication) => medication),
		
		// Store notes entered by user.
		notes: memberData.notes.trim(),
		
		// Convert comma-seperated rare disease into an array.
		rareDiseases: memberData.rareDiseases
		.split(",")
		.map((disease) => disease.trim())
		.filter((disease) => disease),
	};
	
	// Save the member record and relationship information.
	return await addFamilyMember(
		member,
		relatedMemberId || null,
		relation || null
	);
};