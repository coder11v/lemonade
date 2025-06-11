// TODO: Replace with your Firebase project's configuration object
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// <!-- Include these scripts in your HTML file before firebase.js -->
// <!-- Firebase App (the core Firebase SDK) is always required and must be listed first -->
// <!-- <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js"></script> -->
// <!-- Add SDKs for Firebase products that you want to use, e.g., Firestore -->
// <!-- <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore-compat.js"></script> -->
// <!-- <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-auth-compat.js"></script> -->


/**
 * Initializes Firebase with the provided configuration.
 * This function should be called by HTML pages that need Firebase services.
 * @param {object} config - The Firebase configuration object.
 * @returns {boolean} True if initialization was successful or already initialized, false otherwise.
 */
function initFirebase(config) {
    if (typeof firebase === 'undefined') {
        console.error("Firebase SDK not loaded. Ensure Firebase scripts are included in your HTML before firebase.js.");
        return false;
    }

    // Check if Firebase is already initialized
    if (firebase.apps.length) {
        console.log("Firebase already initialized.");
        return true;
    }

    // Basic check for placeholder values
    if (!config || config.apiKey === "YOUR_API_KEY" || config.projectId === "YOUR_PROJECT_ID") {
        console.warn("Firebase configuration is missing or uses placeholder values. Please update firebase.js with your actual Firebase project config.");
        // Optionally, you could prevent initialization here, but for now, we'll let it try and fail if the config is truly invalid.
        // return false;
    }

    try {
        firebase.initializeApp(config);
        console.log("Firebase initialized successfully.");
        return true;
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        return false;
    }
}

/**
 * Adds a new order to the Firestore "orders" collection.
 * @param {object} orderData - An object containing order details (e.g., { name, email, quantity, paymentMethod, status }).
 * @returns {Promise<firebase.firestore.DocumentReference>} A promise that resolves with the DocumentReference of the newly added order, or rejects on error.
 */
async function addOrder(orderData) {
    if (typeof firebase === 'undefined' || !firebase.apps.length || typeof firebase.firestore === 'undefined') {
        console.error("Firebase or Firestore is not initialized or SDK not loaded.");
        return Promise.reject(new Error("Firebase/Firestore not initialized."));
    }

    const db = firebase.firestore();
    try {
        const docRef = await db.collection("orders").add({
            ...orderData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Adds a server-side timestamp
            status: orderData.status || "pending" // Default status if not provided
        });
        console.log("Order added with ID: ", docRef.id);
        return docRef;
    } catch (error) {
        console.error("Error adding order to Firestore: ", error);
        return Promise.reject(error);
    }
}

/**
 * Fetches all documents from the "orders" collection in Firestore, ordered by creation time.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of order objects (each including its ID), or rejects on error.
 */
async function getOrders() {
    if (typeof firebase === 'undefined' || !firebase.apps.length || typeof firebase.firestore === 'undefined') {
        console.error("Firebase or Firestore is not initialized or SDK not loaded.");
        return Promise.reject(new Error("Firebase/Firestore not initialized."));
    }

    const db = firebase.firestore();
    try {
        const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
        const orders = snapshot.docs.map(doc => ({
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

// Example of how you might call initFirebase from an HTML file:
// <script>
//   // This would typically be defined in a separate config file or directly here if not sensitive
//   const firebaseConfig = { /* ... your actual config ... */ };
//   if (typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
//     initFirebase(firebaseConfig);
//   } else {
//     console.warn("Firebase config not found or is a placeholder. App will not connect to Firebase.");
//     // Optionally disable Firebase-dependent features here
//   }
// </script>
