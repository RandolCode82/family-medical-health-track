/**
 * Handles application errors.
 */

export const handleError = (error) => {
	console.error(error);
	
	return(
		error.message ||
		"An unexpected error occured."
	);
};