/**
 * Validates family member information
 */
export const validateMember = (name, relationship) => {
	
	if (!name.trim()) {
		return "Name is required.";
	}
	
	if (!relationship.trim()) {
		return "Relationship is required.";
	}
	
	return null;
};