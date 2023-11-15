const {initializeApp, applicationDefault, cert} = require("firebase-admin/app");
const {getFirestore,CollectionReference, Timestamp, FieldValue, Filter,FieldPath, FirestoreDataConverter,QueryDocumentSnapshot,DocumentData, DocumentReference, WriteResult} = require("firebase-admin/firestore");

const serviceAccount = require("../../firestore/service-account.json");

const Shift = require("../Shift");
const Employee = require("../Employee");

//todo: delete crud
class Database {
	static #app = initializeApp({
		credential: cert(serviceAccount)
	});
	static #db = getFirestore(this.#app);



	/**
	 *
	 * @param {Employee} employee employee object to be updated
	 * @returns {Promise<WriteResult>} the result of the update
	 */
	static updateEmployee(employee) {
		return this.updateDoc("employees", employee.id, employee);
	}

	/**
	 *
	 * @param {CollectionName} collection name of collection
	 * @param {string} id id (name) of document to update
	 * @param {Promise<WriteResult>} data
	 */
	static updateDoc(collection, id, data) {
		const db = this.getCollection(collection);
		const converter = this.#getFirestoreConverter(collection);
		return db.withConverter(converter).doc(id).update(data);
	}


	/**
	 *
	 * @param {Employee} employee employee object to be added
	 * @returns
	 */
	static addEmployee(employee) {
		return this.addDoc("employees", employee);
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
	static addDoc(collection, data) {
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

	static getEmployee(id) {
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
	static getEmployees() {
		return this.getDocs("employees");
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
	static getDocs(collection) {
		const db = this.getCollection(collection);
		const converter = this.#getFirestoreConverter(collection);
		return db.withConverter(converter).get();
	}

	/**
	 * Retrieves collections from the database.
	 *
	 * @return {Promise<CollectionReference<DocumentData>[]>} A promise that resolves to an array of collections.
	 */
	static getCollections() {
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