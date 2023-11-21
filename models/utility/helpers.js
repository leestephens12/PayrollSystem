//todo: get rid of this and create a sensible class?

/**
 * Checks if a value is null or undefined.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is null or undefined, otherwise returns false.
 */
function isNullOrUndefined(value){
	// same as value === null || value === undefined
	// refer to https://stackoverflow.com/questions/2559318/how-to-check-for-an-undefined-or-null-variable-in-javascript
	return value == null;
}

module.exports ={
	isNullOrUndefined
};