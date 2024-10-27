// newItem.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyALf0kWiEBWKBUHOCWOLwwbshc8678CQ_M",
    authDomain: "sass-66c7f.firebaseapp.com",
    projectId: "sass-66c7f",
    storageBucket: "sass-66c7f.appspot.com",
    messagingSenderId: "485007199733",
    appId: "1:485007199733:web:dbf3c7c8a05f6ab03324bc",
    measurementId: "G-HS4N83RJ1P"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get form input elements
const codeInput = document.getElementById('code');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const submitButton = document.getElementById('btn11');

// Add event listener to the Submit button
submitButton.addEventListener('click', async (event) => {
    event.preventDefault();

    // Get values from input fields
    const code = codeInput.value.trim();
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);

    // Basic input validation
    if (!code || !name || isNaN(price)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    try {
        // Add item to Firestore collection 'items'
        await addDoc(collection(db, "items"), {
            barcode: code,
            name: name,
            price: price
        });

        alert("Item added successfully!");

        // Clear input fields
        codeInput.value = "";
        nameInput.value = "";
        priceInput.value = "";
    } catch (error) {
        console.error("Error adding item:", error);
        alert("Failed to add item: " + error.message);
    }
});
