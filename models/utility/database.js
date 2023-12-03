const {initializeApp, applicationDefault, cert} = require("firebase-admin/app");
const {getFirestore,CollectionReference, Timestamp, FieldValue, Filter,FieldPath, FirestoreDataConverter,QueryDocumentSnapshot,DocumentData, arrayUnion, DocumentReference, WriteResult, doc, deleteDoc} = require("firebase-admin/firestore");
const {createUser, getAuth} = require("firebase-admin/auth");
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
	static #auth = getAuth(this.#app);

	static async addExpense(expense) {
		return this.addDoc("expense", expense);
	}

	static async getExpenseList() {
		try {
			const querySnapshot = await this.#db.collection("expense").get();
			if (!querySnapshot.empty) {
				return querySnapshot.docs.map(doc => doc.data());
			} else {
				return "Query is empty";
			}
		} catch (error) {
			return error;
		}
	}

	//#region  Employee
	/**
	 *
	 * @param {string} id the id of the employee
	 * @returns {Promise<DocumentReference<Employee>>}
	 */
	static async getEmployee(id) {
		try {
			const querySnapshot = await this.#db.collection("employees").where("uid", "==", id).get();
			//returns the first entry as we are only expecting one return value
			if (!querySnapshot.empty) {
				return querySnapshot.docs[0].data(); // Returns the data of the first document
			} else {
				return null;
			}

		} catch (error) {
			return null;
		}
	}
	
	/**
	 * Gets all employees from firestore
	 * @returns {Promise<FirebaseFirestore.QuerySnapshot<Employee>>}
	 */
	static async getEmployees() {
		return this.getDocs("employees");
	}
	
	/**
	 * Gets all managers from firestore
	 * @returns {Promise<FirebaseFirestore.QuerySnapshot<Manager>>}
	 */
	static async getManagers() {
		return this.#db.collection("employees")
			.withConverter(Employee.EmployeeConverter)
			.where("permissions", "==", "Yes")
			.get();
	}
	static async getEmployeeClock(id) {
		try {
			const querySnapshot = await this.#db.collection("employees").where("employeeID", "==", id)
				.withConverter(this.#getFirestoreConverter("employees"))
				.get();
			//returns the first entry as we are only expecting one return value
			if (!querySnapshot.empty) {
				console.log(querySnapshot.docs[0].data());
				//console.log(querySnapshot.docs[0].data())
				return querySnapshot.docs[0].data(); // Returns the data of the first document
			} else {
				return null;
			}

		} catch (error) {
			return null;
		}
	}
	static async deleteDocument(collection, id) {
		try {
			const docRef = this.#db.collection(collection).doc(id);
			await docRef.delete();
		} catch(error) {
			console.log(error);
		}
	}

	static async getEmployeeByEmpID(id) {
		try {
			const querySnapshot = await this.#db.collection("employees").withConverter(Employee.EmployeeConverter).where("employeeID", "==", id).get();
			//returns the first entry as we are only expecting one return value
			if (!querySnapshot.empty) {
				return querySnapshot.docs[0].data(); // Returns the data of the first document
			} else {
				return null;
			}

		} catch (error) {
			return null;
		}
	}

	static async getEmployeeList(id) {
		try {
			const querySnapshot = await this.#db.collection("employees").where("manager", "==", id).get();
			//returns the first entry as we are only expecting one return value
			if (!querySnapshot.empty) {
				return querySnapshot.docs.map(doc => doc.data());
			} else {
				return "Query is empty";
			}

		} catch (error) {
			return error;
		}
	}

	/**
	 * @param {string} employeeID the id of the employee to be updated
	 * @param {Employee} employee employee object to be updated
	 * @returns {Promise<WriteResult>} the result of the update
	 */
	static async updateEmployee(employeeID, employee) {
		return this.updateDoc("employees", employeeID, employee);
	}

	/**
	 *
	 * @param {Employee} employee employee object to be added
	 * @returns {Promise<DocumentReference<Employee>>} the newly added document
	 */
	static async addEmployeeToFirestore(collection, data, employeeID) {
		try {
			const db = this.getCollection(collection);
			const converter = this.#getFirestoreConverter(collection);
			return db.withConverter(converter).doc(employeeID).set(data);
		}
		catch(error) {
			console.log(error);
		}
	}

	static async addEmployeeToAuth(email, password, employeeID, employee) {
		try {
			const userRecord = await this.#auth.createUser({
				email: email,
				emailVerified: false,
				password: password,
				displayName: employeeID,
				disabled: false,
			});

			console.log("Successfully created new user:", userRecord.uid);
			const employeeJson = {
				employeeID: employee.employeeID,
				firstName: employee.firstName,
				lastName: employee.lastName,
				department: employee.department,
				permissions: employee.permissions,
				status: employee.status,
				manager: employee.manager,
				shifts: [],
				uid: userRecord.uid
			};
			await this.addEmployeeToFirestore("employees", employeeJson, employeeID);
		}
		catch (error) {
			console.error("Error creating new user:", error);
			throw error;
		}
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
		//	shiftList.push("Pizza");
		var data = {   shifts: shiftList };
		return db.withConverter(converter).doc(employee.employeeID).update(data);
	}

	static async addEmployeeShift(collection, employee) {
		const db = this.getCollection(collection);
		const converter = this.#getFirestoreConverter(collection);
		var shiftList = employee.shiftToArray();
		shiftList.push("Pizza");
		var data = {   shifts: shiftList };
		return db.withConverter(converter).doc(employee.employeeID).update(data);
	}
	/**
	 *
	 * @param {CollectionName} collection the collection name
	 * @param {*} data data to upload
	 * @returns {Promise<DocumentReference<DocumentData>>} the document reference of the uploaded data in firestore
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
	 */
	static getCollection(collection) {
		return this.#db.collection(collection);
	}

	/**
	 *
	 * @param {CollectionName} collection
	 * @returns {Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>>}
	 */
	static async getDocs(collection) {
		const db = this.getCollection(collection);
		const converter = this.#getFirestoreConverter(collection);
		return db.withConverter(converter).get();
	}

	static async getWorkplace() {
		try {
			const querySnapshot = await this.#db.collection("workplace")
				.withConverter(this.#getFirestoreConverter("workplace"))
				.get();
			//returns the first entry as we are only expecting one return value
			if (!querySnapshot.empty) {
				return querySnapshot.docs.map(doc => doc.data());
			} else {
				return "Query is empty";
			}

		} catch (error) {
			return error;
		}
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

/**
 * @typedef { "employees" | "paystubs", "workplace"} CollectionName
 * @enum
 * @description
 * The name of the collection in the database
 */

module.exports = Database;