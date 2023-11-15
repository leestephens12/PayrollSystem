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



	static updateEmployee(employee) {
		return this.updateDoc("employees", employee.id, employee);
	}
	static updateShift(shift) {
		return this.updateDoc("shifts", shift.id, shift);
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
	 * Adds a shift to the "shifts" collection.
	 *
	 * @param {Shift} shift - The shift object to be added.
	 */
	static addShift(shift) {
		return this.addDoc("shifts", shift);
	}
	/**
	 *
	 * @param {CollectionName} collection the collection name
	 * @param {*} data data to upload
	 * @returns {Promise<DocumentReference<DocumentData>>} the document reference of the uploaded data in firestore
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
	 */
	static getCollection(collection) {
		return this.#db.collection(collection);
	}

	/**
	 *
	 * @returns {Promise<FirebaseFirestore.QuerySnapshot<Employee>>}
	 */
	static getEmployees() {
		return this.getDocs("employees");
	}
	/**
	 *
	 * @returns {Promise<FirebaseFirestore.QuerySnapshot<Shift>>}
	 */
	static getShifts() {
		return this.getDocs("shifts");
	}

	/**
	 *
	 * @param {CollectionName} collection
	 * @returns {Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>>}
	 */
	static getDocs(collection) {
		const db = this.getCollection(collection);
		const converter = this.#getFirestoreConverter(collection);
		return db.withConverter(converter).get();
	}

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
		case "shifts":
			return Shift.firebaseConverter;
		default:
			return null;
		}
	}
}
// todo: make paystubs db crud
/**
 * @typedef {"shifts" | "employees" | "paystubs"} CollectionName
 * @enum
 * @description
 * The name of the collection in the database
 */


module.exports = Database;