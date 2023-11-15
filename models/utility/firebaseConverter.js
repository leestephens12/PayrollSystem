// converter object for firebase to easily convert between javascript classes and firestore objects


/**
 * @template T the model class
 * @template U - the database object model; the object (plain javascript object) that is stored in the database
 * @typedef {FirestoreDataConverter} FirebaseConverter
 * @property {fromFirestore<T>} fromFirestore
 * @property {toFirestore<T>} toFirestore
 */

/**
 * @template T
 * @typedef {object} FirebaseDocumentSnapshot
 * @property {function(): T} data
 * @property {function(field:string|FieldPath):any} get
 */


/**
 * @template T
 * @template U
 * @typedef {function(n,m)} fromFirestore
 * @param {FirebaseDocumentSnapshot<U>} snapshot
 * @param {number} options
 * @returns {T}
 */

/**
 * @template T
 * @template U
 *
 * @typedef {function(n)} toFirestore
 * @param {T} value
 * @returns {DocumentData | Object | U} - a plain javascript object; key/value pairs
 */