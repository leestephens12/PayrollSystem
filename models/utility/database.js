const {initializeApp, applicationDefault, cert} = require("firebase-admin/app");
const {getFirestore,CollectionReference, Timestamp, FieldValue, Filter,FieldPath, FirestoreDataConverter,QueryDocumentSnapshot,DocumentData, arrayUnion, DocumentReference, WriteResult} = require("firebase-admin/firestore");
const serviceAccount = require("../../firestore/service-account.json");

const Shift = require("../Shift");
const Employee = require("../Employee");
const Workplace = require("../Workplace");

//todo: delete crud
class Database {
	static #app = initializeApp({
		credential: cert(serviceAccount)
	});
	static #db = getFirestore(this.#app);

	//#region  Employee
	/**
	 *
	 * @param {string} id the id of the employee
	 * @returns {Promise<DocumentReference<Employee>>}
	 */
	static async getEmployee(id) {
		return this.getDoc("employees", id);
	}

	/**
	 *
	 * @returns {Promise<FirebaseFirestore.QuerySnapshot<Employee>>}
	 *
	 * @example
	 * const employees = await Database.getEmployees();
	 * // => QuerySnapshot
	 * @example
	 * const employees = Database.getEmployees().then(querySnapshot => {
	 *   querySnapshot.forEach(doc => {
	 *     console.log(doc.data());
	 *   });
	 * });
	 */
	static async getEmployees() {
		return this.getDocs("employees");
	}

	/**
	 *
	 * @param {Employee} employee employee object to be updated
	 * @returns {Promise<WriteResult>} the result of the update
	 */
	static async updateEmployee(employee) {
		return this.updateDoc("employees", employee.employeeID, employee);
	}

	/**
	 *
	 * @param {Employee} employee employee object to be added
	 * @returns {Promise<DocumentReference<Employee>>} the newly added document
	 */
	static async addEmployee(employee) {
		return this.addDoc("employees", employee);
	}
	//#endregion

	/**
	 * get a document from firestore
	 * @param {CollectionName} collection name of collection to get document from
	 * @param {string} id id (name) of document to get
	 * @returns {Promise<DocumentReference<DocumentData>>} the document reference
	 */
	static async getDoc(collection, id) {
		const db = this.getCollection(collection);
		const converter = this.#getFirestoreConverter(collection);
		return db.withConverter(converter).doc(id);
	}

	/**
	 *
	 * @param {CollectionName} collection name of collection
	 * @param {string} id id (name) of document to update
	 * @param {Promise<WriteResult>} data
	 */
	static async updateDoc(collection, id, data) {
		const db = this.getCollection(collection);
		const converter = this.#getFirestoreConverter(collection);
		return db.withConverter(converter).doc(id).update(data);
	}

	static async updateEmployeeShift(collection, employee) {
		const db = this.getCollection(collection);
		const converter = this.#getFirestoreConverter(collection);
		var shiftList = employee.shiftToArray();
	//	shiftList.push("Pizza")
		var data = {   shifts: shiftList }
		return db.withConverter(converter).doc(employee.uid).update(data);
	}

	static async addEmployeeShift(collection, employee) {
		const db = this.getCollection(collection);
		const converter = this.#getFirestoreConverter(collection);
		var shiftList = employee.shiftToArray();
		shiftList.push("Pizza")
		var data = {   shifts: shiftList }
		return db.withConverter(converter).doc(employee.employeeID).update(data);
	}
	/**
	 *
	 * @param {CollectionName} collection the collection name
	 * @param {*} data data to upload
	 * @returns {Promise<DocumentReference<DocumentData>>} the document reference of the uploaded data in firestore
	 *
	 * @example
	 * const data = { firstName: "John", lastName: "Doe" };
	 * await Database.addDoc("example", data);
	 * // => { firstName: "John", lastName: "Doe" }
	 */
	static async addDoc(collection, data) {
		const db = this.getCollection(collection);
		const converter = this.#getFirestoreConverter(collection);
		return db.withConverter(converter).add(data);
	}

	/**
	 * get the collection from firestore to perform CRUD operations on
	 * @param {CollectionName} collection
	 * @returns {CollectionReference<DocumentData>}
	 *
	 * @example
	 * const collection = Database.getCollection("employees");
	 * // => CollectionReference
	 */
	static getCollection(collection) {
		return this.#db.collection(collection);
	}

	/**
	 *
	 * @param {CollectionName} collection
	 * @returns {Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>>}
	 *
	 * @example
	 * const shifts = await Database.getDocs("info");
	 * // => QuerySnapshot
	 * @example
	 * const shifts = Database.getDocs("items").then(querySnapshot => {
		 querySnapshot.forEach(doc => {
			console.log(doc.data());
		 })
	 })
	 */
	static async getDocs(collection) {
		const db = this.getCollection(collection);
		const converter = this.#getFirestoreConverter(collection);
		return db.withConverter(converter).get();
	}

	/**
	 * Retrieves collections from the database.
	 *
	 * @return {Promise<CollectionReference<DocumentData>[]>} A promise that resolves to an array of collections.
	 */
	static async getCollections() {
		return this.#db.listCollections();
	}


	/**
	 * @param {CollectionName} collection
	 * @returns {FirestoreDataConverter | null}
	 * @description
	 * Returns the converter for the given collection
	 */

	static #getFirestoreConverter(collection) {
		switch(collection) {
		case "employees":
			return Employee.EmployeeConverter;
		case "workplace":
			return Workplace.WorkplaceConverter;
		default:
			return null;
		}
	}
}


// todo: make paystubs db crud
/**
 * @typedef { "employees" | "paystubs"} CollectionName
 * @enum
 * @description
 * The name of the collection in the database
 */

module.exports = Database;