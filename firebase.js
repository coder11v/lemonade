// Import necessary Firebase modules using ESM syntax from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Provided Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUffJguVLRrLLOMunW_J6aZbdvGGXqELY",
  authDomain: "lemonade-stand-vib.firebaseapp.com",
  projectId: "lemonade-stand-vib",
  storageBucket: "lemonade-stand-vib.firebasestorage.app",
  messagingSenderId: "1041534298174",
  appId: "1:1041534298174:web:f5ddb29e41f89a96c8096f",
  measurementId: "G-HF14PBNQXJ"
};

// Module-level variables for Firebase app and Firestore database instances
let app;
let db;
let isInitialized = false;

/**
 * Initializes the Firebase app and Firestore database.
 * This function should be called once when the application loads.
 * @returns {boolean} True if initialization was successful or already done, false on error.
 */
function initFirebase() {
    if (isInitialized) {
        console.log("Firebase already initialized.");
        return true;
    }

    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        isInitialized = true;
        console.log("Firebase initialized successfully with Modular SDK.");
        return true;
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        isInitialized = false;
        return false;
    }
}

/**
 * Adds a new order to the Firestore "orders" collection using Modular SDK.
 * @param {object} orderData - An object containing order details (e.g., { name, email, quantity, paymentMethod, status }).
 * @returns {Promise<import("firebase/firestore").DocumentReference>} A promise that resolves with the DocumentReference of the newly added order, or rejects on error.
 */
async function addOrder(orderData) {
    if (!isInitialized) {
        console.error("Firebase not initialized. Call initFirebase() first.");
        return Promise.reject(new Error("Firebase not initialized."));
    }

    try {
        const newOrderData = {
            ...orderData,
            createdAt: serverTimestamp(), // Firestore server-side timestamp
            status: orderData.status || "pending" // Default status
        };
        const docRef = await addDoc(collection(db, "orders"), newOrderData);
        console.log("Order added with ID: ", docRef.id);
        return docRef;
    } catch (error) {
        console.error("Error adding order to Firestore: ", error);
        return Promise.reject(error);
    }
}

/**
 * Fetches all documents from the "orders" collection in Firestore, ordered by creation time, using Modular SDK.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of order objects (each including its ID), or rejects on error.
 */
async function getOrders() {
    if (!isInitialized) {
        console.error("Firebase not initialized. Call initFirebase() first.");
        return Promise.reject(new Error("Firebase not initialized."));
    }

    try {
        const ordersCollectionRef = collection(db, "orders");
        const q = query(ordersCollectionRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const orders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Orders fetched successfully:", orders);
        return orders;
    } catch (error) {
        console.error("Error fetching orders from Firestore: ", error);
        return Promise.reject(error);
    }
}

// Export the functions and config for use in other modules (HTML script type="module")
export { initFirebase, addOrder, getOrders, firebaseConfig };
