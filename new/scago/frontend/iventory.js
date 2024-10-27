// manageInventory.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

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

const inventoryTable = document.getElementById('inventoryTable');

// Function to fetch and display items from Firestore
async function displayInventory() {
    inventoryTable.innerHTML = ''; // Clear existing table rows

    // Get all items from 'items' collection
    const querySnapshot = await getDocs(collection(db, "items"));
    querySnapshot.forEach((doc) => {
        const item = doc.data();
        const itemId = doc.id;

        // Create table row for each item
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.barcode}</td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>
                <input type="number" id="quantity-${itemId}" value="${item.quantity || 0}" min="0" style="width: 60px;">
            </td>
            <td>
                <button onclick="deleteItem('${itemId}')">Delete</button>
                <button onclick="updateQuantity('${itemId}')">Update Quantity</button>
            </td>
        `;
        inventoryTable.appendChild(row);
    });
}

// Function to delete an item from Firestore
window.deleteItem = async function(itemId) {
    if (confirm("Are you sure you want to delete this item?")) {
        await deleteDoc(doc(db, "items", itemId));
        alert("Item deleted successfully!");
        displayInventory(); // Refresh the inventory display
    }
};

// Function to update the quantity of an item
window.updateQuantity = async function(itemId) {
    const quantityInput = document.getElementById(`quantity-${itemId}`);
    const newQuantity = parseInt(quantityInput.value);

    if (isNaN(newQuantity) || newQuantity < 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    await updateDoc(doc(db, "items", itemId), {
        quantity: newQuantity
    });

    alert("Quantity updated successfully!");
};

// Load inventory on page load
displayInventory();
